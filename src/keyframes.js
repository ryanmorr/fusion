import createStore from '@ryanmorr/create-store';
import { TYPE, KEYFRAMES, CSS } from './constants';
import { getProp } from './prop';
import { isStore, uuid } from './util';

let observer = null;
const docElement = document.documentElement;
const listeners = {};

function startObserver() {
    if (!observer) {
        docElement.addEventListener('animationstart', onStart);
        docElement.addEventListener('animationend', onEnd);
        docElement.addEventListener('animationcancel', onEnd);
    }
}

function onStart(e) {
    const name = e.animationName;
    if (name in listeners) {
        const {get, set} = listeners[name];
        const added = e.target;
        const prev = get();
        const next = prev.concat([added]);
        set(next, prev);
    }
}

function onEnd(e) {
    const name = e.animationName;
    if (name in listeners) {
        const {get, set} = listeners[name];
        const removed = e.target;
        const prev = get();
        const next = prev.filter((el) => el !== removed);
        set(next, prev);
    }
}

function resolveValue(value) {
    if (typeof value === 'function') {
        return resolveValue(value());
    }
    if (isStore(value)) {
        return `var(${getProp(value)})`;
    }
    return value;
}

export const keyframes = createStore((get, set) => (strings, ...values) => {
    startObserver();
    const name = 'animation-' + uuid();
    const frames = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    listeners[name] = {get, set};
    set([], []);
    return {
        [TYPE]: KEYFRAMES,
        [CSS]: frames,
        toString: () => name,
        get
    };
});
