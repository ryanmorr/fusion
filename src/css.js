const CSS_VAR = Symbol('css-var');
const docElement = document.documentElement;

function uuid() {
    return Math.random().toString(36).substr(2, 9);
}

function isStore(obj) {
    return obj && typeof obj.subscribe === 'function';
}

function getCSSVar(store) {
    if (CSS_VAR in store) {
        return store[CSS_VAR];
    }
    const prop = `--${uuid()}`;
    store[CSS_VAR] = prop;
    store.subscribe((value) => docElement.style.setProperty(prop, value));
    return prop;
}

function resolveValue(value) {
    if (isStore(value)) {
        return `var(${getCSSVar(value)})`;
    }
    return value;
}

export function css(strings, ...values) {
    const styles = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styles));
    return style;
}
