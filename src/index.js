'use strict';

const nextID = require('makeup-next-id');
const ExitEmitter = require('makeup-exit-emitter');
const focusables = require('makeup-focusables');

const defaultOptions = {
    autoCollapse: false,
    click: false,
    contentSelector: '.expander__content',
    focus: false,
    focusManagement: null,
    hostContainerClass: 'expander__host-container',
    hostSelector: '.expander__host',
    hover: false,
    spacebar: false
};

// when options.click is true, we set a flag onkeydown if spacebar or enter are pressed
function _onKeyDown(e) {
    const keyCode = e.keyCode;

    if (keyCode === 13 || keyCode === 32) {
        this.keyDownFlag = true;

        // if hostEl does not naturally trigger click events, we can force one to trigger here.
        // careful! if host already triggers click events naturally, we end up with a "double-click".
        if (keyCode === 32 && this.options.spacebar === true) {
            this.hostEl.click();
        }
    }
}

module.exports = class {
    constructor(el, selectedOptions) {
        this.options = Object.assign({}, defaultOptions, selectedOptions);

        this.el = el;
        this.hostEl = el.querySelector(this.options.hostSelector); // the keyboard focusable host el
        this.expandeeEl = el.querySelector(this.options.contentSelector);
        this.hostContainerEl = null;
        this.hostContainerExpandedClass = `${this.options.hostContainerClass}--expanded`;

        // ensure the widget and expandee have an id
        nextID(this.el, 'expander');
        this.expandeeEl.id = `${this.el.id}-content`;

        ExitEmitter.addFocusExit(this.el);

        this._hostKeyDownListener = _onKeyDown.bind(this);
        this._hostClickListener = this.toggle.bind(this);
        this._hostFocusListener = this.expand.bind(this);
        this._hostHoverListener = this.expand.bind(this);

        this._focusExitListener = this.collapse.bind(this);
        this._mouseLeaveListener = this.collapse.bind(this);

        // if the host el is nested one level deep we need a reference to it's container
        if (this.hostEl.parentNode !== this.el) {
            this.hostContainerEl = this.hostEl.parentNode;
            this.hostContainerEl.classList.add(this.options.hostContainerClass);
        }

        if (this.expandeeEl) {
            this.hostEl.setAttribute('aria-controls', this.expandeeEl.id);

            if (this.hostEl.getAttribute('aria-expanded') === null) {
                this.hostEl.setAttribute('aria-expanded', 'false');
            }

            this.click = this.options.click;
            this.focus = this.options.focus;
            this.hover = this.options.hover;

            this.autoCollapse = this.options.autoCollapse;
        }
    }

    set autoCollapse(bool) {
        // hover and focus expanders will always collapse
        if (this.options.focus === true || this.options.hover === true || this.options.autoCollapse === true) {
            this.el.addEventListener('focusExit', this._focusExitListener);
            this.el.addEventListener('mouseleave', this._mouseLeaveListener);

            if (this.options.focus !== true) {
                this.hostEl.addEventListener('focus', this._focusExitListener);
            }
        } else {
            this.el.removeEventListener('mouseleave', this._mouseLeaveListener);
            this.el.removeEventListener('focusExit', this._focusExitListener);
            this.hostEl.removeEventListener('focus', this._focusExitListener);
        }
    }

    set click(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('keydown', this._hostKeyDownListener);
            if (this.hostContainerEl) {
                this.hostContainerEl.addEventListener('click', this._hostClickListener);
            } else {
                this.hostEl.addEventListener('click', this._hostClickListener);
            }
        } else {
            this.hostEl.removeEventListener('keydown', this._hostKeyDownListener);
            if (this.hostContainerEl) {
                this.hostContainerEl.removeEventListener('click', this._hostClickListener);
            } else {
                this.hostEl.removeEventListener('click', this._hostClickListener);
            }
        }
    }

    set focus(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('focus', this._hostFocusListener);
        } else {
            this.hostEl.removeEventListener('focus', this._hostFocusListener);
        }
    }

    set hover(bool) {
        if (bool === true) {
            if (this.hostContainerEl) {
                this.hostContainerEl.addEventListener('mouseenter', this._hostHoverListener);
            } else {
                this.hostEl.addEventListener('mouseenter', this._hostHoverListener);
            }
        } else {
            if (this.hostContainerEl) {
                this.hostContainerEl.removeEventListener('mouseenter', this._hostHoverListener);
            } else {
                this.hostEl.removeEventListener('mouseenter', this._hostHoverListener);
            }
        }
    }

    isExpanded() {
        return this.hostEl.getAttribute('aria-expanded') === 'true';
    }

    collapse() {
        if (this.isExpanded() === true) {
            this.hostEl.setAttribute('aria-expanded', 'false');
            if (this.hostContainerEl) {
                this.hostContainerEl.classList.remove(this.hostContainerExpandedClass);
            }
            this.el.dispatchEvent(new CustomEvent('expander-collapse', { bubbles: true, detail: this.expandeeEl }));
        }
    }

    expand(isKeyboard) {
        if (this.isExpanded() === false) {
            this.hostEl.setAttribute('aria-expanded', 'true');
            if (this.hostContainerEl) {
                this.hostContainerEl.classList.add(this.hostContainerExpandedClass);
            }
            if (isKeyboard === true) {
                const focusManagement = this.options.focusManagement;

                if (focusManagement === 'content') {
                    this.expandeeEl.setAttribute('tabindex', '-1');
                    this.expandeeEl.focus();
                } else if (focusManagement === 'focusable') {
                    focusables(this.expandeeEl)[0].focus();
                } else if (focusManagement === 'interactive') {
                    focusables(this.expandeeEl, true)[0].focus();
                } else if (focusManagement !== null) {
                    const el = this.expandeeEl.querySelector(`#${focusManagement}`);
                    if (el) {
                        el.focus();
                    }
                }
            }
            this.el.dispatchEvent(new CustomEvent('expander-expand', { bubbles: true, detail: this.expandeeEl }));
        }
    }

    toggle() {
        if (this.isExpanded() === true) {
            this.collapse();
        } else {
            this.expand(this.keyDownFlag);
        }
        this.keyDownFlag = false;
    }
};
