import { observable, observe } from "../reactive";

async function wait (time = 1000 / 60) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

describe("reactive test", () => {

  it("observable로 만든 객체가 observe 내에서 사용될 경우", async () => {
    const state = observable({ a: 1, b: 2 });
    console.log = jest.fn();

    let computed = '';
    function compute() {
       computed = `a + b = ${state.get('a') + state.get('b')}`;
    }

    observe(compute);

    expect(computed).toBe(`a + b = 3`);

    state.set('a', 10);
    await wait();

    expect(computed).toBe(`a + b = 12`);
    state.set('b', 20);

    console.log('3:',computed)
    await wait();
    expect(computed).toBe(`a + b = 30`);
  });

  it("똑같은 값을 할당할 경우, 실행하지 않음", async () => {
    let computed = '';
    const state = observable({ a: 1, b: 2 });

    let callCount = 0;
    function compute() {
      computed = `a + b = ${state.get('a') + state.get('b')}`;
      callCount += 1;
    }

    observe(compute);

    expect(computed).toBe(`a + b = 3`);
    expect(callCount).toBe(1);

    state.set('a', 10);
    await wait();

    expect(computed).toBe(`a + b = 12`);
    expect(callCount).toBe(2);

    state.set('b', 20);
    await wait();

    expect(computed).toBe(`a + b = 30`);
    expect(callCount).toBe(3);

    state.set('a', 10);
    await wait();

    expect(computed).toBe(`a + b = 30`);
    expect(callCount).toBe(3);
  });

  it("똑같은 값을 할당할 경우, 실행하지 않음 - 얕은비교(배열)", async () => {
    const state = observable({ a: 1, b: 2, c: [3, 4] });

    let computed = '';
    let callCount = 0;
    function compute() {
      const [ c, d ] = state.get('c');
      computed = `a + b + c + d = ${state.get('a') + state.get('b') + c + d}`;
      callCount += 1;
    }

    observe(compute);

    expect(computed).toBe(`a + b + c + d = 10`);
    expect(callCount).toBe(1);

    state.set('c', [3, 4]);

    expect(computed).toBe(`a + b + c + d = 10`);
    expect(callCount).toBe(1);
  });

  it("똑같은 값을 할당할 경우, 실행하지 않음 - 얕은비교(객체)", async () => {
    const state = observable({ a: 1, b: 2, child: { c: 3, d: 4 } });

    let computed = '';
    let callCount = 0;
    function compute() {
      const { c, d } = state.get('child');
      computed = `a + b + c + d = ${state.get('a') + state.get('b') + c + d}`;
      callCount += 1;
    }

    observe(compute);

    expect(computed).toBe(`a + b + c + d = 10`);
    expect(callCount).toBe(1);

    state.set('child', { c: 3, d: 4 });

    expect(computed).toBe(`a + b + c + d = 10`);
    expect(callCount).toBe(1);
  });

  it("마지막으로 할당한 값에 대해서만 observe를 실행함", async () => {
    const state = observable({ a: 1, b: 2 });

    let computed = '';
    let callCount = 0;
    function compute() {
      computed = `a + b = ${state.get('a') + state.get('b')}`;
      callCount += 1;
    }

    observe(compute);

    expect(computed).toBe(`a + b = 3`);
    expect(callCount).toBe(1);

    state.set('a', 2);
    state.set('a', 3);
    state.set('a', 4);
    state.set('a', 5);
    state.set('a', 6);
    state.set('a', 7);
    state.set('a', 8);
    state.set('a', 9);
    state.set('a', 10);


    await wait();

    expect(computed).toBe(`a + b = 12`);
    expect(callCount).toBe(2);
  });
})
