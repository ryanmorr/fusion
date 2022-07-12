import createStore from '@ryanmorr/create-store';

export const val = createStore((get, set) => (value) => {
    set(value);
    const setValue = (val) => {
        set(val, get());
        return val;
    };
    return {
        get,
        set: setValue,
        update(callback) {
            return setValue(callback(get()));
        }
    };
});
