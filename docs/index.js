function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

var Expander = require('../index.js');
var clickExpanderEls = nodeListToArray(document.querySelectorAll('.expander--click'));
var focusExpanderEls = nodeListToArray(document.querySelectorAll('.expander--focus'));
var hoverExpanderEls = nodeListToArray(document.querySelectorAll('.expander--hover'));
var expanderWidgets = [];

clickExpanderEls.forEach(function(el, i) {
    el.addEventListener('expanded', function(e) {
        console.log(e);
    });
    el.addEventListener('collapsed', function(e) {
        console.log(e);
    });
    expanderWidgets.push(new Expander(el, { click: true }));
});

focusExpanderEls.forEach(function(el, i) {
    el.addEventListener('expanded', function(e) {
        console.log(e);
    });
    el.addEventListener('collapsed', function(e) {
        console.log(e);
    });
    expanderWidgets.push(new Expander(el, { focus: true, hover: true }));
});
