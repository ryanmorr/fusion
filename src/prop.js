import { uuid, isStore, isPromise } from './utils';

const props = new WeakMap();
const docStyle = document.documentElement.style;

function setProp(prop, value) {
    if (typeof value === 'function') {
        return setProp(prop, value());
    }
    if (isPromise(value)) {
        return value.then((val) => setProp(prop, val));
    }
    const currentValue = docStyle.getPropertyValue(prop);
    if (currentValue !== '' && value == null) {
        docStyle.removeProperty(prop);
    } else if (value != null) {
        docStyle.setProperty(prop, value);
    }
}

export function getProp(obj) {
    if (props.has(obj)) {
        return props.get(obj);
    }
    const prop = `--${uuid()}`;
    if (isStore(obj)) {
        obj.subscribe((value) => setProp(prop, value));
    } else {
        obj.then((value) => setProp(prop, value));
    }
    props.set(obj, prop);
    return prop;
}