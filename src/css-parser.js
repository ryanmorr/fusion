const PROP = 1;
const VALUE = 2;
const SELECTOR_GROUP_RE = /(.+,.+)/;

function parse(css) {
    const ast = [{children: []}];
    let mode = PROP;
    let buffer = '';
    let depth = 0;
    let quote = '';
    let current = '';
    for (let i = 0, len = css.length; i < len; i++) {
        const char = css[i];
        if (char == '\n' || ((char == ';' || char == '}') && !quote)) {
            if (current) {
                ast[depth].rules += current + buffer.trim() + quote + ';';
            }
            if (char == '}') {
                ast[--depth].children.push(ast.pop());
            }
            mode = PROP;
            current = buffer = quote = '';
        } else if (char == '{' && !quote) {
            ast[++depth] = {
                selector: (current + ' ' + buffer).trim(),
                rules: '',
                children: []
            };
            mode = PROP;
            current = buffer = '';
        } else if (mode == PROP) {
            if (char == ' ') {
                if ((current = buffer.trim())) {
                    mode = VALUE;
                    buffer = '';
                }
            } else {
                buffer += char;
            }
        } else if (mode == VALUE) {
            if (quote) {
                if (char == quote && css[i - 1] != '\\') {
                    quote = '';
                }
            } else if (char == "'" || char == '"') { // eslint-disable-line quotes
                quote = char;
            }
            buffer += char;
        }
    }
    return ast[0].children;
}

function build(ast, parent) {
    return ast.reduce((css, block) => {
        let selector = block.selector;
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
    return build(parse(css.trim()));
}
