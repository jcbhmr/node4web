export default function assert() {

}

export interface AssertionErrorOptions<A, E> {
    message?: string;
    operator?: string;
    stackStartFn?: Function
    actual?: A,
    expected?: E,
}

export class AssertionError<A, E> extends Error {
    constructor(options: AssertionErrorOptions<A, E>) {
        const message = options.message ?? generateMessage(options.actual, options.operator, options.expected)
        super(message)
    }
}