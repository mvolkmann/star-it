/*global describe: false, expect: false, it: false */
require('babel/polyfill');

const starIt = require('./star-it');

const arr = [1, 3, 5, 6, 7, 3, 1];

const add = (x, y) => x + y;
const isEven = x => x % 2 === 0;
const isOdd = x => x % 2 === 1;

class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
    this.depthFirst = true;
  }

  addChildren(...children) {
    this.children.push(...children);
  }

  // Traverses all descendants of this TreeNode.
  // Deep-first if this.depthFirst = true (the default);
  // breadth-first otherwise.
  *[Symbol.iterator]() {
    for (const child of this.children) {
      yield child;
      if (this.depthFirst) yield* child;
    }

    if (!this.depthFirst) {
      for (const child of this.children) {
        yield* child;
      }
    }
  }
}

describe('star-it', () => {

  it('supports every', () => {
    expect(starIt.every(arr, isOdd)).toBeFalsy();
  });

  it('supports some', () => {
    expect(starIt.some(arr, isOdd)).toBeTruthy();
  });

  it('supports filter', () => {
    let iterable = starIt.filter(arr, isOdd);
    let result = [...iterable];
    expect(result).toEqual([1, 3, 5, 7, 3, 1]);

    iterable = starIt.filter(arr, isEven);
    result = [...iterable];
    expect(result).toEqual([6]);
  });

  it('supports find', () => {
    expect(starIt.find(arr, isEven)).toBe(6);
  });

  it('supports findIndex', () => {
    expect(starIt.findIndex(arr, isEven)).toBe(3);
  });

  it('supports forEach', () => {
    const visited = [];
    starIt.forEach(arr, v => visited.push(v));
    expect(visited).toEqual(arr);
  });

  it('supports includes', () => {
    expect(starIt.includes(arr, 5)).toBeTruthy();
    expect(starIt.includes(arr, 4)).toBeFalsy();
  });

  it('supports indexOf', () => {
    expect(starIt.indexOf(arr, 3)).toBe(1);
    expect(starIt.indexOf(arr, 4)).toBe(-1);
  });

  it('supports lastIndexOf', () => {
    expect(starIt.lastIndexOf(arr, 3)).toBe(5);
    expect(starIt.lastIndexOf(arr, 4)).toBe(-1);
  });

  it('supports reduce', () => {
    expect(starIt.reduce(arr, add)).toBe(26);
    expect(starIt.reduce([19], add)).toBe(19);
    expect(starIt.reduce([], add, 0)).toBe(0);
  });

  it('supports map', () => {
    let iterable = starIt.map(arr, isOdd);
    let result = [...iterable];
    expect(result).toEqual(
      [true, true, true, false, true, true, true]);

    iterable = starIt.map([], isOdd);
    result = [...iterable];
    expect(result).toEqual([]);
  });

  it('handles tree', () => {
    const a = new TreeNode('a');
    const b = new TreeNode('b');
    const c = new TreeNode('c');
    a.addChildren(b, c);

    const d = new TreeNode('d');
    const e = new TreeNode('e');
    b.addChildren(d, e);

    const f = new TreeNode('f');
    c.addChildren(f);

    let iterable = starIt.map(a, node => node.value);
    let result = [...iterable];
    expect(result).toEqual(['b', 'd', 'e', 'c', 'f']);

    a.depthFirst = false;
    iterable = starIt.map(a, node => node.value);
    result = [...iterable];
    expect(result).toEqual(['b', 'c', 'd', 'e', 'f']);
  });
});
