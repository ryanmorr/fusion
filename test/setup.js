const elements = [];

export function getStyle(el, prop) {
    return getComputedStyle(el).getPropertyValue(prop);
}

export function createElement(tag, props) {
    const el = document.createElement(tag);
    if (props) {
        Object.keys(props).forEach((name) => el[name] = props[name]);
    }
    document.body.appendChild(el);
    elements.push(el);
    return el;
}

export function appendStyle(style) {
    document.head.appendChild(style);
    elements.push(style);
    return style;
}

afterEach(() => elements.forEach((el) => el.remove()));
