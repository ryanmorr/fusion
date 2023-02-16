import { media, css, style } from '../../src/fusion';
import { getStyle, wait } from '../util';

describe('media', () => {
    let iframe;
    const originalMatchMedia = window.matchMedia;

    before(() => {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        window.matchMedia = iframe.contentWindow.matchMedia;
    });

    after(() => {
        document.body.removeChild(iframe);
        window.matchMedia = originalMatchMedia;
    });

    function setWidth(width) {
        iframe.style.width = `${width}px`;
        return iframe.clientWidth;
    }

    it('should store a boolean based on a media query', () => {
        setWidth(800);

        const mq = media('(max-width: 750px)');

        expect(mq.get()).to.equal(false);
    });

    it('should call subscribes when the status of the media query changes', async () => {
        setWidth(800);

        const mq = media('(max-width: 750px)');

        const spy = sinon.spy();
        mq.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(false);

        setWidth(700);

        await wait();

        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(true);

        setWidth(900);

        await wait();

        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(false);
    });

    it('should interpolate a media store into a CSS stylesheet', async () => {
        setWidth(800);

        const smallScreen = media('(max-width: 750px)');

        iframe.contentDocument.head.appendChild(css`
            .foo {
                width: 10px
            }

            ${smallScreen} {
                .foo {
                    width: 20px
                }
            }
        `);
        
        const element = document.createElement('div');
        element.className = 'foo';
        iframe.contentDocument.body.appendChild(element);

        expect(getStyle(element, 'width')).to.equal('10px');

        setWidth(700);

        await wait();

        expect(getStyle(element, 'width')).to.equal('20px');
    });

    it('should interpolate a media store into a style declaration', async () => {
        setWidth(800);

        const smallScreen = media('(max-width: 750px)');

        const className = style`
            width: 10px

            ${smallScreen} {
                & {
                    width: 20px
                }
            }
        `;
        
        let css;
        const styles = document.querySelectorAll('style');
        Array.from(styles).forEach((style) => css += style.textContent);

        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        iframe.contentDocument.head.appendChild(styleEl);
        
        const element = document.createElement('div');
        element.className = className;
        iframe.contentDocument.body.appendChild(element);

        expect(getStyle(element, 'width')).to.equal('10px');

        setWidth(700);

        await wait();

        expect(getStyle(element, 'width')).to.equal('20px');
    });
});
