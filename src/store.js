import createStore from '@ryanmorr/create-store';

export const store = createStore((get, set) => (value) => {
    set(value);
    const setValue = (val) => {
        set(val, get());
        return val;
    };
    return {
        value: get,
        set: setValue,
        update(callback) {
            return setValue(callback(get()));
        }
    };
});
