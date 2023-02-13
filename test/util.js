const elements = [];

export function getStyle(el, prop) {
    return el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue(prop);
}

export function createElement(tag, props) {
    const el = document.createElement(tag);
    if (props) {
        Object.keys(props).forEach((name) => el[name] = props[name]);
    }
    elements.push(document.body.appendChild(el));
    return el;
}

export function appendStyle(style) {
    elements.push(document.head.appendChild(style));
    return style;
}

export function wait() {
    return new Promise((resolve) => setTimeout(resolve, 50));
}

afterEach(() => elements.forEach((el) => el.remove()));
