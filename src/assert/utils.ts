export function innerOk<A>(
  stackStartFn: Function,
  argsLength: number,
  value: A,
  message?: string | Error,
): asserts value {
  if (value) return;

  let generatedMessage = false;
  if (argsLength < 1) {
    generatedMessage = true;
    message = "No value argument passed to `assert.ok()`";
  } else if (
    message instanceof Error ||
    Object.prototype.toString.call(message) === "[object Error]"
  ) {
    throw message;
  }

  throw Object.assign(
    new AssertionError({
      actual: value,
      expected: true as const,
      message,
      operator: "==",
      stackStartFn,
    }),
    { generatedMessage },
  );
}

export function generateMessage<A, E>(
  actual: A,
  expected: E,
  operator: string = "",
) {
  return `${actual} ${operator} ${expected}`;
}

export class AssertionError extends Error {
  code: "ERR_ASSERTION";
  actual: unknown | undefined;
  expected: unknown | undefined;
  operator: string | undefined;
  constructor(options: {
    message?: string | undefined;
    operator?: string | undefined;
    stackStartFn?: Function | undefined;
    actual?: unknown | undefined;
    expected?: unknown | undefined;
  }) {
    const message =
      options.message ??
      generateMessage(options.actual, options.expected, options.operator);
    const stackStartFn = options.stackStartFn;

    super(message);
    this.code = "ERR_ASSERTION";
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
    Object.defineProperty(this, "name", {
      value: "AssertionError [ERR_ASSERTION]",
      writable: true,
      configurable: true,
    });
    Error.captureStackTrace?.(this, stackStartFn);
    void this.stack;
    this.name = "AssertionError";
  }

  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }

  [Symbol.for("nodejs.util.inspect.custom")](
    depth: number,
    opts: any,
    inspect: (...a: any[]) => any,
  ) {
    return inspect(this, { ...opts, customInspect: false, depth: 0 });
  }
}
