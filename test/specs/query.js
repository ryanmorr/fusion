import { query, css } from '../../src/fusion';
import { createElement, appendStyle, getStyle, wait } from '../util';

describe('query', () => {
    it('should query for elements', () => {
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'foo'});

        const elements = query('.foo');

        expect(elements.get()).to.deep.equal([element1, element2]);
    });

    it('should call subscribes when matching elements are added to the DOM', async () => {
        const element1 = createElement('div', {className: 'foo'});

        const elements = query('.foo');

        const spy = sinon.spy();
        elements.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0]).to.deep.equal([[element1]]);

        const element2 = createElement('div', {className: 'foo'});

        await wait();

        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.deep.equal([element1, element2]);
        expect(spy.args[1][1]).to.deep.equal([element1]);
        expect(elements.get()).to.deep.equal([element1, element2]);
    });

    it('should call subscribes when matching elements are removed from the DOM', async () => {
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'foo'});
        const element3 = createElement('div', {className: 'foo'});

        const elements = query('.foo');

        const spy = sinon.spy();
        elements.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0]).to.deep.equal([[element1, element2, element3]]);

        element1.remove();

        await wait();

        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.deep.equal([element2, element3]);
        expect(spy.args[1][1]).to.deep.equal([element1, element2, element3]);
        expect(elements.get()).to.deep.equal([element2, element3]);
    });

    it('should call subscribes when matching elements are added and removed from the DOM', async () => {
        const element1 = createElement('div', {className: 'foo'});

        const elements = query('.foo');

        const spy = sinon.spy();
        elements.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0]).to.deep.equal([[element1]]);

        const element2 = createElement('div', {className: 'foo'});
        const element3 = createElement('div', {className: 'foo'});
        const element4 = createElement('div', {className: 'foo'});

        await wait();

        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.deep.equal([element1, element2, element3, element4]);
        expect(spy.args[1][1]).to.deep.equal([element1]);
        expect(elements.get()).to.deep.equal([element1, element2, element3, element4]);

        element2.remove();
        element4.remove();
        const element5 = createElement('div', {className: 'foo'});

        await wait();

        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.deep.equal([element1, element3, element5]);
        expect(spy.args[2][1]).to.deep.equal([element1, element2, element3, element4]);
        expect(elements.get()).to.deep.equal([element1, element3, element5]);
    });

    it('should not call subscribes if the DOM has changed but the elements are the same', async () => {
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'foo'});
    
        const elements = query('.foo');
    
        const spy = sinon.spy();
        elements.subscribe(spy);
    
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0]).to.deep.equal([[element1, element2]]);
    
        element2.remove();
        document.body.appendChild(element2);
    
        await wait();

        expect(spy.callCount).to.equal(1);
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
