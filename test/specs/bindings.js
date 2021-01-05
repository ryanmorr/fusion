import { val, css } from '../../src/fusion';
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

    it('should update a CSS variable', () => {
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

    it('should support promises', (done) => {
        const width = new Promise((resolve) => {
            setTimeout(() => resolve('103px'), 1000);
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
});
