import markup from './text-field.html';
import styles from './text-field.css';
import { nativeFormElements } from './native-form.js';

const HTMLElementBase = globalThis.HTMLElement ?? class {};

/** A form-associated single-line text field with a native internal input. */
export class TcTextField extends HTMLElementBase {
  static formAssociated = true;
  static observedAttributes = ['autocomplete', 'clear-label', 'clearable', 'disabled', 'helper', 'label', 'name', 'readonly', 'required', 'required-message', 'type', 'type-mismatch-message', 'value', 'variant'];

  constructor() {
    super();
    this.internals = this.attachInternals?.();
    if (!this.attachShadow) return;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `<style>${styles}</style>${markup}`;
    this.input = this.shadow.querySelector('input');
    this.labelNode = this.shadow.querySelector('[part=label]');
    this.helperNode = this.shadow.querySelector('[part=helper]');
    this.errorNode = this.shadow.querySelector('[part=error]');
    this.clearButton = this.shadow.querySelector('[part=clear]');
    this.input.id = 'input';
    this.labelNode.htmlFor = this.input.id;
    this.helperNode.id = 'helper';
    this.errorNode.id = 'error';
    this.input.addEventListener('focus', () => this.sync());
    this.input.addEventListener('blur', () => { this.touched = true; this.sync(); });
    this.addEventListener('invalid', () => { this.touched = true; this.sync(); });
    this.input.addEventListener('input', () => { this.inputDirty = true; this.value = this.input.value; });
    this.input.addEventListener('change', (event) => {
      event.stopPropagation();
      this.inputDirty = false;
      this.sync();
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    this.onInputKeydown = (event) => this.handleImplicitSubmit(event);
    this.input.addEventListener('keydown', this.onInputKeydown);
    this.onInputKeypress = (event) => {
      if (event.key === 'Enter' && event.isTrusted) event.preventDefault();
    };
    this.input.addEventListener('keypress', this.onInputKeypress);
    this.implicitSubmitTimers = new Set();
    this.implicitSubmitCleanups = new Set();
    this.clearButton.addEventListener('click', () => {
      if (this.disabled || this.readOnly || !this.value) return;
      this.input.value = '';
      this.input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      this.input.focus();
    });
    this.associatedLabels = [];
    this.onAssociatedLabelClick = (event) => {
      if (!event.composedPath().includes(this)) this.input?.focus();
    };
  }

  connectedCallback() {
    if (this.defaultValue === undefined) this.defaultValue = this.value;
    this.input?.addEventListener('keydown', this.onInputKeydown);
    this.input?.addEventListener('keypress', this.onInputKeypress);
    this.associatedLabels = [...(this.internals?.labels ?? [])];
    this.associatedLabels.forEach((label) => label.addEventListener('click', this.onAssociatedLabelClick));
    this.sync();
  }

  disconnectedCallback() {
    this.input?.removeEventListener('keydown', this.onInputKeydown);
    this.input?.removeEventListener('keypress', this.onInputKeypress);
    this.implicitSubmitTimers.forEach((timer) => clearTimeout(timer));
    this.implicitSubmitTimers.clear();
    this.implicitSubmitCleanups.forEach((cleanup) => cleanup());
    this.implicitSubmitCleanups.clear();
    this.associatedLabels.forEach((label) => label.removeEventListener('click', this.onAssociatedLabelClick));
    this.associatedLabels = [];
  }

  attributeChangedCallback() { this.sync(); }
  formDisabledCallback(disabled) { this.formDisabled = disabled === true; this.sync(); }
  formResetCallback() { this.touched = false; this.value = this.defaultValue; this.sync(); }

  get value() { return this.getAttribute('value') ?? ''; }
  set value(value) { this.setAttribute('value', value ?? ''); }
  get defaultValue() { return this._defaultValue; }
  set defaultValue(value) { this._defaultValue = String(value ?? ''); }
  get name() { return this.getAttribute('name') || ''; }
  set name(value) { this.setAttribute('name', value); }
  get label() { return this.getAttribute('label') || ''; }
  set label(value) { this.setAttribute('label', value); }
  get helper() { return this.getAttribute('helper') || ''; }
  set helper(value) { this.setAttribute('helper', value); }
  get autocomplete() { return this.getAttribute('autocomplete') || ''; }
  set autocomplete(value) { this.setAttribute('autocomplete', value); }
  get clearLabel() { return this.getAttribute('clear-label') || 'Clear'; }
  set clearLabel(value) { this.setAttribute('clear-label', value); }
  get requiredMessage() { return this.getAttribute('required-message') || ''; }
  set requiredMessage(value) { this.setAttribute('required-message', value); }
  get typeMismatchMessage() { return this.getAttribute('type-mismatch-message') || ''; }
  set typeMismatchMessage(value) { this.setAttribute('type-mismatch-message', value); }
  get type() { return this.getAttribute('type') === 'email' ? 'email' : 'text'; }
  set type(value) { this.setAttribute('type', value); }
  get variant() { return ['standard', 'filled', 'outlined'].includes(this.getAttribute('variant')) ? this.getAttribute('variant') : 'outlined'; }
  set variant(value) { this.setAttribute('variant', value); }
  get required() { return this.hasAttribute('required'); }
  set required(value) { this.toggleAttribute('required', Boolean(value)); }
  get readOnly() { return this.hasAttribute('readonly'); }
  set readOnly(value) { this.toggleAttribute('readonly', Boolean(value)); }
  get disabled() { return this.hasAttribute('disabled') || this.formDisabled === true; }
  set disabled(value) { this.toggleAttribute('disabled', Boolean(value)); }
  get clearable() { return this.hasAttribute('clearable'); }
  set clearable(value) { this.toggleAttribute('clearable', Boolean(value)); }
  validationControl() {
    const control = this.internals ?? this.input;
    if (!control?.validity || typeof control.checkValidity !== 'function' || typeof control.reportValidity !== 'function') {
      throw new Error('tc-text-field validation requires ElementInternals or its native input.');
    }
    return control;
  }
  get validity() { return this.validationControl().validity; }
  get validationMessage() { return this.validationControl().validationMessage; }
  get willValidate() { return this.validationControl().willValidate; }
  checkValidity() { return this.validationControl().checkValidity(); }
  reportValidity() { return this.validationControl().reportValidity(); }
  focus(options) { this.input?.focus(options); }

  handleImplicitSubmit(event) {
    if (event.composedPath()[0] !== this.input || event.key !== 'Enter' || event.defaultPrevented || event.isComposing || event.keyCode === 229
      || !event.isTrusted || this.disabled || this.readOnly) return;
    const form = this.internals?.form ?? this.closest('form');
    if (!form) return;
    let allowingRequestSubmit = false;
    const suppressNativeSubmit = (submitEvent) => {
      if (!allowingRequestSubmit) submitEvent.preventDefault();
    };
    form.addEventListener('submit', suppressNativeSubmit, true);
    let releaseSuppressor;
    const cleanupSuppressor = () => {
      form.removeEventListener('submit', suppressNativeSubmit, true);
      this.input?.removeEventListener('keyup', releaseSuppressor);
      this.implicitSubmitCleanups.delete(cleanupSuppressor);
    };
    releaseSuppressor = (releaseEvent) => {
      if (releaseEvent.key !== 'Enter') return;
      const timer = setTimeout(() => {
        this.implicitSubmitTimers.delete(timer);
        cleanupSuppressor();
      }, 50);
      this.implicitSubmitTimers.add(timer);
    };
    this.input.addEventListener('keyup', releaseSuppressor);
    this.implicitSubmitCleanups.add(cleanupSuppressor);
    const timer = setTimeout(() => {
      this.implicitSubmitTimers.delete(timer);
      if (event.defaultPrevented || !this.isConnected || (this.internals?.form ?? this.closest('form')) !== form) return;
      const elements = [...nativeFormElements(form)];
      const defaultSubmitter = elements.find((control) => {
        const tag = String(control?.tagName).toLowerCase();
        const type = String(control?.type).toLowerCase();
        return (tag === 'button' && (type === '' || type === 'submit'))
          || (tag === 'input' && (type === 'submit' || type === 'image'));
      });
      const blockingFields = elements.filter((control) => control === this
        || (String(control?.tagName).toLowerCase() === 'input'
          && ['text', 'search', 'url', 'tel', 'email', 'password', 'number', 'date', 'time', 'month', 'week', 'datetime-local'].includes(String(control.type).toLowerCase()))
        || String(control?.tagName).toLowerCase() === 'tc-text-field');
      if (defaultSubmitter?.matches?.(':disabled') || (!defaultSubmitter && blockingFields.length !== 1)) return;
      const FormConstructor = form.ownerDocument?.defaultView?.HTMLFormElement ?? globalThis.HTMLFormElement;
      const requestSubmit = FormConstructor?.prototype?.requestSubmit;
      if (typeof requestSubmit !== 'function') return;
      if (this.inputDirty) this.input.blur();
      event.preventDefault();
      allowingRequestSubmit = true;
      try {
        requestSubmit.call(form, defaultSubmitter);
      } finally {
        allowingRequestSubmit = false;
      }
    }, 0);
    this.implicitSubmitTimers.add(timer);
  }

  sync() {
    if (!this.input) return;
    const value = this.value;
    if (this.input.value !== value) this.input.value = value;
    this.input.type = this.type;
    this.input.name = this.name;
    this.input.autocomplete = this.autocomplete;
    this.input.required = this.required;
    this.input.readOnly = this.readOnly;
    this.input.disabled = this.disabled;
    this.labelNode.textContent = this.label;
    this.helperNode.textContent = this.helper;
    const label = this.label || this.associatedLabels.map((item) => item.textContent.trim()).filter(Boolean).join(' ');
    if (label) this.input.setAttribute('aria-label', label);
    else this.input.removeAttribute('aria-label');
    this.input.setAttribute('aria-describedby', `${this.helperNode.id} ${this.errorNode.id}`);

    const invalidConstraint = !this.disabled && !this.readOnly && !this.input.validity.valid;
    const invalid = this.touched && invalidConstraint;
    const customMessage = this.input.validity.valueMissing ? this.requiredMessage
      : this.input.validity.typeMismatch ? this.typeMismatchMessage : '';
    const validationMessage = invalidConstraint ? customMessage || this.input.validationMessage : '';
    this.errorNode.textContent = invalid ? validationMessage : '';
    this.errorNode.hidden = !invalid;
    if (invalid) this.input.setAttribute('aria-invalid', 'true');
    else this.input.removeAttribute('aria-invalid');
    this.toggleAttribute('data-focused', this.shadow.activeElement === this.input);
    this.toggleAttribute('data-active', Boolean(value) || this.shadow.activeElement === this.input);
    this.toggleAttribute('data-invalid', invalid);
    this.clearButton.hidden = !this.clearable || !value || this.disabled || this.readOnly;
    this.clearButton.setAttribute('aria-label', this.clearLabel);

    const flags = invalidConstraint ? this.input.validity.valueMissing ? { valueMissing: true } : { typeMismatch: true } : {};
    this.internals?.setFormValue(this.disabled ? null : value);
    this.internals?.setValidity(flags, Object.keys(flags).length ? validationMessage : '', Object.keys(flags).length ? this.input : undefined);
  }
}
