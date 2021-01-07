import { uuid, isStore, isPromise } from './util';

const CSS = Symbol('css');
const docStyle = document.documentElement.style;

function resolveValue(value) {
    if (isStore(value) || isPromise(value)) {
        return `var(${getProp(value)})`;
    }
    return value;
}

export function getProp(obj) {
    if (CSS in obj) {
        return obj[CSS];
    }
    const prop = `--${uuid()}`;
    obj[isStore(obj) ? 'subscribe' : 'then']((value) => {
        const currentValue = docStyle.getPropertyValue(prop);
        if (currentValue !== '' && value == null) {
            docStyle.removeProperty(prop);
        } else if (value != null) {
            docStyle.setProperty(prop, value);
        }
    });
    return obj[CSS] = prop;
}

export function css(strings, ...values) {
    const styles = strings.raw.reduce((acc, str, i) => acc + (resolveValue(values[i - 1])) + str);
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styles));
    return style;
}
