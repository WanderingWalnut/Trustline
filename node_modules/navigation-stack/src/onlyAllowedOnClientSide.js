export default function onlyAllowedOnClientSide() {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on client side');
  }
}
