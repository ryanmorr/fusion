export function uuid() {
    return Math.random().toString(36).substring(2, 11);
}

export function isStore(obj) {
    return obj && typeof obj.subscribe === 'function';
}

export function isPromise(obj) {
    return Promise.resolve(obj) === obj;
}

export function compileTaggedTemplate(strings, values, callback) {
    return strings.raw.reduce((acc, str, i) => acc + (callback(values[i - 1])) + str);
}
