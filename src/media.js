import defineStore from '@ryanmorr/define-store';

export const media = defineStore((get, set) => (query) => {
    const mq = matchMedia(query);
    const setValue = () => set(mq.matches);
    mq.addEventListener('change', setValue);
    setValue();
    return {
        css: '@media ' + query,
        value: get
    };
});
