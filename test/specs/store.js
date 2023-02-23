import { store } from '../../src/fusion';

describe('store', () => {
    it('should get the internal value', () => {
        const foo = store();
        const bar = store(123);
        
        expect(foo.value()).to.equal(undefined);
        expect(bar.value()).to.equal(123);
    });

    it('should set the internal value and return the new value', () => {
        const value = store('foo');
        
        expect(value.value()).to.equal('foo');

        expect(value.set('bar')).to.equal('bar');
        expect(value.value()).to.equal('bar');

        expect(value.set('baz')).to.equal('baz');
        expect(value.value()).to.equal('baz');
    });

    it('should update the internal value with a callback function and return the new value', () => {
        const value = store(1);
        
        expect(value.value()).to.equal(1);

        expect(value.update((val) => val + 10)).to.equal(11);
        expect(value.value()).to.equal(11);

        expect(value.update((val) => val + 100)).to.equal(111);
        expect(value.value()).to.equal(111);
    });

    it('should call a subscriber immediately when added', () => {
        const value = store();
        
        const spy = sinon.spy();
        value.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(undefined);
        expect(spy.args[0][1]).to.equal(undefined);
    });

    it('should call subscribers when the internal value changes', () => {
        const value = store(10);
        
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
        const foo = store(10);
        const { value, set, update, subscribe } = foo;

        expect(value()).to.equal(10);
        
        const spy = sinon.spy();
        subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(10);
        expect(spy.args[0][1]).to.equal(undefined);

        expect(set(20)).to.equal(20);
        expect(value()).to.equal(20);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(20);
        expect(spy.args[1][1]).to.equal(10);

        expect(update((val) => val + 100)).to.equal(120);
        expect(value()).to.equal(120);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(120);
        expect(spy.args[2][1]).to.equal(20);
    });

    it('should support implicit type conversions', async () => {
        const foo = store(10);
        
        expect(foo.toString()).to.equal('10');
        expect(foo.valueOf()).to.equal(10);
        expect(foo.toJSON()).to.equal(10);
        expect(await foo).to.equal(10);
    });
});
