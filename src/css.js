export function css(strings, ...values) {
    const styles = strings.raw.reduce((acc, str, i) => acc + (values[i - 1]) + str);
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styles));
    return style;
}
