$_mod.installed("makeup-expander$0.7.3", "custom-event-polyfill", "1.0.7");
$_mod.installed("makeup-expander$0.7.3", "makeup-next-id", "0.1.0");
$_mod.main("/nanoid$2.0.3", "");
$_mod.remap("/nanoid$2.0.3/index", "/nanoid$2.0.3/index.browser");
$_mod.builtin("process", "/process$0.11.10/browser");
$_mod.def("/process$0.11.10/browser", function(require, exports, module, __filename, __dirname) { // shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

});
$_mod.def("/nanoid$2.0.3/index.browser", function(require, exports, module, __filename, __dirname) { var process=require("process"); if (process.env.NODE_ENV !== 'production') {
  if (typeof self === 'undefined' || (!self.crypto && !self.msCrypto)) {
    throw new Error(
      'Your browser does not have secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

var crypto = self.crypto || self.msCrypto

/*
 * This alphabet uses a-z A-Z 0-9 _- symbols.
 * Symbols order was changed for better gzip compression.
 */
var url = 'Uint8ArdomValuesObj012345679BCDEFGHIJKLMNPQRSTWXYZ_cfghkpqvwxyz-'

module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size))
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}

});
$_mod.installed("makeup-expander$0.7.3", "makeup-exit-emitter", "0.1.1");
$_mod.installed("makeup-exit-emitter$0.1.1", "custom-event-polyfill", "1.0.7");
$_mod.installed("makeup-expander$0.7.3", "makeup-focusables", "0.0.4");
$_mod.def("/makeup-expander$0.7.3/index", function(require, exports, module, __filename, __dirname) { 'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nextID = require('/makeup-next-id$0.1.0/index'/*'makeup-next-id'*/);

var ExitEmitter = require('/makeup-exit-emitter$0.1.1/index'/*'makeup-exit-emitter'*/);

var focusables = require('/makeup-focusables$0.0.4/index'/*'makeup-focusables'*/);

var defaultOptions = {
  alwaysDoFocusManagement: false,
  ariaControls: true,
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

function onHostKeyDown(e) {
  if (e.keyCode === 13 || e.keyCode === 32) {
    this._keyboardClickFlag = true;
  } // if host element does not naturally trigger a click event on spacebar, we can force one to trigger here.
  // careful! if host already triggers click events naturally, we end up with a "double-click".


  if (e.keyCode === 32 && this.options.simulateSpacebarClick === true) {
    this.hostEl.click();
  }
}

function onHostMouseDown() {
  this._mouseClickFlag = true;
}

function onHostClick() {
  this._expandWasKeyboardClickActivated = this._keyboardClickFlag;
  this._expandWasMouseClickActivated = this._mouseClickFlag;
  this.expanded = !this.expanded;
}

function onHostFocus() {
  this._expandWasFocusActivated = true;
  this.expanded = true;
}

function onHostHover() {
  this._expandWasHoverActivated = true;
  this.expanded = true;
}

function onFocusExit() {
  this.expanded = false;
}

function onMouseLeave() {
  this.expanded = false;
}

function _onDocumentClick() {
  if (this.el.contains(event.target) === false) {
    this.expanded = false;
  }
}

function _onDocumentTouchStart() {
  this.documentClick = true;
}

function _onDocumentTouchMove() {
  this.documentClick = false;
}

function _onDocumentTouchEnd() {
  if (this.documentClick === true) {
    this.documentClick = false;

    if (this.el.contains(event.target) === false) {
      this.expanded = false;
    }
  }
}

function manageFocus(focusManagement, contentEl) {
  if (focusManagement === 'content') {
    contentEl.setAttribute('tabindex', '-1');
    contentEl.focus();
  } else if (focusManagement === 'focusable') {
    focusables(contentEl)[0].focus();
  } else if (focusManagement === 'interactive') {
    focusables(contentEl, true)[0].focus();
  } else if (focusManagement !== null) {
    var el = contentEl.querySelector("#".concat(focusManagement));

    if (el) {
      el.focus();
    }
  }
}

module.exports =
/*#__PURE__*/
function () {
  function _class(el, selectedOptions) {
    _classCallCheck(this, _class);

    this.options = _extends({}, defaultOptions, selectedOptions);
    this.el = el;
    this.hostEl = el.querySelector(this.options.hostSelector); // the keyboard focusable host el

    this.contentEl = el.querySelector(this.options.contentSelector); // ensure the widget and expandee have an id

    nextID(this.el, 'expander-');
    this.contentEl.id = "".concat(this.el.id, "-content");
    ExitEmitter.addFocusExit(this.el);
    this._hostKeyDownListener = onHostKeyDown.bind(this);
    this._hostMouseDownListener = onHostMouseDown.bind(this);
    this._documentClickListener = _onDocumentClick.bind(this);
    this._documentTouchStartListener = _onDocumentTouchStart.bind(this);
    this._documentTouchMoveListener = _onDocumentTouchMove.bind(this);
    this._documentTouchEndListener = _onDocumentTouchEnd.bind(this);
    this._hostClickListener = onHostClick.bind(this);
    this._hostFocusListener = onHostFocus.bind(this);
    this._hostHoverListener = onHostHover.bind(this);
    this._focusExitListener = onFocusExit.bind(this);
    this._mouseLeaveListener = onMouseLeave.bind(this);

    if (this.hostEl.getAttribute('aria-expanded') === null) {
      this.hostEl.setAttribute('aria-expanded', 'false');
    }

    if (this.options.ariaControls === true) {
      this.hostEl.setAttribute('aria-controls', this.contentEl.id);
    }

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
    key: "sleep",
    value: function sleep() {
      if (this._destroyed !== true) {
        this.expandOnClick = false;
        this.expandOnFocus = false;
        this.expandOnHover = false;
        this.collapseOnClickOut = false;
        this.collapseOnFocusOut = false;
        this.collapseOnMouseOut = false;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.sleep();
      this._destroyed = true;
      this._hostKeyDownListener = null;
      this._hostMouseDownListener = null;
      this._documentClickListener = null;
      this._documentTouchStartListener = null;
      this._documentTouchMoveListener = null;
      this._documentTouchEndListener = null;
      this._hostClickListener = null;
      this._hostFocusListener = null;
      this._hostHoverListener = null;
      this._focusExitListener = null;
      this._mouseLeaveListener = null;
    } // DEPRECATED (remove in v1.0.0)

  }, {
    key: "isExpanded",
    value: function isExpanded() {
      return this.expanded;
    } // DEPRECATED (remove in v1.0.0)

  }, {
    key: "expand",
    value: function expand() {
      this.expanded = true;
    } // DEPRECATED (remove in v1.0.0)

  }, {
    key: "collapse",
    value: function collapse() {
      this.expanded = false;
    } // DEPRECATED (remove in v1.0.0)

  }, {
    key: "toggle",
    value: function toggle() {
      this.expanded = !this.expanded;
    } // DEPRECATED (remove in v1.0.0)

  }, {
    key: "cancelAsync",
    value: function cancelAsync() {
      this.sleep();
    }
  }, {
    key: "expandOnClick",
    set: function set(bool) {
      if (bool === true) {
        this.hostEl.addEventListener('keydown', this._hostKeyDownListener);
        this.hostEl.addEventListener('mousedown', this._hostMouseDownListener);
        this.hostEl.addEventListener('click', this._hostClickListener);

        if (this.options.autoCollapse === true) {
          this.collapseOnClickOut = true;
          this.collapseOnFocusOut = true;
        }
      } else {
        this.hostEl.removeEventListener('click', this._hostClickListener);
        this.hostEl.removeEventListener('mousedown', this._hostMouseDownListener);
        this.hostEl.removeEventListener('keydown', this._hostKeyDownListener);
      }
    }
  }, {
    key: "expandOnFocus",
    set: function set(bool) {
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
  }, {
    key: "expandOnHover",
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
    key: "collapseOnClickOut",
    set: function set(bool) {
      if (bool === true) {
        document.addEventListener('click', this._documentClickListener);
        document.addEventListener('touchstart', this._documentTouchStartListener);
        document.addEventListener('touchmove', this._documentTouchMoveListener);
        document.addEventListener('touchend', this._documentTouchEndListener);
      } else {
        document.removeEventListener('click', this._documentClickListener);
        document.removeEventListener('touchstart', this._documentTouchStartListener);
        document.removeEventListener('touchmove', this._documentTouchMoveListener);
        document.removeEventListener('touchend', this._documentTouchEndListener);
      }
    }
  }, {
    key: "collapseOnFocusOut",
    set: function set(bool) {
      if (bool === true) {
        this.el.addEventListener('focusExit', this._focusExitListener);
      } else {
        this.el.removeEventListener('focusExit', this._focusExitListener);
      }
    }
  }, {
    key: "collapseOnMouseOut",
    set: function set(bool) {
      if (bool === true) {
        this.el.addEventListener('mouseleave', this._mouseLeaveListener);
      } else {
        this.el.removeEventListener('mouseleave', this._mouseLeaveListener);
      }
    }
  }, {
    key: "expanded",
    get: function get() {
      return this.hostEl.getAttribute('aria-expanded') === 'true';
    },
    set: function set(bool) {
      if (bool === true && this.expanded === false) {
        this.hostEl.setAttribute('aria-expanded', 'true');

        if (this.options.expandedClass) {
          this.el.classList.add(this.options.expandedClass);
        }

        if (this._expandWasKeyboardClickActivated || this._expandWasMouseClickActivated && this.options.alwaysDoFocusManagement) {
          manageFocus(this.options.focusManagement, this.contentEl);
        }

        this.el.dispatchEvent(new CustomEvent('expander-expand', {
          bubbles: true,
          detail: this.contentEl
        }));
      }

      if (bool === false && this.expanded === true) {
        this.hostEl.setAttribute('aria-expanded', 'false');

        if (this.options.expandedClass) {
          this.el.classList.remove(this.options.expandedClass);
        }

        this.el.dispatchEvent(new CustomEvent('expander-collapse', {
          bubbles: true,
          detail: this.contentEl
        }));
      }

      this._expandWasKeyboardClickActivated = false;
      this._expandWasMouseClickActivated = false;
      this._expandWasFocusActivated = false;
      this._expandWasHoverActivated = false;
      this._keyboardClickFlag = false;
      this._mouseClickFlag = false;
    }
  }]);

  return _class;
}();

});