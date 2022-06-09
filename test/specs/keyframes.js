import { NAME } from '../../src/constants';
import { keyframes, css, val, fallback } from '../../src/fusion';
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
                width: 10px;s
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element = createElement('div', {className: 'foo1'});
        element.classList.add('animate');

        addEvent(element, 'animationend', (e) => {
            expect(e.animationName).to.equal(animation[NAME]);
            expect(getStyle(element, 'width')).to.equal('53px');

            style.remove();

            done();
        });
    });

    it('should update the keyframes store when an animation starts and ends', (done) => {
        const animation = keyframes`
            from {
                width: 5px;
            }
            to {
                width: 25px;
            }
        `;

        const style = css`
            .foo2 {
                width: 10px;
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element1 = createElement('div', {className: 'foo2'});

        expect(animation.get()).to.deep.equal([]);

        const spy = sinon.spy();
        animation.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.deep.equal([]);

        element1.classList.add('animate');

        addEvent(document, 'animationstart', () => {
            expect(animation.get()).to.deep.equal([element1]);
            expect(spy.callCount).to.equal(2);
            expect(spy.args[1][0]).to.deep.equal([element1]);
            expect(spy.args[1][1]).to.deep.equal([]);
        });

        addEvent(document, 'animationend', () => {
            expect(animation.get()).to.deep.equal([]);
            expect(spy.callCount).to.equal(3);
            expect(spy.args[2][0]).to.deep.equal([]);
            expect(spy.args[2][1]).to.deep.equal([element1]);

            style.remove();

            done();
        });
    });

    it('should update the keyframes store when multiple element animations start and end', (done) => {
        const animation = keyframes`
            from {
                width: 5px;
            }
            to {
                width: 25px;
            }
        `;

        const style = css`
            .foo3 {
                width: 10px;
            }
            .animate {
                animation: ${animation} 0.1s forwards;
            }
        `;

        document.head.appendChild(style);
        const element1 = createElement('div', {className: 'foo3'});
        const element2 = createElement('div', {className: 'foo3'});
        const element3 = createElement('div', {className: 'foo3'});

        expect(animation.get()).to.deep.equal([]);

        const spy = sinon.spy();
        animation.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.deep.equal([]);

        element1.classList.add('animate');
        element2.classList.add('animate');
        element3.classList.add('animate');

        const animationStartSpy = sinon.spy(() => {
            if (animationStartSpy.callCount === 3) {
                expect(animation.get()).to.deep.equal([element1, element2, element3]);
                expect(spy.callCount).to.equal(4);

                expect(spy.args[1][0]).to.deep.equal([element1]);
                expect(spy.args[1][1]).to.deep.equal([]);

                expect(spy.args[2][0]).to.deep.equal([element1, element2]);
                expect(spy.args[2][1]).to.deep.equal([element1]);

                expect(spy.args[3][0]).to.deep.equal([element1, element2, element3]);
                expect(spy.args[3][1]).to.deep.equal([element1, element2]);
            }
        });
        addEvent(document, 'animationstart', animationStartSpy);

        const animationEndSpy = sinon.spy(() => {
            if (animationEndSpy.callCount === 3) {
                expect(animation.get()).to.deep.equal([]);
                expect(spy.callCount).to.equal(7);

                expect(spy.args[4][0]).to.deep.equal([element2, element3]);
                expect(spy.args[4][1]).to.deep.equal([element1, element2, element3]);

                expect(spy.args[5][0]).to.deep.equal([element3]);
                expect(spy.args[5][1]).to.deep.equal([element2, element3]);

                expect(spy.args[6][0]).to.deep.equal([]);
                expect(spy.args[6][1]).to.deep.equal([element3]);

                style.remove();

                done();
            }
        });
        addEvent(document, 'animationend', animationEndSpy);
    });

    it('should support multiple keyframe stores', (done) => {
        const animation1 = keyframes`
            from {
                width: 5px;
            }
            to {
                width: 25px;
            }
        `;

        const animation2 = keyframes`
            from {
                width: 15px;
            }
            to {
                width: 47px;
            }
        `;

        const style = css`
            .foo4 {
                width: 10px;
            }
            .animate4 {
                animation: ${animation1} 0.1s forwards;
            }
            .animate5 {
                animation: ${animation2} 0.2s forwards;
            }
        `;

        document.head.appendChild(style);
        const element1 = createElement('div', {className: 'foo4'});
        const element2 = createElement('div', {className: 'foo4'});
        const element3 = createElement('div', {className: 'foo4'});

        expect(animation1.get()).to.deep.equal([]);
        expect(animation2.get()).to.deep.equal([]);

        const spy1 = sinon.spy();
        animation1.subscribe(spy1);

        const spy2 = sinon.spy();
        animation2.subscribe(spy2);

        expect(spy1.callCount).to.equal(1);
        expect(spy1.args[0][0]).to.deep.equal([]);

        expect(spy2.callCount).to.equal(1);
        expect(spy2.args[0][0]).to.deep.equal([]);

        element1.classList.add('animate4');
        element2.classList.add('animate5');
        element3.classList.add('animate4');

        const animationStartSpy = sinon.spy(() => {
            if (animationStartSpy.callCount === 3) {
                expect(animation1.get()).to.deep.equal([element1, element3]);
                expect(spy1.callCount).to.equal(3);

                expect(spy1.args[1][0]).to.deep.equal([element1]);
                expect(spy1.args[1][1]).to.deep.equal([]);

                expect(spy1.args[2][0]).to.deep.equal([element1, element3]);
                expect(spy1.args[2][1]).to.deep.equal([element1]);

                expect(animation2.get()).to.deep.equal([element2]);
                expect(spy2.callCount).to.equal(2);

                expect(spy2.args[1][0]).to.deep.equal([element2]);
                expect(spy2.args[1][1]).to.deep.equal([]);
            }
        });
        addEvent(document, 'animationstart', animationStartSpy);

        const animationEndSpy = sinon.spy(() => {
            if (animationEndSpy.callCount === 3) {
                expect(animation1.get()).to.deep.equal([]);
                expect(spy1.callCount).to.equal(5);

                expect(spy1.args[3][0]).to.deep.equal([element3]);
                expect(spy1.args[3][1]).to.deep.equal([element1, element3]);

                expect(spy1.args[4][0]).to.deep.equal([]);
                expect(spy1.args[4][1]).to.deep.equal([element3]);

                expect(animation2.get()).to.deep.equal([]);
                expect(spy2.callCount).to.equal(3);

                expect(spy2.args[2][0]).to.deep.equal([]);
                expect(spy2.args[2][1]).to.deep.equal([element2]);

                style.remove();

                done();
            }
        });
        addEvent(document, 'animationend', animationEndSpy);
    });

    it('should support interpolating stores', (done) => {
        const store = val('41px');

        const animation = keyframes`
            from {
                width: 10px;
            }
            to {
                width: ${store};
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

            store.set('36px');

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
        const store = val();

        const animation = keyframes`
            from {
                width: 1px;
            }
            to {
                width: ${fallback(store, '33px')};
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

            store.set('7px');

            element2.classList.add('animate');
        });

        addEvent(element2, 'animationend', () => {
            expect(getStyle(element2, 'width')).to.equal('7px');

            style.remove();

            done();
        });
    });

    it('should only create a keyframes definition once', () => {
        const animation = keyframes`
            from {
                width: 1px;
            }
            to {
                width: 5px;
            }
        `;

        const style = css`
            .foo {
                animation-name: ${animation};
            }
            .bar {
                animation-name: ${animation};
            }
        `;

        const style2 = css`
            .baz {
                animation-name: ${animation};
            }
        `;

        expect(style.innerHTML.match(/@keyframes/g).length).to.equal(1);
        expect(style2.innerHTML.includes('@keyframes')).to.equal(false);
    });
});
