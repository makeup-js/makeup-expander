function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

var Expander = require('../index.js');
var clickExpanderEls = nodeListToArray(document.querySelectorAll('.expander--click-only'));
var focusExpanderEls = nodeListToArray(document.querySelectorAll('.expander--focus-only'));
var hoverExpanderEls = nodeListToArray(document.querySelectorAll('.expander--hover-only'));
var hoverAndFocusExpanderEls = nodeListToArray(document.querySelectorAll('.expander--focus-and-hover'));
var stealthExpanderEls = nodeListToArray(document.querySelectorAll('.expander--stealth-only'));
var expanderWidgets = [];

clickExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { click: true }));
});

focusExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { focus: true }));
});

hoverExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { hover: true }));
});

hoverAndFocusExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { focus: true, hover: true }));
});

stealthExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { autoCollapse: true, click: true, focusManagement: 'focusable' }));
});

expanderWidgets.forEach(function(item, i) {
    item.el.addEventListener('expander-expand', function(e) {
        console.log(e);
    });
    item.el.addEventListener('expander-collapse', function(e) {
        console.log(e);
    });
});
