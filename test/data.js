'use strict';

var htmlTemplate = '<span class="expander">'
    + '<button class="expander__host"><button>'
    + '<div class="expander__content"></div>'
+ '</span>';

module.exports = [
    {
        options: { click: true, focus: false, hover: false },
        html: htmlTemplate,
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
        html: htmlTemplate,
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
