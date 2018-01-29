'use strict';

var htmlTemplate1 = '<span class="expander">'
    + '<button class="expander__host"></button>'
    + '<div class="expander__content"></div>'
+ '</span>';

var htmlTemplate2 = '<span class="expander">'
    + '<span class="expander__host"><button></button></span>'
    + '<div class="expander__content"></div>'
    + '</span>';

module.exports = [
    {
        options: { click: true, focus: false, hover: false },
        html: htmlTemplate1,
        collapsedState: {
            click: { expandedCount: 1, collapsedCount: 0, ariaExpanded: 'true' },
            focus: { expandedCount: 0, collapsedCount: 0, ariaExpanded: 'false' }
        },
        expandedState: {
            click: { expandedCount: 0, collapsedCount: 1, ariaExpanded: 'false' },
            focus: { expandedCount: 0, collapsedCount: 0, ariaExpanded: 'true' }
        }
    },
    {
        options: { click: false, focus: true, hover: false },
        html: htmlTemplate1,
        collapsedState: {
            click: { expandedCount: 0, collapsedCount: 0, ariaExpanded: 'false' },
            focus: { expandedCount: 1, collapsedCount: 0, ariaExpanded: 'true' }
        },
        expandedState: {
            click: { expandedCount: 0, collapsedCount: 0, ariaExpanded: 'true' },
            focus: { expandedCount: 0, collapsedCount: 0, ariaExpanded: 'true' }
        }
    }
];
