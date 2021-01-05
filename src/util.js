export function uuid() {
    return Math.random().toString(36).substr(2, 9);
}

export function isStore(obj) {
    return obj && typeof obj.subscribe === 'function';
}

export function isPromise(obj) {
    return Promise.resolve(obj) === obj;
}
