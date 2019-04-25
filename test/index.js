var Expander = require('../index.js');
var testData = require('./data.js');

testData.forEach(function(data, index) {
    describe('For test data ' + index, function() {
        var widgetEl;
        var hostEl;
        var widget;
        var onCollapse;
        var onExpand;

        describe('given the widget is collapsed,', function() {
            beforeEach(function() {
                document.body.innerHTML = data.html;
                widgetEl = document.querySelector('.expander');
                hostEl = widgetEl.querySelector('.expander__host');
                onCollapse = jasmine.createSpy('onCollapse');
                onExpand = jasmine.createSpy('onExpand');

                widgetEl.addEventListener('expander-expand', onExpand);
                widgetEl.addEventListener('expander-collapse', onCollapse);

                widget = new Expander(widgetEl, data.options);

                widget.collapse();
                onExpand.calls.reset();
                onCollapse.calls.reset();
            });

            describe('when the host is clicked', function() {
                beforeEach(function() {
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
                beforeEach(function() {
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
            beforeEach(function() {
                document.body.innerHTML = data.html;
                widgetEl = document.querySelector('.expander');
                hostEl = widgetEl.querySelector('.expander__host');
                onCollapse = jasmine.createSpy('onCollapse');
                onExpand = jasmine.createSpy('onExpand');

                widgetEl.addEventListener('expander-expand', onExpand);
                widgetEl.addEventListener('expander-collapse', onCollapse);

                widget = new Expander(widgetEl, data.options);

                widget.expand();
                onExpand.calls.reset();
                onCollapse.calls.reset();
            });

            describe('when the host is clicked', function() {
                beforeEach(function() {
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
                beforeEach(function() {
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
            describe('when the document is clicked', function() {
                beforeEach(function() {
                    document.body.click();
                });
                it('it should observe the correct number of expand events', function() {
                    expect(onExpand).toHaveBeenCalledTimes(data.expandedState.documentClick.expandedCount);
                });
                it('it should observe the correct number of collapse events', function() {
                    expect(onCollapse).toHaveBeenCalledTimes(data.expandedState.documentClick.collapsedCount);
                });
                it('the host el should have correct aria-expanded attribute', function() {
                    expect(hostEl.getAttribute('aria-expanded')).toEqual(data.expandedState.documentClick.ariaExpanded);
                });
            });
            describe('when the document is touched', function() {
                beforeEach(function() {
                    document.dispatchEvent(new Event('touchstart'));
                    document.dispatchEvent(new Event('touchend'));
                });
                it('it should observe the correct number of expand events', function() {
                    expect(onExpand).toHaveBeenCalledTimes(data.expandedState.documentTouch.expandedCount);
                });
                it('it should observe the correct number of collapse events', function() {
                    expect(onCollapse).toHaveBeenCalledTimes(data.expandedState.documentTouch.collapsedCount);
                });
                it('the host el should have correct aria-expanded attribute', function() {
                    expect(hostEl.getAttribute('aria-expanded')).toEqual(data.expandedState.documentTouch.ariaExpanded);
                });
            });
        });
    });
});
