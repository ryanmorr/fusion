import { Store } from '@ryanmorr/isotope';

export class MediaStore extends Store {
    constructor(query) {
        super();
        this.mq = matchMedia(query);
        this.mq.addEventListener('change', this.set.bind(this));
        this.query = query;
        this.set();
    }

    set() {
        super.set(this.mq.matches);
    }
}

export function media(query) {
    return new MediaStore(query);
}
