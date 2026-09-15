import markup from './checkbox.html';
import styles from './checkbox.css';

const HTMLElementBase = globalThis.HTMLElement ?? class {};

/** A form-associated checkbox backed by one native checkbox semantic. */
export class TcCheckbox extends HTMLElementBase {
  static formAssociated = true;
  static observedAttributes = ['checked', 'disabled', 'label', 'name', 'required', 'required-message', 'value'];

  constructor() {
    super();
    if (!this.attachInternals) throw new Error('tc-checkbox requires ElementInternals support.');
    this.internals = this.attachInternals();
    this._checked = false;
    this._dirtyChecked = false;
    this._indeterminate = false;
    this._formDisabled = false;
    this._initialized = false;
    this._touched = false;
    const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
    shadow.innerHTML = `<style>${styles}</style>${markup}`;
    this.input = shadow.querySelector('input');
    this.labelNode = shadow.querySelector('[part="label"]');
    this.errorNode = shadow.querySelector('[part="error"]');
    this.input.addEventListener('input', (event) => this.commitInput(event));
    this.input.addEventListener('change', (event) => this.commitChange(event));
    this.addEventListener('click', (event) => this.activateHost(event));
  }

  connectedCallback() {
    if (!this._initialized) {
      this._checked = this.hasAttribute('checked');
      this._initialized = true;
    }
    this.sync();
  }

  attributeChangedCallback(name) {
    if (name === 'checked' && !this._dirtyChecked) this._checked = this.hasAttribute('checked');
    this.sync();
  }

  get checked() { return this._checked; }
  set checked(value) {
    this._checked = Boolean(value);
    this._dirtyChecked = true;
    this.sync();
  }
  get defaultChecked() { return this.hasAttribute('checked'); }
  set defaultChecked(value) { this.toggleAttribute('checked', Boolean(value)); }
  get indeterminate() { return this._indeterminate; }
  set indeterminate(value) { this._indeterminate = Boolean(value); this.sync(); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', Boolean(value)); }
  get required() { return this.hasAttribute('required'); }
  set required(value) { this.toggleAttribute('required', Boolean(value)); }
  get requiredMessage() { return this.getAttribute('required-message') || ''; }
  set requiredMessage(value) { this.setStringAttribute('required-message', value); }
  get label() { return this.getAttribute('label') || ''; }
  set label(value) { this.setStringAttribute('label', value); }
  get name() { return this.getAttribute('name') || ''; }
  set name(value) { this.setStringAttribute('name', value); }
  get value() { return this.hasAttribute('value') ? this.getAttribute('value') : 'on'; }
  set value(value) { this.setAttribute('value', String(value)); }
  get validity() { return this.internals.validity; }
  get validationMessage() { return this.internals.validationMessage; }
  get willValidate() { return this.internals.willValidate; }

  setStringAttribute(name, value) {
    if (value === null || value === undefined) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  get effectiveDisabled() { return this.disabled || this._formDisabled; }

  sync(showError = this._touched) {
    if (!this.input) return;
    const disabled = this.effectiveDisabled;
    this.input.checked = this._checked;
    this.input.indeterminate = this._indeterminate;
    this.input.disabled = disabled;
    this.input.required = this.required;
    this.labelNode.textContent = this.label;
    const accessibleLabel = this.label || [...(this.internals.labels ?? [])]
      .map((label) => label.textContent.trim()).filter(Boolean).join(' ');
    if (accessibleLabel) this.input.setAttribute('aria-label', accessibleLabel);
    else this.input.removeAttribute('aria-label');
    this.toggleAttribute('data-form-disabled', this._formDisabled);
    this.internals.setFormValue(this._checked && !disabled ? this.value : null, this._checked ? this.value : null);
    const invalid = !disabled && this.required && !this._checked;
    const message = invalid ? (this.requiredMessage || this.input.validationMessage) : '';
    this.internals.setValidity(invalid ? { valueMissing: true } : {}, message, this.input);
    const exposeError = invalid && showError;
    this.toggleAttribute('data-invalid', exposeError);
    if (exposeError) this.input.setAttribute('aria-invalid', 'true');
    else this.input.removeAttribute('aria-invalid');
    this.errorNode.hidden = !exposeError;
    this.errorNode.textContent = exposeError ? message : '';
  }

  activateHost(event) {
    const path = event.composedPath();
    if (event.defaultPrevented || this.effectiveDisabled || path.includes(this.input) || path.includes(this.errorNode)) return;
    event.preventDefault();
    this.sync();
    this.input.focus();
    this.input.click();
  }

  commitInput(event) {
    event.stopPropagation();
    this._checked = this.input.checked;
    this._indeterminate = this.input.indeterminate;
    this._dirtyChecked = true;
    this._touched = true;
    this.sync();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  commitChange(event) {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  formResetCallback() {
    this._dirtyChecked = false;
    this._checked = this.defaultChecked;
    this._touched = false;
    this.sync(false);
  }
  formDisabledCallback(disabled) { this._formDisabled = disabled; this.sync(); }
  formStateRestoreCallback(state) { this.checked = state !== null; }
  checkValidity() { this._touched = true; this.sync(true); return this.internals.checkValidity(); }
  reportValidity() {
    this._touched = true;
    this.sync(true);
    const valid = this.internals.reportValidity();
    if (!valid) this.focus();
    return valid;
  }
  focus(options) { this.sync(); this.input.focus(options); }
}
