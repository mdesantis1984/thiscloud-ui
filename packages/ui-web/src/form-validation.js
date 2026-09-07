import { nativeFormElements } from './native-form.js';

const owners = new WeakMap();

function validationControls(form) {
  return [...nativeFormElements(form)].filter((control) => typeof control?.addEventListener === 'function'
    && typeof control?.removeEventListener === 'function');
}

function formDataFor(form, submitter) {
  const FormDataConstructor = form.ownerDocument?.defaultView?.FormData ?? globalThis.FormData;
  return submitter ? new FormDataConstructor(form, submitter) : new FormDataConstructor(form);
}

function nativeFormMethod(form, name) {
  const FormConstructor = form.ownerDocument?.defaultView?.HTMLFormElement ?? globalThis.HTMLFormElement;
  const method = FormConstructor?.prototype?.[name];
  if (typeof method !== 'function') throw new TypeError(`Native form.${name}() is unavailable.`);
  return method.call(form);
}

function isNativeForm(form) {
  return form?.nodeType === 1 && String(form.tagName).toLowerCase() === 'form'
    && typeof Object.getOwnPropertyDescriptor((form.ownerDocument?.defaultView?.HTMLFormElement ?? globalThis.HTMLFormElement)?.prototype, 'elements')?.get === 'function';
}

/** Attach native constraint-validation coordination to one native form. */
export function attachFormValidation(form, options = {}) {
  if (!isNativeForm(form)) throw new TypeError('attachFormValidation requires an HTMLFormElement.');
  const existing = owners.get(form);
  if (existing) return existing;

  let disposed = false;
  const resetTimers = new Set();
  const computeValidation = ({ submitter = null, focus = true } = {}) => {
    if (submitter?.formNoValidate) {
      return { status: 'skipped', reason: 'formnovalidate', form, submitter };
    }

    const controls = validationControls(form);
    const invalidControls = new Set();
    const captureInvalid = (event) => invalidControls.add(event.currentTarget);
    controls.forEach((control) => control.addEventListener('invalid', captureInvalid));
    let valid;
    try {
      valid = nativeFormMethod(form, focus ? 'reportValidity' : 'checkValidity');
    } finally {
      controls.forEach((control) => control.removeEventListener('invalid', captureInvalid));
    }
    if (!valid) {
      controls.filter((control) => control.willValidate && control.validity && !control.validity.valid).forEach((control) => invalidControls.add(control));
      if (invalidControls.size === 0) throw new Error('Native form validation reported invalid without an invalid form control.');
      return { status: 'invalid', form, submitter, invalidControls: [...invalidControls] };
    }

    return { status: 'valid', form, submitter, formData: formDataFor(form, submitter) };
  };
  const notify = (result) => {
    if (result.status === 'invalid') options.onInvalid?.(result);
    else if (result.status === 'valid') options.onValid?.(result);
    else options.onSkipped?.(result);
  };
  const validate = (request = {}) => {
    if (disposed) throw new Error('Cannot validate with a disposed form-validation handle.');
    const result = computeValidation(request);
    notify(result);
    return result;
  };
  const onSubmit = (event) => {
    if (event.defaultPrevented || disposed) return;
    // Cancellation is a submission policy, not a callback side effect. It must happen
    // before a consumer callback can throw and leave the browser free to navigate.
    if (options.preventDefault) event.preventDefault();
    const result = computeValidation({ submitter: event.submitter, focus: true });
    if (result.status === 'invalid') event.preventDefault();
    notify(result);
  };
  const onReset = (event) => {
    if (disposed || event.defaultPrevented) return;
    const timer = setTimeout(() => {
      resetTimers.delete(timer);
      if (!disposed && !event.defaultPrevented) options.onReset?.({ form });
    }, 0);
    resetTimers.add(timer);
  };
  const handle = {
    validate,
    dispose() {
      if (disposed) return;
      disposed = true;
      resetTimers.forEach((timer) => clearTimeout(timer));
      resetTimers.clear();
      form.removeEventListener('submit', onSubmit);
      form.removeEventListener('reset', onReset);
      if (owners.get(form) === handle) owners.delete(form);
    },
  };

  form.addEventListener('submit', onSubmit);
  form.addEventListener('reset', onReset);
  owners.set(form, handle);
  return handle;
}
