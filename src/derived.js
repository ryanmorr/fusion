import createStore from '@ryanmorr/create-store';

export const derived = createStore((get, set) => (...deps) => {
    let initialized = false;
    const callback = deps.pop();
    const isAsync = callback.length > deps.length;
    const values = [];
    const sync = () => isAsync ? callback(...values) : set(callback(...values), get());
    deps.forEach((dep, i) => dep.subscribe((value) => {
        values[i] = value;
        if (initialized) {
            sync();
        }
    }));
    if (isAsync) {
        values.push((val) => set(val, get()));
    }
    initialized = true;
    sync();
    return {
        value: get,
        then: (resolve) => resolve(get()),
        toString: () => String(get()),
        toJSON: get,
        valueOf: get
    };
});
