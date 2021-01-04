import { css } from '../../src/fusion';

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
        
        const foo = document.createElement('div');
        foo.className = 'foo';
        document.body.appendChild(foo);
        document.head.appendChild(style);

        expect(window.getComputedStyle(foo).getPropertyValue('width')).to.equal('72px');

        foo.remove();
        style.remove();
    });

    it('should interpolate values', () => {
        const width = 45;
        const height = 31;

        const style = css`
            .foo {
                width: ${width}px;
                height: ${height}px;
            }
        `;
        
        const foo = document.createElement('div');
        foo.className = 'foo';
        document.body.appendChild(foo);
        document.head.appendChild(style);

        expect(window.getComputedStyle(foo).getPropertyValue('width')).to.equal('45px');
        expect(window.getComputedStyle(foo).getPropertyValue('height')).to.equal('31px');

        foo.remove();
        style.remove();
    });
});
