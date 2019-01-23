$_mod.installed("makeup-expander$0.5.0", "custom-event-polyfill", "0.3.0");
$_mod.main("/custom-event-polyfill$0.3.0", "custom-event-polyfill");
$_mod.def("/custom-event-polyfill$0.3.0/custom-event-polyfill", function(require, exports, module, __filename, __dirname) { // Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
    var ce = new window.CustomEvent('test');
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
    }
} catch(e) {
  var CustomEvent = function(event, params) {
    var evt, origPrevent;
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    origPrevent = evt.preventDefault;
    evt.preventDefault = function () {
      origPrevent.call(this);
      try {
        Object.defineProperty(this, 'defaultPrevented', {
          get: function () {
            return true;
          }
        });
      } catch(e) {
        this.defaultPrevented = true;
      }
    };
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent; // expose definition to window
}

});
$_mod.installed("makeup-expander$0.5.0", "makeup-next-id", "0.0.2");
$_mod.main("/makeup-next-id$0.0.2", "");
$_mod.def("/makeup-next-id$0.0.2/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var sequenceMap = {};
var defaultPrefix = 'nid';

module.exports = function (el) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultPrefix;

    // prevent empty string
    var _prefix = prefix === '' ? defaultPrefix : prefix;

    // initialise prefix in sequence map if necessary
    sequenceMap[_prefix] = sequenceMap[_prefix] || 0;

    if (!el.id) {
        el.setAttribute('id', _prefix + '-' + sequenceMap[_prefix]++);
    }
};

});
$_mod.installed("makeup-expander$0.5.0", "makeup-exit-emitter", "0.0.4");
$_mod.main("/makeup-exit-emitter$0.0.4", "");
$_mod.installed("makeup-exit-emitter$0.0.4", "custom-event-polyfill", "0.3.0");
$_mod.installed("makeup-exit-emitter$0.0.4", "makeup-next-id", "0.0.1");
$_mod.main("/makeup-next-id$0.0.1", "");
$_mod.def("/makeup-next-id$0.0.1/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var sequenceMap = {};
var defaultPrefix = 'nid';

module.exports = function (el) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultPrefix;

    // prevent empty string
    var _prefix = prefix === '' ? defaultPrefix : prefix;

    // initialise prefix in sequence map if necessary
    sequenceMap[_prefix] = sequenceMap[_prefix] || 0;

    if (!el.id) {
        el.setAttribute('id', _prefix + '-' + sequenceMap[_prefix]++);
    }
};

});
$_mod.def("/makeup-exit-emitter$0.0.4/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nextID = require('/makeup-next-id$0.0.1/index'/*'makeup-next-id'*/);
var focusExitEmitters = {};

// requires CustomEvent polyfill for IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

function doFocusExit(el, fromElement, toElement) {
    el.dispatchEvent(new CustomEvent('focusExit', {
        detail: { fromElement: fromElement, toElement: toElement },
        bubbles: false // mirror the native mouseleave event
    }));
}

function onDocumentFocusIn(e) {
    var newFocusElement = e.target;
    var targetIsDescendant = this.el.contains(newFocusElement);

    // if focus has moved to a focusable descendant
    if (targetIsDescendant === true) {
        // set the target as the currently focussed element
        this.currentFocusElement = newFocusElement;
    } else {
        // else focus has not gone to a focusable descendant
        window.removeEventListener('blur', this.onWindowBlurListener);
        document.removeEventListener('focusin', this.onDocumentFocusInListener);
        doFocusExit(this.el, this.currentFocusElement, newFocusElement);
        this.currentFocusElement = null;
    }
}

function onWindowBlur() {
    doFocusExit(this.el, this.currentFocusElement, undefined);
}

function onWidgetFocusIn() {
    // listen for focus moving to anywhere in document
    // note that mouse click on buttons, checkboxes and radios does not trigger focus events in all browsers!
    document.addEventListener('focusin', this.onDocumentFocusInListener);
    // listen for focus leaving the window
    window.addEventListener('blur', this.onWindowBlurListener);
}

var FocusExitEmitter = function () {
    function FocusExitEmitter(el) {
        _classCallCheck(this, FocusExitEmitter);

        this.el = el;

        this.currentFocusElement = null;

        this.onWidgetFocusInListener = onWidgetFocusIn.bind(this);
        this.onDocumentFocusInListener = onDocumentFocusIn.bind(this);
        this.onWindowBlurListener = onWindowBlur.bind(this);

        this.el.addEventListener('focusin', this.onWidgetFocusInListener);
    }

    _createClass(FocusExitEmitter, [{
        key: 'removeEventListeners',
        value: function removeEventListeners() {
            window.removeEventListener('blur', this.onWindowBlurListener);
            document.removeEventListener('focusin', this.onDocumentFocusInListener);
            this.el.removeEventListener('focusin', this.onWidgetFocusInListener);
        }
    }]);

    return FocusExitEmitter;
}();

function addFocusExit(el) {
    var exitEmitter = null;

    nextID(el);

    if (!focusExitEmitters[el.id]) {
        exitEmitter = new FocusExitEmitter(el);
        focusExitEmitters[el.id] = exitEmitter;
    }

    return exitEmitter;
}

function removeFocusExit(el) {
    var exitEmitter = focusExitEmitters[el.id];

    if (exitEmitter) {
        exitEmitter.removeEventListeners();
        delete focusExitEmitters[el.id];
    }
}

module.exports = {
    addFocusExit: addFocusExit,
    removeFocusExit: removeFocusExit
};

});
$_mod.installed("makeup-expander$0.5.0", "makeup-focusables", "0.0.3");
$_mod.main("/makeup-focusables$0.0.3", "");
$_mod.def("/makeup-focusables$0.0.3/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusableElList = ['a[href]', 'area[href]', 'button:not([disabled])', 'embed', 'iframe', 'input:not([disabled])', 'object', 'select:not([disabled])', 'textarea:not([disabled])', '*[tabindex]', '*[contenteditable]'];

var focusableElSelector = focusableElList.join();

module.exports = function (el) {
    var keyboardOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var focusableEls = Array.prototype.slice.call(el.querySelectorAll(focusableElSelector));

    // filter out elements with display: none
    focusableEls = focusableEls.filter(function (focusableEl) {
        return window.getComputedStyle(focusableEl).display !== 'none';
    });

    if (keyboardOnly === true) {
        focusableEls = focusableEls.filter(function (focusableEl) {
            return focusableEl.getAttribute('tabindex') !== '-1';
        });
    }

    return focusableEls;
};

});
$_mod.def("/makeup-expander$0.5.0/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nextID = require('/makeup-next-id$0.0.2/index'/*'makeup-next-id'*/);
var ExitEmitter = require('/makeup-exit-emitter$0.0.4/index'/*'makeup-exit-emitter'*/);
var focusables = require('/makeup-focusables$0.0.3/index'/*'makeup-focusables'*/);

var defaultOptions = {
    autoCollapse: false,
    collapseOnFocusOut: false,
    collapseOnMouseOut: false,
    collapseOnClickOut: false,
    contentSelector: '.expander__content',
    expandOnClick: false,
    expandOnFocus: false,
    expandOnHover: false,
    focusManagement: null,
    expandedClass: null,
    hostSelector: '.expander__host',
    simulateSpacebarClick: false
};

// when options.expandOnClick is true, we set a flag if spacebar or enter are pressed
// the idea being that this flag is set BEFORE the click event
function _onKeyDown(e) {
    var keyCode = e.keyCode;

    if (keyCode === 13 || keyCode === 32) {
        this.keyDownFlag = true;

        // if hostEl does not naturally trigger click events, we can force one to trigger here.
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

module.exports = function () {
    function _class(el, selectedOptions) {
        _classCallCheck(this, _class);

        this.options = _extends({}, defaultOptions, selectedOptions);

        this.el = el;
        this.hostEl = el.querySelector(this.options.hostSelector); // the keyboard focusable host el
        this.expandeeEl = el.querySelector(this.options.contentSelector);
        this.documentClick = false;

        // ensure the widget and expandee have an id
        nextID(this.el, 'expander');
        nextID(this.expandeeEl, this.el.id + '-content');

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

    _createClass(_class, [{
        key: 'isExpanded',
        value: function isExpanded() {
            return this.hostEl.getAttribute('aria-expanded') === 'true';
        }
    }, {
        key: 'collapse',
        value: function collapse() {
            if (this.isExpanded() === true) {
                this.hostEl.setAttribute('aria-expanded', 'false');
                if (this.options.expandedClass) {
                    this.el.classList.remove(this.options.expandedClass);
                }
                this.el.dispatchEvent(new CustomEvent('expander-collapse', { bubbles: true, detail: this.expandeeEl }));
            }
        }
    }, {
        key: 'expand',
        value: function expand(isKeyboard) {
            if (this.isExpanded() === false) {
                this.hostEl.setAttribute('aria-expanded', 'true');
                if (this.options.expandedClass) {
                    this.el.classList.add(this.options.expandedClass);
                }
                if (isKeyboard === true) {
                    var focusManagement = this.options.focusManagement;

                    if (focusManagement === 'content') {
                        this.expandeeEl.setAttribute('tabindex', '-1');
                        this.expandeeEl.focus();
                    } else if (focusManagement === 'focusable') {
                        focusables(this.expandeeEl)[0].focus();
                    } else if (focusManagement === 'interactive') {
                        focusables(this.expandeeEl, true)[0].focus();
                    } else if (focusManagement !== null) {
                        var el = this.expandeeEl.querySelector('#' + focusManagement);
                        if (el) {
                            el.focus();
                        }
                    }
                }
                this.el.dispatchEvent(new CustomEvent('expander-expand', { bubbles: true, detail: this.expandeeEl }));
            }
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.isExpanded() === true) {
                this.collapse();
            } else {
                this.expand(this.keyDownFlag);
            }
            this.keyDownFlag = false;
        }
    }, {
        key: 'expandOnClick',
        set: function set(bool) {
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
    }, {
        key: 'expandOnFocus',
        set: function set(bool) {
            if (bool === true) {
                this.hostEl.addEventListener('focus', this._hostFocusListener);

                if (this.options.autoCollapse === true) {
                    this.collapseOnFocusOut = true;
                }
            } else {
                this.hostEl.removeEventListener('focus', this._hostFocusListener);
            }
        }
    }, {
        key: 'expandOnHover',
        set: function set(bool) {
            if (bool === true) {
                this.hostEl.addEventListener('mouseenter', this._hostHoverListener);

                if (this.options.autoCollapse === true) {
                    this.collapseOnMouseOut = true;
                }
            } else {
                this.hostEl.removeEventListener('mouseenter', this._hostHoverListener);
            }
        }
    }, {
        key: 'collapseOnClickOut',
        set: function set(bool) {
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
    }, {
        key: 'collapseOnFocusOut',
        set: function set(bool) {
            if (bool === true) {
                this.el.addEventListener('focusExit', this._focusExitListener);
            } else {
                this.el.removeEventListener('focusExit', this._focusExitListener);
            }
        }
    }, {
        key: 'collapseOnMouseOut',
        set: function set(bool) {
            if (bool === true) {
                this.el.addEventListener('mouseleave', this._mouseLeaveListener);
            } else {
                this.el.removeEventListener('mouseleave', this._mouseLeaveListener);
            }
        }
    }]);

    return _class;
}();

});