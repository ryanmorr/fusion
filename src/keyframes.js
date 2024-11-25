import { appendCSS } from './css';
import { getProp } from './prop';
import { compileTaggedTemplate, isStore, uuid } from './utils';

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

export function keyframes(strings, ...values) {
    const name = KEYFRAME_PREFIX + uuid();
    const frames = compileTaggedTemplate(strings, values, resolveValue);
    appendCSS(`@keyframes ${name} { ${frames} }`);
    return name;
}
