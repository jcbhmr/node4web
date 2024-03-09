import { ok, equal } from "./index.js";
import { innerOk } from "./utils";

export function strict<A>(value: A, message?: string | Error): asserts value {
    innerOk(strict, arguments.length, value, message);
}
strict.strict = strict;
strict.ok = ok;
strict.equal = strictEqual;
strict.deepEqual = deepStrictEqual;
strict.notEqual = notStrictEqual;
strict.notDeepEqual = notDeepStrictEqual;
export default strict;
