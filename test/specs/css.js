import { css } from '../../src/fusion';
import { createElement, appendStyle, getStyle } from '../setup';

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

    it('should interpolate values', () => {
        const width = 45;
        const height = 31;

        appendStyle(css`
            .foo {
                width: ${width}px;
                height: ${height}px;
            }
        `);
        
        const element = createElement('div', {className: 'foo'});

        expect(getStyle(element, 'width')).to.equal('45px');
        expect(getStyle(element, 'height')).to.equal('31px');
    });

    it('should support shadow DOM', () => {
        customElements.define('foo-bar', class FooBar extends HTMLElement {
            constructor() {
                super();
                const root = this.attachShadow({mode: 'open'});
                root.appendChild(css`
                    div {
                        width: 128px;
                    }
                `);
                root.appendChild(document.createElement('div'));
            }
        });

        const element = createElement('foo-bar');

        expect(getStyle(element.shadowRoot.querySelector('div'), 'width')).to.equal('128px');
    });
});
