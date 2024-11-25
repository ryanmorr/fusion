import { getProp } from './prop';
import { isStore, isPromise } from './utils';

export function fallback(...values) {
    let n = 1;
    const length = values.length;
    const reducer = (acc, value, i) => {
        if (typeof value === 'function') {
            return reducer(acc, value(), i);
        }
        if (isStore(value) || isPromise(value)) {
            n++;
            acc += `var(${getProp(value)}`;
        } else if (typeof value === 'string' && value.startsWith('--')) {
            n++;
            acc += `var(${value}`;
        } else {
            acc += value;
        }
        acc += ((i + 1) !== length) ? ', ' : Array(n).join(')');
        return acc;
    };
    return values.reduce(reducer, '');
}
