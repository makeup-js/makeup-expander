'use strict';

var htmlTemplate1 = '<span class="expander">'
    + '<button class="expander__host"><button>'
    + '<div class="expander__content"></div>'
+ '</span>';

module.exports = [
    {
        options: { expandOnClick: true, expandOnFocus: false, expandOnHover: false },
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
        options: { expandOnClick: false, expandOnFocus: true, expandOnHover: false },
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
