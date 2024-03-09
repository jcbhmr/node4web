import * as nodeAssert from "node:assert";
import * as myAssert from "../src/assert/index.js";
const a: typeof nodeAssert = myAssert;
console.log(nodeAssert, myAssert);
