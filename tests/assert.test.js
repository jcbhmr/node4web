import test from "node:test";
import assert from "node:assert/strict";
import * as nodeAssert from "node:assert";
import * as myAssert from "../dist/assert/index.js";

test("assert.deepEqual(1, 2) error message is the same", () => {
  /** @type {nodeAssert.AssertionError} */
  let nodeError;
  try {
    nodeAssert.deepEqual(1, 2);
  } catch (error) {
    nodeError = error;
  }
  assert(nodeError);

  /** @type {myAssert.AssertionError} */
  let myError;
  try {
    myAssert.deepEqual(1, 2);
  } catch (error) {
    myError = error;
  }
  assert(myError);

  assert.deepEqual(nodeError.toString(), myError.toString());
});
