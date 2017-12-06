$_mod.installed("makeup-expander$0.0.2", "custom-event-polyfill", "0.3.0");
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
$_mod.installed("makeup-expander$0.0.2", "makeup-next-id", "0.0.1");
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
$_mod.installed("makeup-expander$0.0.2", "makeup-exit-emitter", "0.0.2");
$_mod.main("/makeup-exit-emitter$0.0.2", "");
$_mod.installed("makeup-exit-emitter$0.0.2", "custom-event-polyfill", "0.3.0");
$_mod.def("/makeup-exit-emitter$0.0.2/index", function(require, exports, module, __filename, __dirname) { 'use strict';

// requires CustomEvent polyfill for IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

function onFocusOrMouseOut(evt, el, type) {
    if (el.contains(evt.relatedTarget) === false) {
        el.dispatchEvent(new CustomEvent(type + 'Exit', {
            detail: {
                toElement: evt.relatedTarget,
                fromElement: evt.target
            },
            bubbles: false // mirror the native mouseleave event
        }));
    }
}

function onFocusOut(e) {
    onFocusOrMouseOut(e, this, 'focus');
}

function onMouseOut(e) {
    onFocusOrMouseOut(e, this, 'mouse');
}

function addFocusExit(el) {
    el.addEventListener('focusout', onFocusOut);
}

function removeFocusExit(el) {
    el.removeEventListener('focusout', onFocusOut);
}

function addMouseExit(el) {
    el.addEventListener('mouseout', onMouseOut);
}

function removeMouseExit(el) {
    el.removeEventListener('mouseout', onMouseOut);
}

function add(el) {
    addFocusExit(el);
    addMouseExit(el);
}

function remove(el) {
    removeFocusExit(el);
    removeMouseExit(el);
}

module.exports = {
    addFocusExit: addFocusExit,
    addMouseExit: addMouseExit,
    removeFocusExit: removeFocusExit,
    removeMouseExit: removeMouseExit,
    add: add,
    remove: remove
};

});
$_mod.installed("makeup-expander$0.0.2", "makeup-focusables", "0.0.1");
$_mod.main("/makeup-focusables$0.0.1", "");
$_mod.def("/makeup-focusables$0.0.1/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusableElList = ['a[href]', 'area[href]', 'button:not([disabled])', 'embed', 'iframe', 'input:not([disabled])', 'object', 'select:not([disabled])', 'textarea:not([disabled])', '*[tabindex]', '*[contenteditable]'];

var focusableElSelector = focusableElList.join();

module.exports = function (el) {
    var keyboardOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var focusableEls = Array.prototype.slice.call(el.querySelectorAll(focusableElSelector));

    if (keyboardOnly === true) {
        focusableEls = focusableEls.filter(function (focusableEl) {
            return focusableEl.getAttribute('tabindex') !== '-1';
        });
    }

    return focusableEls;
};

});
$_mod.def("/makeup-expander$0.0.2/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nextID = require('/makeup-next-id$0.0.1/index'/*'makeup-next-id'*/);
var exitEmitter = require('/makeup-exit-emitter$0.0.2/index'/*'makeup-exit-emitter'*/);
var focusables = require('/makeup-focusables$0.0.1/index'/*'makeup-focusables'*/);

var defaultOptions = {
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

module.exports = function () {
    function _class(el, selectedOptions) {
        _classCallCheck(this, _class);

        this.options = _extends({}, defaultOptions, selectedOptions);

        this.el = el;
        this.hostEl = el.querySelector(this.options.hostSelector);
        this.expandeeEl = el.querySelector(this.options.contentSelector);

        // ensure the widget and expandee have an id
        nextID(this.el, 'expander');
        this.expandeeEl.id = this.el.id + '-content';

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
                this.el.dispatchEvent(new CustomEvent('collapsed', { bubbles: true, detail: this.expandeeEl }));
            }
        }
    }, {
        key: 'expand',
        value: function expand(isKeyboard) {
            if (this.isExpanded() === false) {
                this.hostEl.setAttribute('aria-expanded', 'true');
                if (isKeyboard === true) {
                    var focusManagement = this.options.focusManagement;

                    if (focusManagement === 'content') {
                        this.expandeeEl.setAttribute('tabindex', '-1');
                        this.expandeeEl.focus();
                    } else if (focusManagement === 'focusable') {
                        focusables(this.expandeeEl)[0].focus();
                    } else if (focusManagement !== null) {
                        var el = this.expandeeEl.querySelector('#' + focusManagement);
                        if (el) {
                            el.focus();
                        }
                    }
                }
                this.el.dispatchEvent(new CustomEvent('expanded', { bubbles: true, detail: this.expandeeEl }));
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
        key: 'click',
        set: function set(bool) {
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
    }, {
        key: 'focus',
        set: function set(bool) {
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
    }, {
        key: 'hover',
        set: function set(bool) {
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
    }]);

    return _class;
}();

});