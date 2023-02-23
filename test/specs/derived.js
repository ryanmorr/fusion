import { store, derived } from '../../src/fusion';

describe('derived', () => {
    it('should get the internal value derived from a val dependency', () => {
        const foo = store('foo');
        const computed = derived(foo, (val) => val + 'bar');

        expect(computed.value()).to.equal('foobar');
    });

    it('should get the internal value derived from multiple val dependencies', () => {
        const foo = store('foo');
        const bar = store('bar');
        const baz = store('baz');
        const computed = derived(foo, bar, baz, (foo, bar, baz) => foo + bar + baz);

        expect(computed.value()).to.equal('foobarbaz');
    });

    it('should not be able to explicitly set the internal value', () => {
        const foo = store('foo');
        const bar = store('bar');
        const computed = derived(foo, bar, (foo, bar) => foo + bar);

        expect(computed.set).to.equal(undefined);
        expect(computed.update).to.equal(undefined);
    });

    it('should automatically update the internal value if a dependency changes', () => {
        const firstName = store('John');
        const lastName = store('Doe');
        const fullName = derived(firstName, lastName, (firstName, lastName) => `${firstName} ${lastName}`);

        expect(fullName.value()).to.equal('John Doe');

        firstName.set('Jane');
        expect(fullName.value()).to.equal('Jane Doe');

        lastName.set('Jones');
        expect(fullName.value()).to.equal('Jane Jones');
    });

    it('should call subscribers immediately and when the internal value changes', () => {
        const foo = store(10);
        const bar = store(20);
        const computed = derived(foo, bar, (foo, bar) => foo + bar);
        
        const spy = sinon.spy();
        computed.subscribe(spy);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(30);
        expect(spy.args[0][1]).to.equal(undefined);

        foo.set(100);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(120);
        expect(spy.args[1][1]).to.equal(30);

        bar.update((val) => val + 100);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(220);
        expect(spy.args[2][1]).to.equal(120);
    });

    it('should support derived dependencies', () => {
        const foo = store('a');
        const bar = store('b');
        const baz = store('c');

        const fooBar = derived(foo, bar, (a, b) => a + b);
        const value = derived(fooBar, baz, (a, b) => a + b);

        const fooBarSpy = sinon.spy();
        const valueSpy = sinon.spy();

        fooBar.subscribe(fooBarSpy);
        value.subscribe(valueSpy);

        expect(fooBarSpy.callCount).to.equal(1);
        expect(valueSpy.callCount).to.equal(1);
        expect(value.value()).to.equal('abc');

        foo.set('x');
        expect(value.value()).to.equal('xbc');
        expect(fooBarSpy.callCount).to.equal(2);
        expect(valueSpy.callCount).to.equal(2);

        bar.set('y');
        expect(value.value()).to.equal('xyc');
        expect(fooBarSpy.callCount).to.equal(3);
        expect(valueSpy.callCount).to.equal(3);

        baz.set('z');
        expect(value.value()).to.equal('xyz');
        expect(fooBarSpy.callCount).to.equal(3);
        expect(valueSpy.callCount).to.equal(4);
    });

    it('should support async derived stores', async () => {
        const foo = store(5);
        const bar = store(10);
        const computed = derived(foo, bar, (a, b, set) => {
            setTimeout(() => set(a + b), 10);
        });
    
        expect(computed.value()).to.equal(undefined);
    
        const spy = sinon.spy();
        computed.subscribe(spy);
    
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(undefined);
        expect(spy.args[0][1]).to.equal(undefined);
    
        await new Promise((resolve) => setTimeout(resolve, 20));

        expect(computed.value()).to.equal(15);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(15);
        expect(spy.args[1][1]).to.equal(undefined);
        
        foo.set(100);
        expect(computed.value()).to.equal(15);

        await new Promise((resolve) => setTimeout(resolve, 20));

        expect(computed.value()).to.equal(110);
        expect(spy.callCount).to.equal(3);
        expect(spy.args[2][0]).to.equal(110);
        expect(spy.args[2][1]).to.equal(15);  
    });

    it('should support multiple calls to set in async derived stores', async () => {
        const foo = store(50);
        const bar = store(20);
        const computed = derived(foo, bar, (a, b, set) => {
            set(0);
            setTimeout(() => set(a + b), 10);
        });
    
        expect(computed.value()).to.equal(0);
    
        const spy = sinon.spy();
        computed.subscribe(spy);
    
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(0);
        expect(spy.args[0][1]).to.equal(undefined);
    
        await new Promise((resolve) => setTimeout(resolve, 20));

        expect(computed.value()).to.equal(70);
        expect(spy.callCount).to.equal(2);
        expect(spy.args[1][0]).to.equal(70);
        expect(spy.args[1][1]).to.equal(0);
    });
});
