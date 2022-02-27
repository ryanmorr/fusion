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
});
