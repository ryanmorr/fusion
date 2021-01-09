import { TYPE, CSS } from './constants';
import { uuid, isStore, isPromise } from './util';

const docStyle = document.documentElement.style;

function resolveValue(value) {
    if (isStore(value)) {
        if (value[TYPE] === 'val' || value[TYPE] === 'derived') {
            return `var(${getProp(value)})`;
        }
        if (value[TYPE] === 'media') {
            return `@media ${value[CSS]}`;
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

function setProp(prop, value) {
    if (isPromise(value)) {
        value.then((val) => setProp(prop, val));
        return;
    }
    const currentValue = docStyle.getPropertyValue(prop);
    if (currentValue !== '' && value == null) {
        docStyle.removeProperty(prop);
    } else if (value != null) {
        docStyle.setProperty(prop, value);
    }
}

export function getProp(obj) {
    if (CSS in obj) {
        return obj[CSS];
    }
    const prop = `--${uuid()}`;
    if (isStore(obj)) {
        obj.subscribe((value) => setProp(prop, value));
    } else {
        obj.then((value) => setProp(prop, value));
    }
    return obj[CSS] = prop;
}

export function css(strings, ...values) {
    const styles = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styles));
    return style;
}
