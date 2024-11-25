import { uuid, isStore, isPromise } from './utils';

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
    if ('prop' in obj) {
        return obj.prop;
    }
    const prop = `--${uuid()}`;
    if (isStore(obj)) {
        obj.subscribe((value) => setProp(prop, value));
    } else {
        obj.then((value) => setProp(prop, value));
    }
    return obj.prop = prop;
}
