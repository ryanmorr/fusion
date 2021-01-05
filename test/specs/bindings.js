import { val, css } from '../../src/fusion';

describe('bindings', () => {
    it('should render a store as a CSS variable', () => {
        const width = val('22px');

        const style = css`
            .foo {
                width: ${width};
            }
        `;
        
        const foo = document.createElement('div');
        foo.className = 'foo';
        document.body.appendChild(foo);
        document.head.appendChild(style);

        expect(window.getComputedStyle(foo).getPropertyValue('width')).to.equal('22px');

        foo.remove();
        style.disabled = true;
        style.remove();
    });

    it('should update a CSS variable', () => {
        const width = val('7px');

        const style = css`
            .foo {
                width: ${width};
            }
        `;
        
        const foo = document.createElement('div');
        foo.className = 'foo';
        document.body.appendChild(foo);
        document.head.appendChild(style);

        expect(window.getComputedStyle(foo).getPropertyValue('width')).to.equal('7px');

        width.set('58px');

        expect(window.getComputedStyle(foo).getPropertyValue('width')).to.equal('58px');

        foo.remove();
        style.remove();
    });
});
