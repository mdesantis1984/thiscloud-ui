import markup from './radio.html';
import styles from './radio.css';

const HTMLElementBase = globalThis.HTMLElement ?? class {};

/** A form-associated radio that coordinates peers across separate shadow roots. */
export class TcRadio extends HTMLElementBase {
  static formAssociated = true;
  static observedAttributes = ['checked', 'disabled', 'label', 'name', 'required', 'required-message', 'value'];

  constructor() {
    super();
    if (!this.attachInternals) throw new Error('tc-radio requires ElementInternals support.');
    this.internals = this.attachInternals();
    this._checked = false;
    this._dirtyChecked = false;
    this._formDisabled = false;
    this._initialized = false;
    this._touched = false;
    this._groupState = null;
    const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
    shadow.innerHTML = `<style>${styles}</style>${markup}`;
    this.input = shadow.querySelector('input');
    this.labelNode = shadow.querySelector('[part="label"]');
    this.errorNode = shadow.querySelector('[part="error"]');
    this.input.addEventListener('input', (event) => this.commitInput(event));
    this.input.addEventListener('change', (event) => this.commitChange(event));
    this.input.addEventListener('keydown', (event) => this.handleKeydown(event));
    this.addEventListener('click', (event) => this.activateHost(event));
    this.addEventListener('invalid', () => {
      this._touched = true;
      this.sync();
    });
  }

  connectedCallback() {
    if (!this._initialized) {
      this._checked = this.hasAttribute('checked');
      this._initialized = true;
    }
    this.sync();
  }

  disconnectedCallback() {
    const previous = this._groupState;
    this._groupState = null;
    queueMicrotask(() => this.refreshGroup(previous));
  }

  attributeChangedCallback(name) {
    if (!this._initialized) return;
    const previous = this._groupState;
    if (name === 'checked' && !this._dirtyChecked) this._checked = this.hasAttribute('checked');
    this.sync(previous);
  }

  formAssociatedCallback() { this.sync(this._groupState); }
  formDisabledCallback(disabled) { this._formDisabled = disabled; this.sync(); }

  get checked() { return this._checked; }
  set checked(value) {
    this._checked = Boolean(value);
    this._dirtyChecked = true;
    this.sync();
  }
  get defaultChecked() { return this.hasAttribute('checked'); }
  set defaultChecked(value) { this.toggleAttribute('checked', Boolean(value)); }
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
  get effectiveDisabled() { return this.disabled || this._formDisabled; }

  setStringAttribute(name, value) {
    if (value === null || value === undefined) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  groupState() {
    return { root: this.getRootNode(), form: this.internals.form, name: this.name };
  }

  sameGroup(left, right) {
    return left?.root === right?.root && left?.form === right?.form && left?.name === right?.name;
  }

  membersFor({ root, form, name } = {}) {
    if (!name) return this.getRootNode() === root ? [this] : [];
    const members = root?.querySelectorAll ? [...root.querySelectorAll('tc-radio')] : [];
    if (this.getRootNode() === root && !members.includes(this)) members.push(this);
    return members.filter((member) => member instanceof TcRadio
      && member.name === name && member.internals.form === form);
  }

  refreshGroup(state) {
    const members = this.membersFor(state);
    if (members.length) this.renderGroup(members);
  }

  sync(previous = this._groupState) {
    const current = this.groupState();
    if (previous && !this.sameGroup(previous, current)) this.refreshGroup(previous);
    this.renderGroup(this.membersFor(current), this._checked ? this : null);
  }

  renderGroup(members, preferred = null) {
    if (!members.length) return;
    const selected = preferred && members.includes(preferred) && preferred._checked
      ? preferred : members.find((member) => member._checked);
    members.forEach((member) => {
      const nextChecked = member === selected;
      if (member._checked && !nextChecked) member._dirtyChecked = true;
      member._checked = nextChecked;
    });
    const required = members.some((member) => member.required);
    const message = required && !selected ? this.requiredMessageFor(members) : '';
    const focusable = selected && !selected.effectiveDisabled
      ? selected : members.find((member) => !member.effectiveDisabled);
    const errorOwner = members.find((member) => !member.effectiveDisabled);
    const groupTouched = members.some((member) => member._touched);
    members.forEach((member) => {
      member.render({
        checked: Boolean(selected),
        focusable: member === focusable,
        message,
        required,
        showError: groupTouched && member === errorOwner,
      });
      member._groupState = member.groupState();
    });
  }

  requiredMessageFor(members) {
    const supplied = members.map((member) => member.requiredMessage).find(Boolean);
    if (supplied) return supplied;
    const source = members.find((member) => !member.effectiveDisabled) ?? members[0];
    const { checked, disabled, required } = source.input;
    source.input.disabled = false;
    source.input.required = true;
    source.input.checked = false;
    const message = source.input.validationMessage || 'Choose an option.';
    source.input.checked = checked;
    source.input.required = required;
    source.input.disabled = disabled;
    return message;
  }

  render({ checked: groupChecked, focusable, message, required, showError }) {
    const disabled = this.effectiveDisabled;
    this.input.checked = this._checked;
    this.input.disabled = disabled;
    this.input.required = required;
    this.input.tabIndex = focusable ? 0 : -1;
    this.input.value = this.value;
    this.labelNode.textContent = this.label;
    const accessibleLabel = this.label || [...(this.internals.labels ?? [])]
      .map((label) => label.textContent.trim()).filter(Boolean).join(' ');
    if (accessibleLabel) this.input.setAttribute('aria-label', accessibleLabel);
    else this.input.removeAttribute('aria-label');
    this.toggleAttribute('data-form-disabled', this._formDisabled);
    this.internals.setFormValue(this._checked && !disabled ? this.value : null, this._checked ? this.value : null);
    const invalid = required && !groupChecked;
    this.internals.setValidity(invalid ? { valueMissing: true } : {}, invalid ? message : '', invalid ? this.input : undefined);
    const exposeError = invalid && !disabled && showError;
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
    this._dirtyChecked = true;
    this._touched = true;
    this.sync();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  commitChange(event) {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  handleKeydown(event) {
    if (!['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)) return;
    const enabled = this.membersFor(this.groupState()).filter((member) => !member.effectiveDisabled);
    const index = enabled.indexOf(this);
    if (index < 0 || enabled.length < 2) return;
    event.preventDefault();
    const direction = getComputedStyle(this).direction;
    const previous = event.key === 'ArrowUp'
      || (event.key === 'ArrowLeft' && direction !== 'rtl')
      || (event.key === 'ArrowRight' && direction === 'rtl');
    const target = enabled[(index + (previous ? -1 : 1) + enabled.length) % enabled.length];
    target.selectFromKeyboard();
  }

  selectFromKeyboard() {
    this.input.focus();
    if (this._checked) return;
    this._checked = true;
    this._dirtyChecked = true;
    this._touched = true;
    this.sync();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  formResetCallback() {
    this._dirtyChecked = false;
    this._checked = this.defaultChecked;
    this._touched = false;
    this.sync();
  }
  formStateRestoreCallback(state) { this.checked = state !== null; }
  checkValidity() { this._touched = true; this.sync(); return this.internals.checkValidity(); }
  reportValidity() {
    this._touched = true;
    this.sync();
    const valid = this.internals.reportValidity();
    if (!valid) this.focus();
    return valid;
  }
  focus(options) { this.sync(); this.input.focus(options); }
}
