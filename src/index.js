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
    hostSelector: '.expander__host',
    hover: false,
    hostType: null,
    ariaHostSelector: null,
    expandedClass: null
};

function _onKeyDown() {
    this.keyDownFlag = true;
}

module.exports = class {
    constructor(el, selectedOptions) {
        this.options = Object.assign({}, defaultOptions, selectedOptions);

        this.el = el;
        this.hostEl = el.querySelector(this.options.hostSelector);
        this.ariaHostEl = el.querySelector(this.options.ariaHostSelector) || this.hostEl;
        this.expandeeEl = el.querySelector(this.options.contentSelector);

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

        if (this.expandeeEl) {
            // the expander controls the expandee
            this.ariaHostEl.setAttribute('aria-controls', this.expandeeEl.id);

            if (this.ariaHostEl.getAttribute('aria-expanded') === null) {
                this.ariaHostEl.setAttribute('aria-expanded', 'false');
            }

            if (this.options.hostType === null) {
                this.options.hostType = 'button';
            }

            if (this.options.ariaHostSelector !== null && this.options.expandedClass === null) {
                this.options.expandedClass = 'expander-expanded';
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
                this.ariaHostEl.addEventListener('focus', this._focusExitListener);
            }
        } else {
            this.el.removeEventListener('mouseleave', this._mouseLeaveListener);
            this.el.removeEventListener('focusExit', this._focusExitListener);
            this.ariaHostEl.removeEventListener('focus', this._focusExitListener);
        }
    }

    set click(bool) {
        if (bool === true && this.options.hostType !== 'readonlyCombobox') {
            this.hostEl.addEventListener('keydown', this._hostKeyDownListener);
            this.hostEl.addEventListener('click', this._hostClickListener);
        } else if (bool === true && this.options.hostType === 'readonlyCombobox') {
            this.ariaHostEl.addEventListener('keydown', this.inputKeyboardClick.bind(this));
            this.ariaHostEl.addEventListener('click', this._hostClickListener);
        } else {
            this.hostEl.removeEventListener('keydown', this._hostKeyDownListener);
            this.hostEl.removeEventListener('click', this._hostClickListener);
        }
    }

    set focus(bool) {
        if (bool === true) {
            this.ariaHostEl.addEventListener('focus', this._hostFocusListener);
        } else {
            this.ariaHostEl.removeEventListener('focus', this._hostFocusListener);
        }
    }

    set hover(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('mouseenter', this._hostHoverListener);
        } else {
            this.hostEl.removeEventListener('mouseenter', this._hostHoverListener);
        }
    }

    isExpanded() {
        return this.ariaHostEl.getAttribute('aria-expanded') === 'true';
    }

    collapse() {
        if (this.isExpanded() === true) {
            if (this.options.expandedClass) {
                this.hostEl.classList.remove(this.options.expandedClass);
            }
            this.ariaHostEl.setAttribute('aria-expanded', 'false');
            this.el.dispatchEvent(new CustomEvent('expander-collapse', { bubbles: true, detail: this.expandeeEl }));
        }
    }

    expand(isKeyboard) {
        if (this.isExpanded() === false) {
            if (this.options.expandedClass) {
                this.hostEl.classList.add(this.options.expandedClass);
            }
            this.ariaHostEl.setAttribute('aria-expanded', 'true');
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

    inputKeyboardClick(e) {
        this.keyDownFlag = true;

        if (e.keyCode === 32) {
            this.toggle();
        } else if (e.keyCode === 40) {
            this.expand(this.keyDownFlag);
        }
    }
};
