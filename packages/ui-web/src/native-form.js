function formConstructor(form) {
  return form.ownerDocument?.defaultView?.HTMLFormElement ?? globalThis.HTMLFormElement;
}

/** Read native form controls without allowing named controls to shadow `form.elements`. */
export function nativeFormElements(form) {
  const getter = Object.getOwnPropertyDescriptor(formConstructor(form)?.prototype, 'elements')?.get;
  if (typeof getter !== 'function') throw new TypeError('Native form.elements is unavailable.');
  return getter.call(form);
}
