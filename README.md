# makeup-expander

<p>
    <a href="https://travis-ci.org/makeup-js/makeup-expander"><img src="https://api.travis-ci.org/makeup-js/makeup-expander.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/makeup-js/makeup-expander?branch=master'><img src='https://coveralls.io/repos/makeup-js/makeup-expander/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
    <a href="https://david-dm.org/makeup-js/makeup-expander"><img src="https://david-dm.org/makeup-js/makeup-expander.svg" alt="Dependency status" /></a>
    <a href="https://david-dm.org/makeup-js/makeup-expander#info=devDependencies"><img src="https://david-dm.org/makeup-js/makeup-expander/dev-status.svg" alt="devDependency status" /></a>
</p>

Creates the basic interactivity for an element that expands and collapses another element.

## Experimental

This module is still in an experimental state, until it reaches v1.0.0 you must consider all minor releases as breaking changes. Patch releases may introduce new features, but will be backwards compatible.

## Install

```js
// via npm
npm install makeup-expander

// via yarn
yarn add makeup-expander
```

## Basic Example

In the most basic use case, the interactive host element is an adjacent sibling of the content that it expands. We leverage the aria-expanded state to hide and show the overlay with CSS.

```html
<div class="expander">
    <button class="expander__host">Click for Flyout</button>
    <div class="expander__content">
        <p>Any kind of HTML control can go inside...</p>
        <p>A link: <a id="foo" href="http://www.ebay.com">www.ebay.com</a></p>
        <p>A button: <button>Click Me</button></p>
        <p>An input: <input type="text" aria-label="Dummy textbox"></p>
        <p>A checkbox: <input type="checkbox" aria-label="Dummy checkbox"></p>
    </div>
</div>
```

```js
// import the module
const Expander = require('makeup-expander');

// get an element reference
const widgetEl = document.querySelector('.expander');

// options
const options = {
    expandOnClick: true
};

// get widget instance
const widget = new Expander(widgetEl, options);
```

Clicking the button will now toggle it's aria-expanded state. CSS can be used to display the content accordingly, for example:

```css
.expander__content {
    display: none;
}

.expander__host[aria-expanded="true"] ~ .expander__content {
    display: block;
}
```

## Nested Example

In this example, the interactive host element and the content that it expands are **not** siblings. We cannot leverage aria-expanded to hide and show the overlay with CSS. Instead we must leverage a class on the root element of the widget. This class is defined in the widget options.

```html
<div class="widget">
    <span class="widget__button">
        <button class="expander__host">Click for Flyout</button>
    </span>
    <div class="expander__content">
        <p>Any kind of HTML control can go inside...</p>
        <p>A link: <a id="foo" href="http://www.ebay.com">www.ebay.com</a></p>
        <p>A button: <button>Click Me</button></p>
        <p>An input: <input type="text" aria-label="Dummy textbox"></p>
        <p>A checkbox: <input type="checkbox" aria-label="Dummy checkbox"></p>
    </div>
</div>
```

```js
// import the module
const Expander = require('makeup-expander');

// get an element reference
const widgetEl = document.querySelector('.widget');

// options
const options = {
    expandOnClick: true,
    expandedClass: 'widget--expanded'
};

// get widget instance
const widget = new Expander(widgetEl, options);
```

Clicking the button will now toggle it's aria-expanded state *and* toggle the expanded class on the root element. CSS can be used to display the content accordingly, for example:

```css
.expander__content {
    display: none;
}

.widget--expanded .expander__content {
    display: block;
}
```

## Params

* `el`: the root widget el
* `options.autoCollapse`: applies one or more collapse behaviors (`collapseOnClickOut`, `collapseOnFocusOut`, `collapseOnMouseOut`) based on expand behaviour (default: false)
* `options.collapseOnClickOut`: whether the content should collapse when clicking outside of content (default: false)
* `options.collapseOnFocusOut`: whether the content should collapse when focus leaves the content (default: false)
* `options.collapseOnMouseOut`: whether the content should collapse when mouse leaves the content (default: false)
* `options.contentSelector`: the query selector for the content element in relation to the widget (default: '.expander__content')
* `options.expandOnClick`: whether the host should be click activated (default: false)
* `options.expandOnFocus`: whether the host should be focus activated (default: false)
* `options.expandOnHover`: whether the host should be hover activated (default: false)
* `options.focusManagement`: where focus should go (null, 'content', 'focusable', 'interactive', or ID reference) when click expander is activated with keyboard (default: null)
* `options.hostSelector`: the query selector for the host element in relation to the widget (default: '.expander__host')
* `options.expandedClass`: the class which will be used on the root element to signify expanded state. **Example:** `foo--expanded`; this mirrors the `aria-expanded="true"` setting on the host element
* `options.simulateSpacebarClick`: whether to force a click event on spacebar, in the case that the host does not natively trigger one (default: false)

## Properties

Set the following properties to true or false to enable or disable the behaviour.

* `collapseOnClickOut`
* `collapseOnFocusOut`
* `collapseOnMouseOut`
* `expandOnClick`
* `expandOnFocus`
* `expandOnHover`

## Methods

* `collapse()`: set state to collapsed
* `expand()`: set state to expanded
* `isExpanded()`: returns expanded state
* `toggle()`: toggle expanded/collapsed state

## Events

* `expander-collapse`
* `expander-expand`

## Dependencies

* [makeup-exit-emitter](https://github.com/makeup-js/makeup-exit-emitter)
* [makeup-focusables](https://github.com/makeup-js/makeup-focusables)
* [makeup-next-id](https://github.com/makeup-js/makeup-next-id)
* [custom-event-polyfill](https://github.com/krambuhl/custom-event-polyfill)

## Development

* `npm start`
* `npm test`
* `npm run lint`
* `npm run fix`
* `npm run build`
* `npm run clean`

The following hooks exist, and do not need to be invoked manually:

* `npm prepublish` cleans, lints, tests and builds on every `npm publish` command
* `pre-commit` cleans, lints, tests and builds on every `git commit` command

## Test Reports

Each test run will generate the following reports:

* `/reports/coverage` contains Istanbul code coverage report
* `/reports/html` contains HTML test report

## CI Build

https://travis-ci.org/makeup-js/makeup-expander

## Code Coverage

https://coveralls.io/github/makeup-js/makeup-expander
