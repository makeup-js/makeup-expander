'use strict';

const nextID = require('makeup-next-id');
const ExitEmitter = require('makeup-exit-emitter');
const focusables = require('makeup-focusables');

const defaultOptions = {
    alwaysDoFocusManagement: false, // in the case we want mouse click to move focus (e.g. menu buttons)
    autoCollapse: false,
    collapseOnFocusOut: false,
    collapseOnMouseOut: false,
    collapseOnClickOut: false,
    contentSelector: '.expander__content',
    expandedClass: null,
    expandOnClick: false,
    expandOnFocus: false,
    expandOnHover: false,
    focusManagement: null,
    hostSelector: '.expander__host',
    simulateSpacebarClick: false
};

// when options.expandOnClick is true, we set a flag if spacebar or enter are pressed
// the idea being that this flag is set BEFORE the click event
function _onKeyDown(e) {
    const keyCode = e.keyCode;

    if (keyCode === 13 || keyCode === 32) {
        this.keyDownFlag = true;

        // if host element does not naturally trigger a click event on spacebar, we can force one to trigger here.
        // careful! if host already triggers click events naturally, we end up with a "double-click".
        if (keyCode === 32 && this.options.simulateSpacebarClick === true) {
            this.hostEl.click();
        }
    }
}

function processDocumentClick(event, el) {
    if (el.contains(event.target) === false) {
        el.dispatchEvent(new CustomEvent('clickOut', {
            bubbles: false
        }));
    }
}

function _onDocumentClick(e) {
    processDocumentClick(e, this.el);
}

function _onDocumentTouchStart() {
    this.documentClick = true;
}

function _onDocumentTouchMove() {
    this.documentClick = false;
}

function _onDocumentTouchEnd(e) {
    if (this.documentClick) {
        this.documentClick = false;
        processDocumentClick(e, this.el);
    }
}

