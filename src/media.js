import defineStore from '@ryanmorr/define-store';

export const media = defineStore((get, set) => (query) => {
    const mq = matchMedia(query);
    const setValue = () => set(mq.matches);
    if ('addEventListener' in mq) {
        mq.addEventListener('change', setValue);
    } else {
        mq.addListener(setValue);
    }
    setValue();
    return {
        css: '@media ' + query,
        value: get
    };
});
