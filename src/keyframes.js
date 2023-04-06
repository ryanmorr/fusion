import { getProp } from './prop';
import { isStore, uuid } from './util';

let style;
const KEYFRAME_PREFIX = 'fusion-animation-';

function resolveValue(value) {
    if (typeof value === 'function') {
        return resolveValue(value());
    }
    if (isStore(value)) {
        return `var(${getProp(value)})`;
    }
    return value;
}

function defineKeyframes(frames) {
    if (!style) {
        style = document.createElement('style');
        document.head.appendChild(style);
    }
    style.textContent += frames;
}

export function keyframes(strings, ...values) {
    const name = KEYFRAME_PREFIX + uuid();
    const frames = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    defineKeyframes(`@keyframes ${name} { ${frames} }`);
    return name;
}
