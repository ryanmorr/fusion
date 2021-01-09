import createStore from '@ryanmorr/create-store';
import { TYPE } from './constants';

export const val = createStore((get, set) => (value) => {
    set(value);
    const setValue = (val) => {
        set(val, get());
    };
    return {
        [TYPE]: 'val',
        get,
        set: setValue,
        update(callback) {
            setValue(callback(get()));
        }
    };
});
