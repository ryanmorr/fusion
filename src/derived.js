import createStore from '@ryanmorr/create-store';
import { TYPE } from './constants';

export const derived = createStore((get, set) => (...deps) => {
    let initialized = false;
    const callback = deps.pop();
    const values = [];
    const sync = () => set(callback(...values), get());
    deps.forEach((dep, i) => dep.subscribe((value) => {
        values[i] = value;
        if (initialized) {
            sync();
        }
    }));
    initialized = true;
    sync();
    return {
        [TYPE]: 'derived',
        get
    };
});
