import { keyframes, css, style, store, fallback } from '../../src/fusion';
import { createElement, getStyle } from '../util';

describe('keyframes', () => {
    let events = [];

    function addEvent(element, type, callback) {
        element.addEventListener(type, callback, false);
        events.push([element, type, callback]);
    }

    afterEach(() => {
        events.forEach(([element, type, callback]) => {
            element.removeEventListener(type, callback);
        });
        events = [];
    });

    it('should create keyframes and perform an animation', (done) => {
        const animation = keyframes`
            from {
                width: 10px;
            }
            to {
                width: 53px;
            }
        `;

        const style = css`
            .foo1 {
                width: 10px;
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element = createElement('div', {className: 'foo1'});
        element.classList.add('animate');

        addEvent(element, 'animationend', (e) => {
            expect(e.animationName).to.equal(animation);
            expect(getStyle(element, 'width')).to.equal('53px');

            style.remove();

            done();
        });
    });

    it('should support interpolating stores', (done) => {
        const foo = store('41px');

        const animation = keyframes`
            from {
                width: 10px;
            }
            to {
                width: ${foo};
            }
        `;

        const style = css`
            .foo {
                width: 10px;
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'foo'});
        
        element1.classList.add('animate');

        addEvent(element1, 'animationend', () => {
            expect(getStyle(element1, 'width')).to.equal('41px');

            foo.set('36px');

            element2.classList.add('animate');
        });

        addEvent(element2, 'animationend', () => {
            expect(getStyle(element2, 'width')).to.equal('36px');

            style.remove();

            done();
        });
    });

    it('should support interpolating functions', (done) => {
        const animation = keyframes`
            from {
                width: 10px;
            }
            to {
                width: ${() => '74px'};
            }
        `;

        const style = css`
            .foo {
                width: 10px;
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element = createElement('div', {className: 'foo'});
        
        element.classList.add('animate');

        addEvent(element, 'animationend', () => {
            expect(getStyle(element, 'width')).to.equal('74px');

            style.remove();

            done();
        });
    });

    it('should support interpolating fallbacks', (done) => {
        const foo = store();

        const animation = keyframes`
            from {
                width: 1px;
            }
            to {
                width: ${fallback(foo, '33px')};
            }
        `;

        const style = css`
            .foo {
                width: 1px;
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element1 = createElement('div', {className: 'foo'});
        const element2 = createElement('div', {className: 'foo'});
        
        element1.classList.add('animate');

        addEvent(element1, 'animationend', () => {
            expect(getStyle(element1, 'width')).to.equal('33px');

            foo.set('7px');

            element2.classList.add('animate');
        });

        addEvent(element2, 'animationend', () => {
            expect(getStyle(element2, 'width')).to.equal('7px');

            style.remove();

            done();
        });
    });

    it('should support keyframes in a style declaration', (done) => {
        const animation = keyframes`
            from {
                width: 5px;
            }
            to {
                width: 25px;
            }
        `;

        const className = style`
            width: 10px;

            &.animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        const element = createElement('div', {className});
        element.classList.add('animate');

        addEvent(document, 'animationend', () => {
            expect(getStyle(element, 'width')).to.equal('25px');

            done();
        });
    });
});
