import { val, derived, css } from '../../src/fusion';
import { createElement, appendStyle, getStyle } from '../setup';

describe('bindings', () => {
    it('should render a store as a CSS variable', () => {
        const width = val('22px');

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('22px');
    });

    it('should update a CSS variable when a store is updated', () => {
        const width = val('7px');

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'width')).to.equal('7px');

        width.set('58px');

        expect(getStyle(element, 'width')).to.equal('58px');
    });

    it('should support multiple interpolations of the same store', () => {
        const width = val('7px');

        appendStyle(css`
            .foo {
                width: ${width};
            }

            .bar {
                width: ${width};
            }
        `);
        
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'bar'});
        
        expect(getStyle(element1, 'width')).to.equal('7px');
        expect(getStyle(element2, 'width')).to.equal('7px');

        width.set('58px');

        expect(getStyle(element1, 'width')).to.equal('58px');
        expect(getStyle(element2, 'width')).to.equal('58px');
    });

    it('should support derived stores', () => {
        const x = val(5);
        const y = val(10);
        const width = derived(x, y, (xVal, yVal) => `${xVal * yVal}px`);

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'width')).to.equal('50px');

        x.set(6);
        expect(getStyle(element, 'width')).to.equal('60px');

        y.set(8);
        expect(getStyle(element, 'width')).to.equal('48px');
    });

    it('should support promises', (done) => {
        const width = new Promise((resolve) => {
            setTimeout(() => resolve('103px'), 100);
        });

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        width.then(() => {
            expect(getStyle(element, 'width')).to.equal('103px');
            done();
        });
    });

    it('should not set a CSS variable if the value is null or undefined', (done) => {
        const margin = val(undefined);
        const padding = new Promise((resolve) => {
            setTimeout(() => resolve(null), 100);
        });

        appendStyle(css`
            .foo {
                margin: ${margin};
                padding: ${padding};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        padding.then(() => {
            expect(getStyle(element, 'margin')).to.equal('0px');
            expect(getStyle(element, 'padding')).to.equal('0px');
            done();
        });
    });

    it('should unset a CSS variable with null or undefined', () => {
        const height = val('5px');

        appendStyle(css`
            .foo {
                height: ${height};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'height')).to.equal('5px');

        height.set(null);
        expect(getStyle(element, 'height')).to.equal('0px');

        height.set('18px');
        expect(getStyle(element, 'height')).to.equal('18px');

        height.set(undefined);
        expect(getStyle(element, 'height')).to.equal('0px');
    });
});
