import { uuid, isStore, isPromise } from './util';

const CSS_VAR = Symbol('css-var');
const docElement = document.documentElement;

function getCSSVar(obj) {
    if (CSS_VAR in obj) {
        return obj[CSS_VAR];
    }
    const prop = `--${uuid()}`;
    obj[isStore(obj) ? 'subscribe' : 'then']((value) => docElement.style.setProperty(prop, value));    
    return obj[CSS_VAR] = prop;
}

function resolveValue(value) {
    if (isStore(value) || isPromise(value)) {
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
