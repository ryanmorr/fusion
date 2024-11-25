import { walk } from '@ryanmorr/amble';
import { MediaStore } from './media';
import { QueryStore } from './query';
import { getProp } from './prop';
import { compileTaggedTemplate, uuid, isStore, isPromise } from './utils';

let stylesheet;
const CLASS_PREFIX = 'fusion-';
const SELECTOR_GROUP_RE = /([\s\S]+,[\s\S]+)/m;

function parseNestedCSS(css) {
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

function buildCSS(ast, parent) {
    return ast.reduce((css, block) => {
        let selector = block.selector.trim();
        if (selector[0] === '@') {
            css += selector + '{';
            if (block.children.length > 0) {
                css += buildCSS(block.children, parent) + '}';
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
                css += buildCSS(block.children, selector);
            }
        }
        return css;
    }, '');
}

function compileCSS(css) {
    return buildCSS(parseNestedCSS(css));
}

function resolveValue(value) {
    if (typeof value === 'function') {
        return resolveValue(value());
    }
    if (isStore(value)) {
        if (value instanceof MediaStore) {
            return '@media ' + value.query;
        }
        if (value instanceof QueryStore) {
            return value.selector;
        }
        return `var(${getProp(value)})`;
    }
    if (isPromise(value)) {
        return `var(${getProp(value)})`;
    }
    if (value && value.nodeType === 1 && value.nodeName === 'STYLE') {
        return value.textContent;
    }
    return value;
}

export function appendCSS(css) {
    if (!stylesheet) {
        stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
    }
    stylesheet.textContent += css;
}

export function style(strings, ...values) {
    const styles = compileTaggedTemplate(strings, values, resolveValue);
    const className = CLASS_PREFIX + uuid();
    appendCSS(compileCSS(`.${className} { ${styles} }`));
    return className;
}

export function css(strings, ...values) {
    const styles = compileTaggedTemplate(strings, values, resolveValue);
    const style = document.createElement('style');
    style.textContent += compileCSS(styles);
    return style;
}
