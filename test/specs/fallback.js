import { css, val, fallback } from '../../src/fusion';
import { createElement, appendStyle, getStyle } from '../setup';

describe('fallback', () => {
    it('should generate CSS variable declarations with fallbacks', () => {
        expect(fallback('--foo', '10px')).to.equal('var(--foo, 10px)');
        expect(fallback('--foo', '--bar')).to.equal('var(--foo, var(--bar))');
        expect(fallback('--foo', '--bar', '--baz')).to.equal('var(--foo, var(--bar, var(--baz)))');
        expect(fallback('--foo', '--bar', 'red')).to.equal('var(--foo, var(--bar, red))');
        expect(fallback('--foo', '--bar', '--baz', '2em')).to.equal('var(--foo, var(--bar, var(--baz, 2em)))');
    });

    it('should support CSS variables', () => {
        appendStyle(css`
            .foo {
                width: ${fallback('--foo', '20px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('20px');

        document.documentElement.style.setProperty('--foo', '31px');
        expect(getStyle(element, 'width')).to.equal('31px');

        document.documentElement.style.removeProperty('--foo');
    });

    it('should support multiple CSS variables', () => {
        appendStyle(css`
            .foo {
                width: ${fallback('--foo', '--bar', '6px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('6px');

        document.documentElement.style.setProperty('--bar', '13px');
        expect(getStyle(element, 'width')).to.equal('13px');

        document.documentElement.style.setProperty('--foo', '81px');
        expect(getStyle(element, 'width')).to.equal('81px');

        document.documentElement.style.removeProperty('--foo');
        document.documentElement.style.removeProperty('--bar');
    });

    it('should support stores', () => {
        const width = val();

        appendStyle(css`
            .foo {
                width: ${fallback(width, '12px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('12px');

        width.set('23px');
        expect(getStyle(element, 'width')).to.equal('23px');
    });

    it('should support multiple stores', () => {
        const width1 = val();
        const width2 = val();

        appendStyle(css`
            .foo {
                width: ${fallback(width1, width2, '33px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('33px');

        width2.set('9px');
        expect(getStyle(element, 'width')).to.equal('9px');

        width1.set('26px');
        expect(getStyle(element, 'width')).to.equal('26px');
    });

    it('should support promises', (done) => {
        const width = new Promise((resolve) => setTimeout(() => resolve('54px'), 100));

        appendStyle(css`
            .foo {
                width: ${fallback(width, '10px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('10px');

        width.then(() => {
            expect(getStyle(element, 'width')).to.equal('54px');
            done();
        });
    });

    it('should support multiple promises', (done) => {
        const width1 = new Promise((resolve) => setTimeout(() => resolve('77px'), 200));
        const width2 = new Promise((resolve) => setTimeout(() => resolve('66px'), 100));

        appendStyle(css`
            .foo {
                width: ${fallback(width1, width2, '25px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('25px');

        width2.then(() => {
            expect(getStyle(element, 'width')).to.equal('66px');
            
            width1.then(() => {
                expect(getStyle(element, 'width')).to.equal('77px');
                done();
            });
        });
    });

    it('should support multiple fallbacks of mixed types', (done) => {
        const widthStore = val();
        const widthPromise = new Promise((resolve) => setTimeout(() => resolve('50px'), 100));

        appendStyle(css`
            .foo {
                width: ${fallback(widthStore, widthPromise, '--foo', '17px')};
            }
        `);

        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('17px');

        document.documentElement.style.setProperty('--foo', '111px');
        expect(getStyle(element, 'width')).to.equal('111px');

        widthPromise.then(() => {
            expect(getStyle(element, 'width')).to.equal('50px');

            widthStore.set('14px');
            expect(getStyle(element, 'width')).to.equal('14px');

            document.documentElement.style.removeProperty('--foo');
            done();
        });
    });
});
