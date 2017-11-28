# makeup-expander

<p>
    <a href="https://travis-ci.org/makeup-js/makeup-expander"><img src="https://api.travis-ci.org/makeup-js/makeup-expander.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/makeup-js/makeup-expander?branch=master'><img src='https://coveralls.io/repos/makeup-js/makeup-expander/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
    <a href="https://david-dm.org/makeup-js/makeup-expander"><img src="https://david-dm.org/makeup-js/makeup-expander.svg" alt="Dependency status" /></a>
    <a href="https://david-dm.org/makeup-js/makeup-expander#info=devDependencies"><img src="https://david-dm.org/makeup-js/makeup-expander/dev-status.svg" alt="devDependency status" /></a>
</p>

Creates the basic interactivity for an element that expands and collapses another element, e.g. a fly-out or fly-in.

## Experimental

This module is still in an experimental state, until it reaches v1.0.0 you must consider all minor releases as breaking changes. Patch releases may introduce new features, but will be backwards compatible.

## Install

```js
// via npm
npm install makeup-expander

// via yarn
yarn add makeup-expander
```

## Example

```html
<div class="expander expander--click">
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
const widgetEl = document.querySelector('.expander--click');

// default options
const options = {
    autoCollapse: true,
    click: false,
    contentSelector: '.expander__content',
    focus: false,
    focusManagement: null,
    hostSelector: '.expander__host',
    hover: false
};

// get widget instance
const widget = new Expander(widgetEl, options);
```

Clicking the button will now toggle it's aria-expanded state. CSS can be used to display the content accordingly, for example:

```css
.expander__content {
    display: none;
}

.expander__host[aria-expanded=true] ~ .expander__content {
    display: block;
}
```

## Params

* `el`: the root widget el
* `options.autoCollapse`: whether expandee should collapse when focus or mouse leaves the widget
* `options.click`: whether the host should be click activated (default: false)
* `options.contentSelector`: the query selector for the expandee element in relation to the widget (default: '.expander__content')
* `options.focus`: whether the host should be focus activated (default: false)
* `options.focusManagement`: where focus should go (null, 'content', 'focusable' or ID reference) when click expander is activated with keyboard (default: null)
* `options.hostSelector`: the query selector for the host element in relation to the widget (default: '.expander__host')
* `options.hover`: whether the host should be hover activated (default: false)

## Events

* `collapsed`
* `expanded`

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
