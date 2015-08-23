require('babel/polyfill');

function assertIsFunction(value) {
  if (typeof value !== 'function') {
    throw new Error('expected a function, but got', value);
  }
}

function assertIsIterable(value) {
  const iteratorFn = value[Symbol.iterator];
  if (!iteratorFn || typeof iteratorFn !== 'function') {
    throw new Error('expected an iterable, but got', value);
  }
}

function assertIsIterator(value) {
  const nextFn = value.next;
  if (!nextFn || typeof nextFn !== 'function') {
    throw new Error('expected an iterator, but got', value);
  }
}

/*
function getFunction(obj, fnName) {
  const fn = obj[fnName];
  return typeof fn === 'function' ? fn : undefined;
}
*/

function every(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (let element of obj) {
    if (!predicate(element)) return false;
  }
  return true;
}

function* filter(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (let element of obj) {
    if (predicate(element)) yield element;
  }
}

function findIndex(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  let index = 0;
  for (let element of obj) {
    if (predicate(element)) return index;
    index++;
  }
  return -1;
}

function find(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (let element of obj) {
    if (predicate(element)) return element;
  }
  return undefined;
}

function forEach(obj, fn) {
  assertIsIterable(obj);
  assertIsFunction(fn);
  for (let element of obj) {
    fn(element);
  }
}

function includes(obj, value) {
  assertIsIterable(obj);
  for (let element of obj) {
    if (element === value) return true;
  }
  return false;
}

function indexOf(obj, value) {
  assertIsIterable(obj);
  let index = 0;
  for (let element of obj) {
    if (element === value) return index;
    index++;
  }
  return -1;
}

function lastIndexOf(obj, value) {
  assertIsIterable(obj);
  let index = 0, lastIndex = -1;
  for (let element of obj) {
    if (element === value) lastIndex = index;
    index++;
  }
  return lastIndex;
}

function* map(obj, fn) {
  assertIsIterable(obj);
  assertIsFunction(fn);
  for (let element of obj) {
    yield fn(element);
  }
}

function reduce(obj, fn, initial) {
  assertIsIterable(obj);
  assertIsFunction(fn);
  let it = obj[Symbol.iterator]();

  let done = false, value;
  if (initial === undefined) {
    ({value, done} = it.next());
  } else {
    value = initial;
  }

  let result = value;
  while (!done) {
    ({value, done} = it.next());
    if (!done) result = fn(result, value);
  }

  return result;
}

function some(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (let element of obj) {
    if (predicate(element)) return true;
  }
  return false;
}

module.exports = {
  every, filter, findIndex, find, forEach, includes,
  indexOf, lastIndexOf, map, reduce, some
};
