import { store, derived, style } from '../../src/fusion';
import { createElement, getStyle } from '../util';

describe('style', () => {
    it('should create styles and return a unique class name', () => {
        const className = style`
            width: 100px;
        `;

        expect(className).to.be.a('string');

        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('100px');
    });

    it('should support nested CSS', () => {
        const className = style`
            width: 50px;

            &.enlarge {
                width: 200px;
            }
        `;

        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('50px');

        element.classList.add('enlarge');

        expect(getStyle(element, 'width')).to.equal('200px');
    });

    it('should interpolate a string', () => {
        const display = 'inline';

        const className = style`
            display: ${display};
        `;
        
        const element = createElement('div', {className});

        expect(getStyle(element, 'display')).to.equal('inline');
    });

    it('should interpolate a number', () => {
        const width = 45;

        const className = style`
            width: ${width}px;
        `;
        
        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('45px');
    });

    it('should interpolate a store as a CSS variable', () => {
        const width = store('22px');

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('22px');
    });

    it('should update a CSS variable when a store is updated', () => {
        const width = store('2px');

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'width')).to.equal('2px');

        width.set('33px');

        expect(getStyle(element, 'width')).to.equal('33px');
    });

    it('should support multiple interpolations of the same store', () => {
        const size = store('7px');

        const className = style`
            width: ${size};
            height: ${size};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'width')).to.equal('7px');
        expect(getStyle(element, 'height')).to.equal('7px');

        size.set('55px');

        expect(getStyle(element, 'width')).to.equal('55px');
        expect(getStyle(element, 'height')).to.equal('55px');
    });

    it('should interpolate a promise', async () => {
        const width = Promise.resolve('89px');

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});
        
        await width;

        expect(getStyle(element, 'width')).to.equal('89px');
    });

    it('should not set a CSS variable if a store contains null or undefined', () => {
        const margin = store(undefined);
        const padding = store(null);

        const className = style`
            margin: ${margin};
            padding: ${padding};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'margin')).to.equal('0px');
        expect(getStyle(element, 'padding')).to.equal('0px');
    });

    it('should not set a CSS variable if a promise resolves with a value of null or undefined', async () => {
        const margin = Promise.resolve(undefined);
        const padding = Promise.resolve(null);

        const className = style`
            margin: ${margin};
            padding: ${padding};
        `;
        
        const element = createElement('div', {className});
        
        await Promise.all([margin, padding]);

        expect(getStyle(element, 'margin')).to.equal('0px');
        expect(getStyle(element, 'padding')).to.equal('0px');
    });

    it('should not set a CSS variable if a promise is rejected', async () => {
        const margin = Promise.reject('25px');

        const className = style`
            margin: ${margin};
        `;
        
        const element = createElement('div', {className});
        
        try {
            await margin;
        } catch {
            expect(getStyle(element, 'margin')).to.equal('0px');
        }
    });

    it('should unset a CSS variable with null or undefined', () => {
        const height = store('8px');

        const className = style`
            height: ${height};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'height')).to.equal('8px');

        height.set(null);
        expect(getStyle(element, 'height')).to.equal('0px');

        height.set('28px');
        expect(getStyle(element, 'height')).to.equal('28px');

        height.set(undefined);
        expect(getStyle(element, 'height')).to.equal('0px');
    });

    it('should interpolate a store that contains a promise', async () => {
        const width = store();

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});

        const promise = Promise.resolve('77px');

        width.set(promise);
        
        await promise;

        expect(getStyle(element, 'width')).to.equal('77px');
    });

    it('should interpolate a derived store', () => {
        const x = store(5);
        const y = store(10);
        const width = derived(x, y, (xVal, yVal) => `${xVal * yVal}px`);

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'width')).to.equal('50px');

        x.set(6);
        expect(getStyle(element, 'width')).to.equal('60px');

        y.set(8);
        expect(getStyle(element, 'width')).to.equal('48px');
    });

    it('should interpolate a function', () => {
        const className = style`
            width: ${() => '15px'};
        `;
        
        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('15px');
    });

    it('should interpolate a function that returns a store', () => {
        const width = store('7px');

        const className = style`
            width: ${() => width};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'width')).to.equal('7px');

        width.set('83px');

        expect(getStyle(element, 'width')).to.equal('83px');
    });

    it('should interpolate a function that returns a promise', async () => {
        const width = Promise.resolve('22px');

        const className = style`
            width: ${() => width};
        `;
        
        const element = createElement('div', {className});

        await width;

        expect(getStyle(element, 'width')).to.equal('22px');
    });

    it('should interpolate a promise that resolves with a function', async () => {
        const width = Promise.resolve(() => '69px');

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});

        await width;

        expect(getStyle(element, 'width')).to.equal('69px');
    });

    it('should interpolate a store that contains a function', () => {
        const width = store(() => '19px');

        const className = style`
            width: ${() => width};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'width')).to.equal('19px');

        width.set(() => '3px');

        expect(getStyle(element, 'width')).to.equal('3px');
    });

    it('should interpolate a store that contains a promise that resolves with a function', async () => {
        const promise = Promise.resolve(() => '53px');
        const width = store(promise);

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});

        await promise;

        expect(getStyle(element, 'width')).to.equal('53px');
    });

    it('should interpolate nested functions', () => {
        const className = style`
            width: ${() => () => () => '78px'};
        `;
        
        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('78px');
    });

    it('should interpolate a promise that resolves with nested functions', async () => {
        const width = Promise.resolve(() => () => () => '11px');

        const className = style`
            width: ${width};
        `;
        
        const element = createElement('div', {className});

        await width;

        expect(getStyle(element, 'width')).to.equal('11px');
    });
    
    it('should support multiple interpolations of the same promise', async () => {
        const promise = Promise.resolve('62px');

        const className = style`
            width: ${promise};
            height: ${promise};
        `;
        
        const element = createElement('div', {className});

        await promise;

        expect(getStyle(element, 'width')).to.equal('62px');
        expect(getStyle(element, 'height')).to.equal('62px');
    });

    it('should support multiple interpolations of the same function', () => {
        const fn = () => '13px';

        const className = style`
            width: ${fn};
            height: ${fn};
        `;
        
        const element = createElement('div', {className});

        expect(getStyle(element, 'width')).to.equal('13px');
        expect(getStyle(element, 'height')).to.equal('13px');
    });

    it('should not set a CSS variable if a function returns null or undefined', () => {
        const margin = () => undefined;
        const padding = () => null;

        const className = style`
            margin: ${margin};
            padding: ${padding};
        `;
        
        const element = createElement('div', {className});
        
        expect(getStyle(element, 'margin')).to.equal('0px');
        expect(getStyle(element, 'padding')).to.equal('0px');
    });
});
