import * as nodeUtil from "node:util";
import * as myUtil from "../src/util/index.js";
const a: typeof nodeUtil = myUtil;
console.log(nodeUtil, myUtil);
