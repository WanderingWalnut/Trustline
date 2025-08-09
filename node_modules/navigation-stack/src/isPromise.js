export default function isPromise(anything) {
  // Weirdly, `typeof null` is "object".
  return (
    typeof anything === 'object' &&
    anything !== null &&
    typeof anything.then === 'function'
  );
}
