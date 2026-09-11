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
  }
};
