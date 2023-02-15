import { css } from '../../src/fusion';
import { createElement, getStyle } from '../util';

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

    it('should support nested CSS', () => {
        const style = css`
            .foo {
                color: red;
        
                .bar {
                    color: blue;
                }
            }
        `;

        expect(style.innerHTML).to.equal('.foo{color:red;}.foo .bar{color:blue;}');
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
});
