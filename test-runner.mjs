import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { describe as nodeDescribe, it as nodeIt, beforeEach as nodeBeforeEach, afterEach as nodeAfterEach } from 'node:test';
import assert from 'node:assert/strict';
import { TestBed } from '@angular/core/testing';
import { ɵEffectScheduler as EffectScheduler, ɵChangeDetectionScheduler as ChangeDetectionScheduler } from '@angular/core';

try {
  TestBed.initTestEnvironment([], {
    teardown: { destroyAfterEach: false },
    providers: [
      { provide: EffectScheduler, useValue: { add: () => {}, schedule: () => {} } },
      { provide: ChangeDetectionScheduler, useValue: { notify: () => {} } }
    ]
  });
} catch {
  // Already initialized
}

globalThis.describe = nodeDescribe;
globalThis.it = nodeIt;
globalThis.beforeEach = nodeBeforeEach;
globalThis.afterEach = nodeAfterEach;

globalThis.expect = function (actual) {
  const matchers = {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined, 'Expected value to be defined');
    },
    toBeUndefined() {
      assert.strictEqual(actual, undefined, 'Expected value to be undefined');
    },
    toBeInstanceOf(expectedClass) {
      assert.ok(actual instanceof expectedClass, `Expected instance of ${expectedClass.name}`);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toBeFalsy() {
      assert.ok(!actual);
    },
    toBeNull() {
      assert.strictEqual(actual, null);
    },
    toBeFalse() {
      assert.strictEqual(actual, false);
    },
    toBeTrue() {
      assert.strictEqual(actual, true);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toContain(expected) {
      if (typeof actual === 'string') {
        assert.ok(actual.includes(expected), `Expected string "${actual}" to contain "${expected}"`);
      } else if (Array.isArray(actual)) {
        assert.ok(actual.includes(expected), `Expected array to contain item`);
      }
    },
    toBeGreaterThan(expected) {
      assert.ok(actual > expected, `Expected ${actual} to be greater than ${expected}`);
    },
    toHaveBeenCalled() {
      assert.ok(actual && actual._called === true, 'Expected function to have been called');
    },
    toHaveBeenCalledWith(...expectedArgs) {
      assert.ok(actual && actual._called === true, 'Expected function to have been called');
      const lastCall = actual._calls[actual._calls.length - 1];
      assert.deepStrictEqual(lastCall, expectedArgs);
    }
  };

  const notMatchers = {
    toBe(expected) {
      assert.notStrictEqual(actual, expected);
    },
    toBeTruthy() {
      assert.ok(!actual);
    },
    toBeFalsy() {
      assert.ok(actual);
    },
    toBeNull() {
      assert.notStrictEqual(actual, null);
    },
    toEqual(expected) {
      assert.notDeepStrictEqual(actual, expected);
    },
    toHaveBeenCalled() {
      assert.strictEqual(actual && actual._called, false, 'Expected function not to have been called');
    },
    toHaveBeenCalledWith(...expectedArgs) {
      assert.strictEqual(actual && actual._called, false, 'Expected function not to have been called');
    }
  };

  return {
    ...matchers,
    not: notMatchers
  };
};

// --- Minimal fake timer support (jest.useFakeTimers / advanceTimersByTime) ---
const _realSetTimeout = globalThis.setTimeout;
const _realClearTimeout = globalThis.clearTimeout;
let _fakeTimersActive = false;
let _fakeNow = 0;
let _fakeTimerQueue = [];
let _fakeTimerIdSeq = 1;

function _fakeSetTimeout(callback, delay = 0, ...args) {
  const id = _fakeTimerIdSeq++;
  _fakeTimerQueue.push({ id, time: _fakeNow + Math.max(0, Number(delay) || 0), callback, args });
  return id;
}

function _fakeClearTimeout(id) {
  _fakeTimerQueue = _fakeTimerQueue.filter((timer) => timer.id !== id);
}

globalThis.jest = {
  fn(initialImpl) {
    let currentImpl = initialImpl;
    const fn = function (...args) {
      fn._called = true;
      fn._calls.push(args);
      if (currentImpl) return currentImpl.call(this, ...args);
    };
    fn._called = false;
    fn._calls = [];
    fn.mockReturnValue = function (val) {
      currentImpl = () => val;
      return fn;
    };
    fn.mockImplementation = function (newImpl) {
      currentImpl = newImpl;
      return fn;
    };
    return fn;
  },
  spyOn(obj, prop) {
    const orig = obj[prop];
    const spy = globalThis.jest.fn(orig);
    obj[prop] = spy;
    return spy;
  },
  useFakeTimers() {
    if (_fakeTimersActive) return;
    _fakeTimersActive = true;
    _fakeNow = 0;
    _fakeTimerQueue = [];
    globalThis.setTimeout = _fakeSetTimeout;
    globalThis.clearTimeout = _fakeClearTimeout;
  },
  useRealTimers() {
    if (!_fakeTimersActive) return;
    _fakeTimersActive = false;
    _fakeTimerQueue = [];
    globalThis.setTimeout = _realSetTimeout;
    globalThis.clearTimeout = _realClearTimeout;
  },
  advanceTimersByTime(msToAdvance) {
    if (!_fakeTimersActive) return;
    const target = _fakeNow + Math.max(0, Number(msToAdvance) || 0);
    for (;;) {
      _fakeTimerQueue.sort((a, b) => a.time - b.time);
      const next = _fakeTimerQueue[0];
      if (!next || next.time > target) break;
      _fakeTimerQueue.shift();
      _fakeNow = next.time;
      next.callback(...next.args);
    }
    _fakeNow = target;
  },
  clearAllTimers() {
    _fakeTimerQueue = [];
  }
};
