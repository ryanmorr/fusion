import { convert } from '../../src/css-parser';

describe('nested-css', () => {
    it('should support nested CSS with a parent selector', () => {
        expect(convert(`
            .foo {
                width: 12px;
        
                &::before {
                    width: 27px;
                }
            }
        `)).to.equal('.foo{width:12px;}.foo::before{width:27px;}');
    });

    it('should support nested CSS with a child selector', () => {
        expect(convert(`
            .foo {
                width: 4px;
        
                .bar {
                    width: 15px;
                }
            }
        `)).to.equal('.foo{width:4px;}.foo .bar{width:15px;}');
    });

    it('should support nested CSS with at-rules', () => {
        expect(convert(`
            .foo {
                color: black;

                @media (max-width: 480px) {
                    & {
                        color: green;
                    }
                }
            }
        `)).to.equal('.foo{color:black;}@media (max-width:480px){.foo{color:green;}}');
    });

    it('should support nested CSS with multiple parents', () => {
        expect(convert(`
            .foo, .bar {
                width: 10px;
        
                &.baz {
                    width: 20px;
                }
            }
        `)).to.equal(':is(.foo, .bar){width:10px;}:is(.foo, .bar).baz{width:20px;}');
    });

    it('should support deeply nested CSS', () => {
        expect(convert(`
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
        `)).to.equal('.foo{width:10px;}.foo .bar{width:20px;}.foo .bar .baz{width:30px;}.foo .bar .baz .qux{width:40px;}');
    });

    it('should support nested CSS with complex selectors', () => {
        expect(convert(`
            #foo > [attr=val]:empty + div.foo.bar, :not(span[attr]:contains("foo")) {
                width: 10px;
        
                .bar::before {
                    width: 20px;
                }
            }
        `)).to.equal(':is(#foo > [attr=val]:empty + div.foo.bar,:not(span[attr]:contains("foo"))){width:10px;}:is(#foo > [attr=val]:empty + div.foo.bar,:not(span[attr]:contains("foo"))) .bar::before{width:20px;}');
    });

    it('should support nested CSS without mangling properties', () => {
        expect(convert(`
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
        `)).to.equal(`.foo{--main-bg-color:brown;background-color:var(--main-bg-color, hsla(30, 100%, 50%, .3));color:rgba(255,0,0,.5);transition:color .3s linear 1s, background .2s ease-in 1s, opacity .3s;background-image:url("foo.jpg"), url("bar.jpg"), url('baz.jpg');}.foo .bar{font-family:Times, "Times New Roman", serif;width:calc(30% * 20em - 2vh / 2pt);box-shadow:inset 0 0 10px rgba(0,0,0,.5) !important;transform:rotate(-45deg) skew(20deg, 40deg) scale(2);}`); // eslint-disable-line quotes
    });
});
