'use strict';

const nextID = require('makeup-next-id');
const exitEmitter = require('makeup-exit-emitter');
const focusables = require('makeup-focusables');

const defaultOptions = {
    autoCollapse: true,
    click: false,
    contentSelector: '.expander__content',
    focus: false,
    focusManagement: null,
    hostSelector: '.expander__host',
    hover: false
};

function _onKeyDown() {
    this.keyDownFlag = true;
}

module.exports = class {
    constructor(el, selectedOptions) {
        this.options = Object.assign({}, defaultOptions, selectedOptions);

        this.el = el;
        this.hostEl = el.querySelector(this.options.hostSelector);
        this.expandeeEl = el.querySelector(this.options.contentSelector);

        // ensure the widget and expandee have an id
        nextID(this.el, 'expander');
        this.expandeeEl.id = `${this.el.id}-content`;

        exitEmitter.add(this.el);
        exitEmitter.add(this.expandeeEl);

        this._keyDownListener = _onKeyDown.bind(this);
        this._clickListener = this.toggle.bind(this);
        this._focusListener = this.expand.bind(this);
        this._hoverListener = this.expand.bind(this);

        this._exitListener = this.collapse.bind(this);
        this._expandeeExitListener = this.collapse.bind(this);
        this._leaveListener = this.collapse.bind(this);

        if (this.expandeeEl) {
            // the expander controls the expandee
            this.hostEl.setAttribute('aria-controls', this.expandeeEl.id);
            this.hostEl.setAttribute('aria-expanded', 'false');

            this.click = this.options.click;
            this.focus = this.options.focus;
            this.hover = this.options.hover;
        }
    }

    set click(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('keydown', this._keyDownListener);
            this.hostEl.addEventListener('click', this._clickListener);
            if (this.options.autoCollapse === true) {
                this.expandeeEl.addEventListener('focusExit', this._exitListener);
            }
        } else {
            this.hostEl.removeEventListener('keydown', this._keyDownListener);
            this.hostEl.removeEventListener('click', this._clickListener);
            if (this.options.autoCollapse === true) {
                this.expandeeEl.removeEventListener('focusExit', this._exitListener);
            }
        }
    }

    set focus(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('focus', this._focusListener);
            if (this.options.autoCollapse === true) {
                this.el.addEventListener('focusExit', this._expandeeExitListener);
            }
        } else {
            this.hostEl.removeEventListener('focus', this._focusListener);
            if (this.options.autoCollapse === true) {
                this.el.removeEventListener('focusExit', this._expandeeExitListener);
            }
        }
    }

    set hover(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('mouseenter', this._hoverListener);
            if (this.options.autoCollapse === true) {
                this.el.addEventListener('mouseleave', this._leaveListener);
            }
        } else {
            this.hostEl.removeEventListener('mouseenter', this._hoverListener);
            if (this.options.autoCollapse === true) {
                this.el.removeEventListener('mouseleave', this._leaveListener);
            }
        }
    }

    isExpanded() {
        return this.hostEl.getAttribute('aria-expanded') === 'true';
    }

    collapse() {
        if (this.isExpanded() === true) {
            this.hostEl.setAttribute('aria-expanded', 'false');
            this.el.dispatchEvent(new CustomEvent('collapsed', { bubbles: true, detail: this.expandeeEl }));
        }
    }

    expand(isKeyboard) {
        if (this.isExpanded() === false) {
            this.hostEl.setAttribute('aria-expanded', 'true');
            if (isKeyboard === true) {
                const focusManagement = this.options.focusManagement;

                if (focusManagement === 'content') {
                    this.expandeeEl.setAttribute('tabindex', '-1');
                    this.expandeeEl.focus();
                } else if (focusManagement === 'focusable') {
                    focusables(this.expandeeEl)[0].focus();
                } else if (focusManagement !== null) {
                    const el = this.expandeeEl.querySelector(`#${focusManagement}`);
                    if (el) {
                        el.focus();
                    }
                }
            }
            this.el.dispatchEvent(new CustomEvent('expanded', { bubbles: true, detail: this.expandeeEl }));
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
