import { TYPE, MEDIA, QUERY, KEYFRAMES, CSS } from './constants';
import { convert } from './css-parser';
import { getProp } from './prop';
import { uuid, isStore, isPromise } from './util';

let stylesheet;
const CLASS_PREFIX = 'fusion-';
const keyframes = {};

function resolveValue(value) {
    if (typeof value === 'function' && !isStore(value)) {
        return resolveValue(value());
    }
    if (isStore(value)) {
        if (!(TYPE in value)) {
            return `var(${getProp(value)})`;
        }
        if (value[TYPE] === MEDIA) {
            return `@media ${value[CSS]}`;
        }
        if (value[TYPE] === KEYFRAMES) {
            const name = value.toString();
            if (!(name in keyframes)) {
                keyframes[name] = `@keyframes ${name} { ${value[CSS]} }`;
            }
            return name;
        }
        if (value[TYPE] === QUERY) {
            return value[CSS];
        }
    }
    if (isPromise(value)) {
        return `var(${getProp(value)})`;
    }
    return value;
}

function process(strings, values) {
    let styles = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    Object.keys(keyframes).forEach((key) => {
        const value = keyframes[key];
        if (typeof value === 'string') {
            styles += ' ' + value;
            keyframes[key] = true;
        }
    });
    return styles;
}

export function style(strings, ...values) {
    if (!stylesheet) {
        stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
    }
    const styles = process(strings, values);
    const className = CLASS_PREFIX + uuid();
    stylesheet.textContent += convert(`.${className} { ${styles} }`);
    return className;
}

export function css(strings, ...values) {
    const styles = process(strings, values);
    const style = document.createElement('style');
    style.textContent += convert(styles);
    return style;
}
