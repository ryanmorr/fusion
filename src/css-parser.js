import { walk } from '@ryanmorr/amble';

const SELECTOR_GROUP_RE = /([\s\S]+,[\s\S]+)/m;

function parse(css) {
    const ast = [{children: []}];
    let depth = 0;
    walk(css, (style, char) => {
        if (char == '{') {
            ast[++depth] = {
                selector: style,
                rules: '',
                children: []
            };
        } else if (char == '}') {
            ast[depth].rules += style;
            ast[--depth].children.push(ast.pop());
        } else if (char == ';') {
            ast[depth].rules += style + char;
        }
    });
    return ast[0].children;
}

function build(ast, parent) {
    return ast.reduce((css, block) => {
        let selector = block.selector.trim();
        if (selector[0] === '@') {
            css += selector + '{';
            if (block.children.length > 0) {
                css += build(block.children, parent) + '}';
            }
        } else {
            if (parent && selector[0] === '&') {
                selector = parent + selector.substring(1).replace(SELECTOR_GROUP_RE, ':is($1)');
            } else if (parent) {
                selector = parent + ' ' + selector.replace(SELECTOR_GROUP_RE, ':is($1)');
            } else {
                selector = selector.replace(SELECTOR_GROUP_RE, ':is($1)');
            }
            css += selector + '{' + block.rules + '}';
            if (block.children.length > 0) {
                css += build(block.children, selector);
            }
        }
        return css;
    }, '');
}

export function convert(css) {
    return build(parse(css));
}
