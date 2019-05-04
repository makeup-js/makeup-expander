'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nextID = require('makeup-next-id');

var ExitEmitter = require('makeup-exit-emitter');

var focusables = require('makeup-focusables');

var defaultOptions = {
  alwaysDoFocusManagement: false,
  // in the case we want mouse click to move focus (e.g. menu buttons)
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
}; // when options.expandOnClick is true, we set a flag if spacebar or enter are pressed
// the idea being that this flag is set BEFORE the click event

function _onKeyDown(e) {
  var keyCode = e.keyCode;

  if (keyCode === 13 || keyCode === 32) {
    this.keyDownFlag = true; // if host element does not naturally trigger a click event on spacebar, we can force one to trigger here.
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

module.exports =
/*#__PURE__*/
function () {
  function _class(el, selectedOptions) {
    _classCallCheck(this, _class);

    this.options = _extends({}, defaultOptions, selectedOptions);
    this.el = el;
    this.hostEl = el.querySelector(this.options.hostSelector); // the keyboard focusable host el

    this.expandeeEl = el.querySelector(this.options.contentSelector);
    this.keyDownFlag = false;
    this.documentClick = false; // ensure the widget and expandee have an id

    nextID(this.el, 'expander');
    nextID(this.expandeeEl, "".concat(this.el.id, "-content"));
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
    key: "isExpanded",
    value: function isExpanded() {
      return this.hostEl.getAttribute('aria-expanded') === 'true';
    }
  }, {
    key: "collapse",
    value: function collapse() {
      if (this.isExpanded() === true) {
        this.hostEl.setAttribute('aria-expanded', 'false');

        if (this.options.expandedClass) {
          this.el.classList.remove(this.options.expandedClass);
        }

        this.el.dispatchEvent(new CustomEvent('expander-collapse', {
          bubbles: true,
          detail: this.expandeeEl
        }));
      }
    } // todo: refactor to remove "isKeyboard" param

  }, {
    key: "expand",
    value: function expand(isKeyboard) {
      if (this.isExpanded() === false) {
        this.hostEl.setAttribute('aria-expanded', 'true');

        if (this.options.expandedClass) {
          this.el.classList.add(this.options.expandedClass);
        } // todo: refactor focus management. We could run into a bad situation where mouse hover moves focus.


        if (isKeyboard === true || this.options.alwaysDoFocusManagement === true) {
          var focusManagement = this.options.focusManagement;

          if (focusManagement === 'content') {
            this.expandeeEl.setAttribute('tabindex', '-1');
            this.expandeeEl.focus();
          } else if (focusManagement === 'focusable') {
            focusables(this.expandeeEl)[0].focus();
          } else if (focusManagement === 'interactive') {
            focusables(this.expandeeEl, true)[0].focus();
          } else if (focusManagement !== null) {
            var el = this.expandeeEl.querySelector("#".concat(focusManagement));

            if (el) {
              el.focus();
            }
          }
        }

        this.el.dispatchEvent(new CustomEvent('expander-expand', {
          bubbles: true,
          detail: this.expandeeEl
        }));
      }
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.isExpanded() === true) {
        this.collapse();
      } else {
        this.expand(this.keyDownFlag);
      }

      this.keyDownFlag = false;
    }
  }, {
    key: "cancelAsync",
    value: function cancelAsync() {
      this.expandOnClick = false;
      this.expandOnFocus = false;
      this.expandOnHover = false;
      this.collapseOnClickOut = false;
      this.collapseOnFocusOut = false;
      this.collapseOnMouseOut = false;
    }
  }, {
    key: "expandOnClick",
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
  }]);

  return _class;
}();
