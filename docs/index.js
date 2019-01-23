function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

function querySelectorAllToArray(selector) {
    return nodeListToArray(document.querySelectorAll(selector));
}

var Expander = require('../index.js');
var clickExpanderEls = querySelectorAllToArray('.expander--click-only');
var focusExpanderEls = querySelectorAllToArray('.expander--focus-only');
var hoverExpanderEls = querySelectorAllToArray('.expander--hover-only');
var hoverAndFocusExpanderEls = querySelectorAllToArray('.expander--focus-and-hover');
var stealthExpanderEls = querySelectorAllToArray('.expander--stealth-only');
var clickAndSpacebarExpanderEls = querySelectorAllToArray('.expander--click-and-spacebar');
var expanderWidgets = [];

expanderWidgets.push(new Expander(clickExpanderEls[0], { expandOnClick: true }));
expanderWidgets.push(new Expander(clickExpanderEls[1], { autoCollapse: true, expandOnClick: true }));

focusExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { autoCollapse: true, expandOnFocus: true }));
});

hoverExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { autoCollapse: true, expandOnHover: true }));
});

hoverAndFocusExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { autoCollapse: true, expandOnFocus: true, expandOnHover: true }));
});

stealthExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, { collapseOnClickOut: true, collapseOnFocusOut: true, expandOnClick: true, focusManagement: 'focusable' }));
});

clickAndSpacebarExpanderEls.forEach(function(el, i) {
    expanderWidgets.push(new Expander(el, {
        autoCollapse: true,
        expandOnClick: true,
        simulateSpacebarClick: true,
        expandedClass: 'expander__host-container--expanded'
    }));
});

expanderWidgets.forEach(function(item, i) {
    item.el.addEventListener('expander-expand', function(e) {
        console.log(e);
    });
    item.el.addEventListener('expander-collapse', function(e) {
        console.log(e);
    });
});
