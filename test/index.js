var Expander = require('../index.js');
var testData = require('./data.js');

testData.forEach(function(data) {
    var widgetEl;
    var hostEl;
    var widget; // eslint-disable-line no-unused-vars
    var onCollapse;
    var onExpand;

    beforeAll(function() {
        document.body.innerHTML = data.html;
        widgetEl = document.querySelector('.expander');
        hostEl = widgetEl.querySelector('.expander__host');
        onCollapse = jasmine.createSpy('onCollapse');
        onExpand = jasmine.createSpy('onExpand');

        widgetEl.addEventListener('expanded', onExpand);
        widgetEl.addEventListener('collapsed', onCollapse);

        widget = new Expander(widgetEl, data.options);
    });
    describe('given the widget is collapsed,', function() {
        describe('when the host is clicked', function() {
            beforeAll(function() {
                hostEl.click();
            });
            it('it should observe the correct number of expand events', function() {
                expect(onExpand).toHaveBeenCalledTimes(data.collapsedState.click.expandedCount);
            });
            it('it should observe the correct number of collapse events', function() {
                expect(onCollapse).toHaveBeenCalledTimes(data.collapsedState.click.collapsedCount);
            });
            it('the host el should have correct aria-expanded attribute', function() {
                expect(hostEl.getAttribute('aria-expanded')).toEqual(data.collapsedState.click.ariaExpanded);
            });
        });
        describe('when the host is focussed', function() {
            beforeAll(function() {
                widget.collapse();
                onExpand.calls.reset();
                onCollapse.calls.reset();
                hostEl.focus();
            });
            it('it should observe the correct number of expand events', function() {
                expect(onExpand).toHaveBeenCalledTimes(data.collapsedState.focus.expandedCount);
            });
            it('it should observe the correct number of collapse events', function() {
                expect(onCollapse).toHaveBeenCalledTimes(data.collapsedState.focus.collapsedCount);
            });
            it('the host el should have correct aria-expanded attribute', function() {
                expect(hostEl.getAttribute('aria-expanded')).toEqual(data.collapsedState.focus.ariaExpanded);
            });
        });
    });
    describe('given the widget is expanded,', function() {
        beforeAll(function() {
            widget.expand();
            onExpand.calls.reset();
            onCollapse.calls.reset();
        });
        describe('when the host is clicked', function() {
            beforeAll(function() {
                hostEl.click();
            });
            it('it should observe the correct number of expand events', function() {
                expect(onExpand).toHaveBeenCalledTimes(data.expandedState.click.expandedCount);
            });
            it('it should observe the correct number of collapse events', function() {
                expect(onCollapse).toHaveBeenCalledTimes(data.expandedState.click.collapsedCount);
            });
            it('the host el should have correct aria-expanded attribute', function() {
                expect(hostEl.getAttribute('aria-expanded')).toEqual(data.expandedState.click.ariaExpanded);
            });
        });
        describe('when the host is focussed', function() {
            beforeAll(function() {
                widget.expand();
                onExpand.calls.reset();
                onCollapse.calls.reset();
                hostEl.focus();
            });
            it('it should observe the correct number of expand events', function() {
                expect(onExpand).toHaveBeenCalledTimes(data.expandedState.focus.expandedCount);
            });
            it('it should observe the correct number of collapse events', function() {
                expect(onCollapse).toHaveBeenCalledTimes(data.expandedState.focus.collapsedCount);
            });
            it('the host el should have correct aria-expanded attribute', function() {
                expect(hostEl.getAttribute('aria-expanded')).toEqual(data.expandedState.focus.ariaExpanded);
            });
        });
    });
});
