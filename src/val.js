import createStore from '@ryanmorr/create-store';

export const val = createStore((get, set) => (value) => {
    set(value);
    const setValue = (val) => {
        set(val, get());
    };
    return {
        get,
        set: setValue,
        update(callback) {
            setValue(callback(get()));
        }
    };
});
