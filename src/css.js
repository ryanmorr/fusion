import { TYPE, MEDIA, QUERY, KEYFRAMES, CSS } from './constants';
import { getProp } from './prop';
import { isStore, isPromise } from './util';

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

export function css(strings, ...values) {
    let styles = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    Object.keys(keyframes).forEach((key) => {
        const value = keyframes[key];
        if (typeof value === 'string') {
            styles += ' ' + value;
            keyframes[key] = true;
        }
    });
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styles));
    return style;
}
