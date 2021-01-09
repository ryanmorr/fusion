import { query, css } from '../../src/fusion';
import { createElement, appendStyle, getStyle } from '../setup';

describe('query', () => {
    it('should query for elements', () => {
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'foo'});

        const elements = query('.foo');

        expect(elements.get()).to.deep.equal([element1, element2]);
    });

    it('should call subscribes when matching elements are added and removed from the DOM', (done) => {
        const element1 = createElement('div', {className: 'foo'});

        const elements = query('.foo');

        const spy = sinon.spy();
        elements.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0]).to.deep.equal([[element1]]);

        const element2 = createElement('div', {className: 'foo'});
        const element3 = createElement('div', {className: 'foo'});
        const element4 = createElement('div', {className: 'foo'});

        setTimeout(() => {
            expect(spy.callCount).to.equal(2);
            expect(spy.args[1][0]).to.deep.equal([element1, element2, element3, element4]);
            expect(spy.args[1][1]).to.deep.equal([element1]);
            expect(spy.args[1][2]).to.deep.equal([element2, element3, element4]);
            expect(spy.args[1][3]).to.deep.equal([]);
            expect(elements.get()).to.deep.equal([element1, element2, element3, element4]);

            element2.remove();
            element4.remove();
            const element5 = createElement('div', {className: 'foo'});

            setTimeout(() => {
                expect(spy.callCount).to.equal(3);
                expect(spy.args[2][0]).to.deep.equal([element1, element3, element5]);
                expect(spy.args[2][1]).to.deep.equal([element1, element2, element3, element4]);
                expect(spy.args[2][2]).to.deep.equal([element5]);
                expect(spy.args[2][3]).to.deep.equal([element2, element4]);
                expect(elements.get()).to.deep.equal([element1, element3, element5]);
    
                done();
            }, 500);
        }, 500);
    });

    it('should interpolate a query store into a CSS stylesheet', () => {
        const elements = query('.foo');

        appendStyle(css`
            ${elements} {
                width: 22px
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('22px');
    });
});