module.exports = class {
    constructor(el, selectedOptions) {
        this.options = Object.assign({}, defaultOptions, selectedOptions);

        this.el = el;
        this.hostEl = el.querySelector(this.options.hostSelector); // the keyboard focusable host el
        this.expandeeEl = el.querySelector(this.options.contentSelector);
        this.keyDownFlag = false;
        this.documentClick = false;

        // ensure the widget and expandee have an id
        nextID(this.el, 'expander');
        nextID(this.expandeeEl, `${this.el.id}-content`);

        ExitEmitter.addFocusExit(this.el);

        this._hostKeyDownListener = _onKeyDown.bind(this);
        this._documentClickListener = _onDocumentClick.bind(this);
        this._documentTouchStartListener = _onDocumentTouchStart.bind(this);
        this._documentTouchMoveListener = _onDocumentTouchMove.bind(this);
        this._documentTouchEndListener = _onDocumentTouchEnd.bind(this);

        this._hostClickListener = this.toggle.bind(this);
        this._hostFocusListener = this.expand.bind(this);
        this._hostHoverListener = this.expand.bind(this);

        this._focusExitListener = this.collapse.bind(this);
        this._mouseLeaveListener = this.collapse.bind(this);
        this._clickOutListener = this.collapse.bind(this);

        if (this.hostEl.getAttribute('aria-expanded') === null) {
            this.hostEl.setAttribute('aria-expanded', 'false');
        }

        this.hostEl.setAttribute('aria-controls', this.expandeeEl.id);

        this.expandOnClick = this.options.expandOnClick;
        this.expandOnFocus = this.options.expandOnFocus;
        this.expandOnHover = this.options.expandOnHover;

        if (this.options.autoCollapse === false) {
            this.collapseOnClickOut = this.options.collapseOnClickOut;
            this.collapseOnFocusOut = this.options.collapseOnFocusOut;
            this.collapseOnMouseOut = this.options.collapseOnMouseOut;
        }
    }

    set expandOnClick(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('keydown', this._hostKeyDownListener);
            this.hostEl.addEventListener('click', this._hostClickListener);

            if (this.options.autoCollapse === true) {
                this.collapseOnClickOut = true;
                this.collapseOnFocusOut = true;
            }
        } else {
            this.hostEl.removeEventListener('click', this._hostClickListener);
            this.hostEl.removeEventListener('keydown', this._hostKeyDownListener);
        }
    }

    set expandOnFocus(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('focus', this._hostFocusListener);

            if (this.options.autoCollapse === true) {
                this.collapseOnClickOut = true;
                this.collapseOnFocusOut = true;
            }
        } else {
            this.hostEl.removeEventListener('focus', this._hostFocusListener);
        }
    }

    set expandOnHover(bool) {
        if (bool === true) {
            this.hostEl.addEventListener('mouseenter', this._hostHoverListener);

            if (this.options.autoCollapse === true) {
                this.collapseOnMouseOut = true;
            }
        } else {
            this.hostEl.removeEventListener('mouseenter', this._hostHoverListener);
        }
    }

    set collapseOnClickOut(bool) {
        if (bool === true) {
            document.addEventListener('click', this._documentClickListener);
            document.addEventListener('touchstart', this._documentTouchStartListener);
            document.addEventListener('touchmove', this._documentTouchMoveListener);
            document.addEventListener('touchend', this._documentTouchEndListener);
            this.el.addEventListener('clickOut', this._clickOutListener);
        } else {
            this.el.removeEventListener('clickOut', this._clickOutListener);
            document.removeEventListener('click', this._documentClickListener);
            document.removeEventListener('touchstart', this._documentTouchStartListener);
            document.removeEventListener('touchmove', this._documentTouchMoveListener);
            document.removeEventListener('touchend', this._documentTouchEndListener);
        }
    }

    set collapseOnFocusOut(bool) {
        if (bool === true) {
            this.el.addEventListener('focusExit', this._focusExitListener);
        } else {
            this.el.removeEventListener('focusExit', this._focusExitListener);
        }
    }

    set collapseOnMouseOut(bool) {
        if (bool === true) {
            this.el.addEventListener('mouseleave', this._mouseLeaveListener);
        } else {
            this.el.removeEventListener('mouseleave', this._mouseLeaveListener);
        }
    }

    // todo replace with expanded getter
    isExpanded() {
        return this.hostEl.getAttribute('aria-expanded') === 'true';
    }

    // todo replace with expanded setter
    collapse() {
        if (this.isExpanded() === true) {
            this.hostEl.setAttribute('aria-expanded', 'false');
            if (this.options.expandedClass) {
                this.el.classList.remove(this.options.expandedClass);
            }
            this.el.dispatchEvent(new CustomEvent('expander-collapse', { bubbles: true, detail: this.expandeeEl }));
        }
    }

    // todo: refactor to remove "isKeyboard" param
    // todo replace with expanded setter
    expand(isKeyboard) {
        if (this.isExpanded() === false) {
            this.hostEl.setAttribute('aria-expanded', 'true');
            if (this.options.expandedClass) {
                this.el.classList.add(this.options.expandedClass);
            }
            // todo: refactor focus management. We could run into a bad situation where mouse hover moves focus.
            if (isKeyboard === true || this.options.alwaysDoFocusManagement === true) {
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

    // todo: rename this method
    cancelAsync() {
        this.expandOnClick = false;
        this.expandOnFocus = false;
        this.expandOnHover = false;
        this.collapseOnClickOut = false;
        this.collapseOnFocusOut = false;
        this.collapseOnMouseOut = false;
    }

    destroy() {
        this.cancelAsync();

        this._hostKeyDownListener = null;
        this._documentClickListener = null;
        this._documentTouchStartListener = null;
        this._documentTouchMoveListener = null;
        this._documentTouchEndListener = null;
        this._hostClickListener = null;
        this._hostFocusListener = null;
        this._hostHoverListener = null;
        this._focusExitListener = null;
        this._mouseLeaveListener = null;
        this._clickOutListener = null;

        this._destroyed = true;
    }
};
