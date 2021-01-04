import { val } from '../../src/fusion';

describe('val', () => {
    it('should get the internal value', () => {
        const foo = val();
        const bar = val(123);
        
        expect(foo.get()).to.equal(undefined);
        expect(bar.get()).to.equal(123);
    });

    it('should set the internal value', () => {
        const value = val('foo');
        
        expect(value.get()).to.equal('foo');

        value.set('bar');
        expect(value.get()).to.equal('bar');

        value.set('baz');
        expect(value.get()).to.equal('baz');
    });

    it('should update the internal value with a callback function', () => {
        const value = val(1);
        
        expect(value.get()).to.equal(1);

        value.update((val) => val + 10);
        expect(value.get()).to.equal(11);

        value.update((val) => val + 100);
        expect(value.get()).to.equal(111);
    });

    it('should call subscribers immediately and when the internal value changes', () => {
        const value = val(10);
        
        const spy = sinon.spy();
        value.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);
        expect(spy.args[0][1]).to.equal(undefined);

        value.set(20);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(20);
        expect(spy.args[1][1]).to.equal(10);

        value.update((val) => val + 100);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(120);
        expect(spy.args[2][1]).to.equal(20);
    });

    it('should support destructuring methods', () => {
        const value = val(10);
        const { get, set, update, subscribe } = value;

        expect(get()).to.equal(10);
        
        const spy = sinon.spy();
        subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);
        expect(spy.args[0][1]).to.equal(undefined);

        set(20);
        expect(get()).to.equal(20);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(20);
        expect(spy.args[1][1]).to.equal(10);

        update((val) => val + 100);
        expect(get()).to.equal(120);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(120);
        expect(spy.args[2][1]).to.equal(20);
    });
});
