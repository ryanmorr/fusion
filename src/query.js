import { Store } from '@ryanmorr/isotope';

let observer = null;
const listeners = [];

function find(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function observe(store) {
    if (!observer) {
        observer = new MutationObserver(() => listeners.forEach((store) => store.set()));
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    listeners.push(store);
}

export class QueryStore extends Store {
    constructor(selector) {
        super(find(selector));
        this.selector = selector;
        observe(this);
    }

    set() {
        const prev = this.value();
        const next = find(this.selector);
        if (next.filter((el) => !prev.includes(el)).length > 0 ||
            prev.filter((el) => !next.includes(el)).length > 0) {
            super.set(next);
        }
    }
}

export function query(selector) {
    return new QueryStore(selector);
}
