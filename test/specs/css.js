import { store, derived, css } from '../../src/fusion';
import { createElement, appendStyle, getStyle } from '../util';

describe('css', () => {
    it('should create a style element', () => {
        const style = css`
            .foo {
                width: 72px;
            }
        `;

        expect(style.nodeType).to.equal(1);
        expect(style.nodeName).to.equal('STYLE');
        expect(document.contains(style)).to.equal(false);

        document.head.appendChild(style);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'width')).to.equal('72px');

        style.remove();
    });

    it('should support custom elements', () => {
        let element;

        customElements.define('custom-element', class CustomElement extends HTMLElement {
            connectedCallback() {

                const root = this.attachShadow({mode: 'open'});
                root.appendChild(css`
                    div {
                        width: 61px;
                    }
                `);
                element = document.createElement('div');
                root.appendChild(element);
            }
        });

        createElement('custom-element');

        expect(getStyle(element, 'width')).to.equal('61px');
    });

    it('should interpolate a string', () => {
        const display = 'inline';

        appendStyle(css`
            .foo {
                display: ${display};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'display')).to.equal('inline');
    });

    it('should interpolate a number', () => {
        const width = 45;

        appendStyle(css`
            .foo {
                width: ${width}px;
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('45px');
    });

    it('should interpolate a store as a CSS variable', () => {
        const width = store('22px');

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('22px');
    });

    it('should update a CSS variable when a store is updated', () => {
        const width = store('7px');

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
        const width = store('7px');

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

    it('should interpolate a promise', async () => {
        const width = Promise.resolve('103px');

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        await width;

        expect(getStyle(element, 'width')).to.equal('103px');
    });

    it('should not set a CSS variable if a store contains null or undefined', () => {
        const margin = store(undefined);
        const padding = store(null);

        appendStyle(css`
            .foo {
                margin: ${margin};
                padding: ${padding};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'margin')).to.equal('0px');
        expect(getStyle(element, 'padding')).to.equal('0px');
    });

    it('should not set a CSS variable if a promise resolves with a value of null or undefined', async () => {
        const margin = Promise.resolve(undefined);
        const padding = Promise.resolve(null);

        appendStyle(css`
            .foo {
                margin: ${margin};
                padding: ${padding};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        await Promise.all([margin, padding]);

        expect(getStyle(element, 'margin')).to.equal('0px');
        expect(getStyle(element, 'padding')).to.equal('0px');
    });

    it('should not set a CSS variable if a promise is rejected', async () => {
        const margin = Promise.reject('10px');

        appendStyle(css`
            .foo {
                margin: ${margin};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        try {
            await margin;
        } catch {
            expect(getStyle(element, 'margin')).to.equal('0px');
        }
    });

    it('should unset a CSS variable with null or undefined', () => {
        const height = store('5px');

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

    it('should interpolate a store that contains a promise', async () => {
        const width = store();

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        const promise = Promise.resolve('92px');

        width.set(promise);
        
        await promise;

        expect(getStyle(element, 'width')).to.equal('92px');
    });

    it('should interpolate a derived store', () => {
        const x = store(5);
        const y = store(10);
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

    it('should interpolate a function', () => {
        appendStyle(css`
            .foo {
                width: ${() => '13px'};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('13px');
    });

    it('should interpolate a function that returns a store', () => {
        const width = store('17px');

        appendStyle(css`
            .foo {
                width: ${() => width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'width')).to.equal('17px');

        width.set('31px');

        expect(getStyle(element, 'width')).to.equal('31px');
    });

    it('should interpolate a function that returns a promise', async () => {
        const width = Promise.resolve('27px');

        appendStyle(css`
            .foo {
                width: ${() => width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        await width;

        expect(getStyle(element, 'width')).to.equal('27px');
    });

    it('should interpolate a promise that resolves with a function', async () => {
        const width = Promise.resolve(() => '68px');

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        await width;

        expect(getStyle(element, 'width')).to.equal('68px');
    });

    it('should interpolate a store that contains a function', () => {
        const width = store(() => '5px');

        appendStyle(css`
            .foo {
                width: ${() => width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'width')).to.equal('5px');

        width.set(() => '44px');

        expect(getStyle(element, 'width')).to.equal('44px');
    });

    it('should interpolate a store that contains a promise that resolves with a function', async () => {
        const promise = Promise.resolve(() => '19px');
        const width = store(promise);

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        await promise;

        expect(getStyle(element, 'width')).to.equal('19px');
    });

    it('should interpolate nested functions', () => {
        appendStyle(css`
            .foo {
                width: ${() => () => () => '32px'};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('32px');
    });

    it('should interpolate a promise that resolves with nested functions', async () => {
        const width = Promise.resolve(() => () => () => '50px');

        appendStyle(css`
            .foo {
                width: ${width};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        await width;

        expect(getStyle(element, 'width')).to.equal('50px');
    });
    
    it('should support multiple interpolations of the same promise', async () => {
        const promise = Promise.resolve('14px');

        appendStyle(css`
            .foo {
                width: ${promise};
                height: ${promise};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        await promise;

        expect(getStyle(element, 'width')).to.equal('14px');
        expect(getStyle(element, 'height')).to.equal('14px');
    });

    it('should support multiple interpolations of the same function', () => {
        const fn = () => '25px';

        appendStyle(css`
            .foo {
                width: ${fn};
                height: ${fn};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('25px');
        expect(getStyle(element, 'height')).to.equal('25px');
    });

    it('should not set a CSS variable if a function returns null or undefined', () => {
        const margin = () => undefined;
        const padding = () => null;

        appendStyle(css`
            .foo {
                margin: ${margin};
                padding: ${padding};
            }
        `);
        
        const element = createElement('div', {className: 'foo'});
        
        expect(getStyle(element, 'margin')).to.equal('0px');
        expect(getStyle(element, 'padding')).to.equal('0px');
    });

    it('should support shadow DOM', () => {
        let element;
        const width = store('128px');

        customElements.define('custom-element-2', class CustomElement2 extends HTMLElement {
            constructor() {
                super();
                const root = this.attachShadow({mode: 'open'});
                root.appendChild(css`
                    div {
                        width: ${width};
                    }
                `);
                element = document.createElement('div');
                root.appendChild(element);
            }
        });

        createElement('custom-element-2');

        expect(getStyle(element, 'width')).to.equal('128px');

        width.set('27px');

        expect(getStyle(element, 'width')).to.equal('27px');
    });

    it('should interpolate a `css` stylesheet into another `css` stylesheet', () => {
        appendStyle(css`
            .foo {
                width: 66px;
            }
    
            ${css`
                .bar {
                    width: 33px;
                }
            `}
        `);
        
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'bar'});
    
        expect(getStyle(element1, 'width')).to.equal('66px');
        expect(getStyle(element2, 'width')).to.equal('33px');
    });
    
    it('should support interpolating any style element into a `css` stylesheet', () => {
        const style = document.createElement('style');
        style.textContent = `
            .bar {
                width: 20px;
            }
        `;
    
        appendStyle(css`
            .foo {
                width: 84px;
            }
    
            ${style}
        `);
        
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'bar'});
    
        expect(getStyle(element1, 'width')).to.equal('84px');
        expect(getStyle(element2, 'width')).to.equal('20px');
    });

    it('should support nested CSS with a parent selector', () => {
        const style = css`
            .foo {
                width: 12px;
        
                &::before {
                    width: 27px;
                }
            }
        `;

        expect(style.textContent).to.equal('.foo{width:12px;}.foo::before{width:27px;}');
    });

    it('should support nested CSS with a child selector', () => {
        const style = css`
            .foo {
                width: 4px;
        
                .bar {
                    width: 15px;
                }
            }
        `;
        
        expect(style.textContent).to.equal('.foo{width:4px;}.foo .bar{width:15px;}');
    });

    it('should support nested CSS with at-rules', () => {
        const style = css`
            .foo {
                color: black;

                @media (max-width: 480px) {
                    & {
                        color: green;
                    }
                }
            }
        `;
        
        expect(style.textContent).to.equal('.foo{color:black;}@media (max-width:480px){.foo{color:green;}}');
    });

    it('should support nested CSS with multiple parents', () => {
        const style = css`
            .foo, .bar {
                width: 10px;
        
                &.baz {
                    width: 20px;
                }
            }
        `;
        
        expect(style.textContent).to.equal(':is(.foo, .bar){width:10px;}:is(.foo, .bar).baz{width:20px;}');
    });

    it('should support deeply nested CSS', () => {
        const style = css`
            .foo {
                width: 10px;
        
                .bar {
                    width: 20px;

                    .baz {
                        width: 30px;

                        .qux {
                            width: 40px;
                        }
                    }
                }
            }
        `;
        
        expect(style.textContent).to.equal('.foo{width:10px;}.foo .bar{width:20px;}.foo .bar .baz{width:30px;}.foo .bar .baz .qux{width:40px;}');
    });

    it('should support nested CSS with complex selectors', () => {
        const style = css`
            #foo > [attr=val]:empty + div.foo.bar, :not(span[attr]:contains("foo")) {
                width: 10px;
        
                .bar::before {
                    width: 20px;
                }
            }
        `;
        
        expect(style.textContent).to.equal(':is(#foo > [attr=val]:empty + div.foo.bar,:not(span[attr]:contains("foo"))){width:10px;}:is(#foo > [attr=val]:empty + div.foo.bar,:not(span[attr]:contains("foo"))) .bar::before{width:20px;}');
    });

    it('should support nested CSS without mangling properties', () => {
        const style = css`
            .foo {
                --main-bg-color: brown;
                background-color: var(--main-bg-color, hsla(30, 100%, 50%, .3));
                color: rgba(255,0,0,.5);
                transition: color .3s linear 1s, background .2s ease-in 1s, opacity .3s;
                background-image: url("foo.jpg"), url("bar.jpg"), url('baz.jpg');
        
                .bar {
                    font-family: Times, "Times New Roman", serif;
                    width: calc(30% * 20em - 2vh / 2pt);
                    box-shadow: inset 0 0 10px rgba(0,0,0,.5) !important;
                    transform: rotate(-45deg) skew(20deg, 40deg) scale(2);
                }                    
            }
        `;
        
        expect(style.textContent).to.equal(`.foo{--main-bg-color:brown;background-color:var(--main-bg-color, hsla(30, 100%, 50%, .3));color:rgba(255,0,0,.5);transition:color .3s linear 1s, background .2s ease-in 1s, opacity .3s;background-image:url("foo.jpg"), url("bar.jpg"), url('baz.jpg');}.foo .bar{font-family:Times, "Times New Roman", serif;width:calc(30% * 20em - 2vh / 2pt);box-shadow:inset 0 0 10px rgba(0,0,0,.5) !important;transform:rotate(-45deg) skew(20deg, 40deg) scale(2);}`); // eslint-disable-line quotes
    });
    
    it('should support interpolating css into nested css', () => {
        appendStyle(css`
            .foo {
                width: 66px;

                ${css`
                    .bar {
                        width: 33px;
                    }
                `}
            }
        `);
        
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'bar'});
    
        expect(getStyle(element1, 'width')).to.equal('66px');
        expect(getStyle(element2, 'width')).to.not.equal('33px');

        element1.appendChild(element2);

        expect(getStyle(element2, 'width')).to.equal('33px');
    });
});
