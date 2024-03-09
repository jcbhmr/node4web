import { AssertionError, innerOk } from "./utils.js";

export function ok<A>(value: A, message?: string | Error): asserts value {
  innerOk(ok, arguments.length, value, message);
}

export function equal() {}

export function strictEqual() {}

export function deepEqual() {}

export function deepStrictEqual() {}

ok.ok = ok;
ok.equal = equal;
ok.strictEqual = strictEqual;
ok.deepEqual = deepEqual;
ok.AssertionError = AssertionError;
const assert = ok;
export default assert;

export { AssertionError };
