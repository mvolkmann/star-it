require('babel/polyfill');

function assertIsFunction(value) {
  if (typeof value !== 'function') {
    throw new Error('expected a function, but got', value);
  }
}

function assertIsIterator(value) {
  const nextFn = value.next;
  if (!nextFn || typeof nextFn !== 'function') {
    throw new Error('expected an iterator, but got', value);
  }
}

function assertIsIterable(value) {
  const iteratorFn = value[Symbol.iterator];
  if (!iteratorFn || typeof iteratorFn !== 'function') {
    throw new Error('expected an iterable, but got', value);
  }

  // Obtain an iterator from the iterable.
  const iterator = iteratorFn.call(value);
  assertIsIterator(iterator);
}

function every(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (const element of obj) {
    if (!predicate(element)) return false;
  }
  return true;
}

function* filter(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (const element of obj) {
    if (predicate(element)) yield element;
  }
}

function find(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (const element of obj) {
    if (predicate(element)) return element;
  }
  return undefined;
}

function findIndex(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  let index = 0;
  for (const element of obj) {
    if (predicate(element)) return index;
    index++;
  }
  return -1;
}

function forEach(obj, fn) {
  assertIsIterable(obj);
  assertIsFunction(fn);
  for (const element of obj) {
    fn(element);
  }
}

function includes(obj, value) {
  assertIsIterable(obj);
  for (const element of obj) {
    if (element === value) return true;
  }
  return false;
}

function indexOf(obj, value) {
  assertIsIterable(obj);
  let index = 0;
  for (const element of obj) {
    if (element === value) return index;
    index++;
  }
  return -1;
}

function lastIndexOf(obj, value) {
  assertIsIterable(obj);
  let index = 0, lastIndex = -1;
  for (const element of obj) {
    if (element === value) lastIndex = index;
    index++;
  }
  return lastIndex;
}

function* map(obj, fn) {
  assertIsIterable(obj);
  assertIsFunction(fn);
  for (const element of obj) {
    yield fn(element);
  }
}

function reduce(obj, fn, initial) {
  assertIsIterable(obj);
  assertIsFunction(fn);
  const it = obj[Symbol.iterator]();

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

// Skips the first n values of an iterable and yields the rest.
function* skip(obj, n) {
  assertIsIterable(obj);
  const iterator = obj[Symbol.iterator]();
  let result;

  // Skip the first n values.
  for (let i = 0; i <= n; i++) {
    result = iterator.next();
    if (result.done) return;
  }

  // Yield the rest of the values.
  while (!result.done) {
    yield result.value;
    result = iterator.next();
  }
}

function some(obj, predicate) {
  assertIsIterable(obj);
  assertIsFunction(predicate);
  for (const element of obj) {
    if (predicate(element)) return true;
  }
  return false;
}

// Yields only the first n values of an iterable.
function* take(obj, n) {
  assertIsIterable(obj);
  const iterator = obj[Symbol.iterator]();
  while (n > 0) {
    yield iterator.next().value;
    n--;
  }
}

module.exports = {
  every, filter, find, findIndex, forEach, includes,
  indexOf, lastIndexOf, map, reduce, skip, some, take
};
