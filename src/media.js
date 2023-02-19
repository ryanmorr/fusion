import createStore from '@ryanmorr/create-store';
import { TYPE, MEDIA, CSS } from './constants';

export const media = createStore((get, set) => (query) => {
    const mq = matchMedia(query);
    const setValue = () => set(mq.matches);
    if ('addEventListener' in mq) {
        mq.addEventListener('change', setValue);
    } else {
        mq.addListener(setValue);
    }
    setValue();
    return {
        [TYPE]: MEDIA,
        [CSS]: query,
        value: get
    };
});
