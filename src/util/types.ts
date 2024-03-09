export default function isNativeError(object: unknown): object is Error {
  return (
    object instanceof Error ||
    Object.prototype.toString.call(object) === "[object Error]"
  );
}
