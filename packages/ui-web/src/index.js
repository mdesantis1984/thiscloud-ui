import markup from './switch.html';
import styles from './switch.css';
import { TcTextField } from './text-field.js';
export { TcTextField };
export { attachFormValidation } from './form-validation.js';

const HTMLElementBase = globalThis.HTMLElement ?? class {};

/** A form-associated switch with no host-framework dependency. */
export class TcSwitch extends HTMLElementBase {
  static formAssociated = true;
  static observedAttributes = ['checked', 'disabled', 'label', 'name', 'readonly', 'required', 'required-message', 'size', 'tone', 'value'];

  constructor() {
    super();
    this.internals = this.attachInternals?.();
    if (!this.attachShadow) return;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `<style>${styles}</style>${markup}`;
    this.button = this.shadow.querySelector('button');
    this.labelNode = this.shadow.querySelector('[part=label]');
    this.errorNode = this.shadow.querySelector('[part=error]');
    this.button.addEventListener('click', () => this.toggle());
    this.button.addEventListener('keydown', (event) => this.handleKeydown(event));
    this.addEventListener('invalid', () => { this.touched = true; this.sync(); });
    this.labelRoot = null;
    this.onAssociatedLabelClick = (event) => {
      const path = event.composedPath();
      const associated = [...(this.internals?.labels ?? [])].some((label) => path.includes(label));
      // Root delegation keeps labels inserted after connection active without observers.
      if (!associated || path.includes(this)) return;
      this.sync();
      this.button?.focus();
      this.toggle();
    };
  }

  connectedCallback() {
    if (this.defaultChecked === undefined) this.defaultChecked = this.checked;
    this.labelRoot?.removeEventListener('click', this.onAssociatedLabelClick);
    this.labelRoot = this.getRootNode();
    this.labelRoot.addEventListener('click', this.onAssociatedLabelClick);
    this.sync();
  }
  disconnectedCallback() {
    this.labelRoot?.removeEventListener('click', this.onAssociatedLabelClick);
    this.labelRoot = null;
  }
  attributeChangedCallback() { this.sync(); }
  formDisabledCallback(disabled) { this.formDisabled = disabled; this.sync(); }
  formResetCallback() { this.touched = false; this.checked = this.defaultChecked; this.sync(); }

  get checked() { return this.hasAttribute('checked'); }
  set checked(value) { this.toggleAttribute('checked', Boolean(value)); }
  get label() { return this.getAttribute('label') || ''; }
  set label(value) { this.setAttribute('label', value); }
  get name() { return this.getAttribute('name') || ''; }
  set name(value) { this.setAttribute('name', value); }
  get disabled() { return Boolean(this.hasAttribute('disabled') || this.formDisabled); }
  set disabled(value) { this.toggleAttribute('disabled', Boolean(value)); }
  get readOnly() { return this.hasAttribute('readonly'); }
  set readOnly(value) { this.toggleAttribute('readonly', Boolean(value)); }
  get required() { return this.hasAttribute('required'); }
  set required(value) { this.toggleAttribute('required', Boolean(value)); }
  get requiredMessage() { return this.getAttribute('required-message') || 'Choose an option.'; }
  set requiredMessage(value) { this.setAttribute('required-message', value); }
  get size() { return this.getAttribute('size') || 'medium'; }
  set size(value) { this.setAttribute('size', value); }
  get tone() { return this.getAttribute('tone') || 'primary'; }
  set tone(value) { this.setAttribute('tone', value); }
  get value() { return this.getAttribute('value') ?? 'on'; }
  set value(value) { this.setAttribute('value', value); }
  validationInternals() {
    if (!this.internals?.validity || typeof this.internals.checkValidity !== 'function' || typeof this.internals.reportValidity !== 'function') {
      throw new Error('tc-switch validation requires ElementInternals support.');
    }
    return this.internals;
  }
  get validity() { return this.validationInternals().validity; }
  get validationMessage() { return this.validationInternals().validationMessage; }
  get willValidate() { return this.validationInternals().willValidate; }
  checkValidity() { return this.validationInternals().checkValidity(); }
  reportValidity() { return this.validationInternals().reportValidity(); }
  focus(options) { this.button?.focus(options); }

  toggle(next = !this.checked) {
    if (this.disabled || this.readOnly || next === this.checked) return;
    this.checked = next;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  handleKeydown(event) {
    if (event.key === ' ') {
      event.preventDefault(); this.toggle();
    }
    if (event.key === 'Enter' || event.key === 'ArrowRight') {
      event.preventDefault(); this.toggle(true);
    }
    if (event.key === 'Delete' || event.key === 'ArrowLeft') {
      event.preventDefault(); this.toggle(false);
    }
  }

  sync() {
    const invalid = this.required && !this.checked && !this.disabled && !this.readOnly;
    const showError = this.touched && invalid;
    this.internals?.setFormValue(this.disabled || !this.checked ? null : this.value);
    this.internals?.setValidity(
      invalid ? { valueMissing: true } : {},
      invalid ? this.requiredMessage : '',
      invalid ? this.button : undefined,
    );
    if (!this.button) return;
    this.button.disabled = this.disabled;
    this.button.setAttribute('aria-checked', String(this.checked));
    this.button.setAttribute('aria-readonly', String(this.readOnly));
    if (showError) this.button.setAttribute('aria-describedby', this.errorNode.id);
    else this.button.removeAttribute('aria-describedby');
    this.errorNode.hidden = !showError;
    this.errorNode.textContent = showError ? this.requiredMessage : '';
    this.toggleAttribute('data-invalid', showError);
    const accessibleLabel = this.label || [...(this.internals?.labels ?? [])].map((label) => label.textContent.trim()).filter(Boolean).join(' ');
    this.labelNode.textContent = this.label;
    if (accessibleLabel) this.button.setAttribute('aria-label', accessibleLabel);
    else this.button.removeAttribute('aria-label');
  }
}

export function defineThiscloudUiWeb() {
  if (!globalThis.customElements) return false;
  let defined = false;
  if (!customElements.get('tc-switch')) { customElements.define('tc-switch', TcSwitch); defined = true; }
  if (!customElements.get('tc-text-field')) { customElements.define('tc-text-field', TcTextField); defined = true; }
  return defined;
}

defineThiscloudUiWeb();
