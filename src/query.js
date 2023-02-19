import createStore from '@ryanmorr/create-store';
import { TYPE, QUERY, CSS } from './constants';

let observer = null;
const listeners = [];

function find(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function startObserver() {
    if (!observer) {
        observer = new MutationObserver(checkSelectors);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
}

function checkSelectors() {
    listeners.forEach(({selector, get, set}) => {
        const prev = get();
        const next = find(selector);
        const added = next.filter((el) => !prev.includes(el));
        const removed = prev.filter((el) => !next.includes(el));
        if (added.length > 0 || removed.length > 0) {
            set(next, prev);
        }
    });
}

export const query = createStore((get, set) => (selector) => {
    startObserver();
    listeners.push({selector, get, set});
    set(find(selector), []);
    return {
        [TYPE]: QUERY,
        [CSS]: selector,
        value: get
    };
});
