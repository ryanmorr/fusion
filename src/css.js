import { TYPE, NAME, CSS } from './constants';
import { getProp } from './prop';
import { isStore, isPromise } from './util';

const keyframes = {};

function resolveValue(value) {
    if (typeof value === 'function') {
        return resolveValue(value());
    }
    if (isStore(value)) {
        if (value[TYPE] === 'val' || value[TYPE] === 'derived') {
            return `var(${getProp(value)})`;
        }
        if (value[TYPE] === 'media') {
            return `@media ${value[CSS]}`;
        }
        if (value[TYPE] === 'keyframes') {
            const name = value[NAME];
            if (!(name in keyframes)) {
                keyframes[value[NAME]] = `@keyframes ${value[NAME]} { ${value[CSS]} }`;
            }
            return name;
        }
        if (value[TYPE] === 'query') {
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
