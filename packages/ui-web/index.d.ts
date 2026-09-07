export interface ValidationControl {
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}

export interface FormValidationBaseResult {
  form: HTMLFormElement;
  submitter?: HTMLElement | null;
}

export interface InvalidFormValidationResult extends FormValidationBaseResult {
  status: 'invalid';
  invalidControls: ValidationControl[];
}

export interface ValidFormValidationResult extends FormValidationBaseResult {
  status: 'valid';
  formData: FormData;
}

export interface SkippedFormValidationResult extends FormValidationBaseResult {
  status: 'skipped';
  reason: 'formnovalidate';
}

export type FormValidationResult = InvalidFormValidationResult | ValidFormValidationResult | SkippedFormValidationResult;

export interface FormValidationOptions {
  preventDefault?: boolean;
  onInvalid?(result: FormValidationResult): void;
  onValid?(result: FormValidationResult): void;
  onSkipped?(result: FormValidationResult): void;
  onReset?(result: { form: HTMLFormElement }): void;
}

export interface FormValidationHandle {
  validate(options?: { submitter?: HTMLElement | null; focus?: boolean }): FormValidationResult;
  dispose(): void;
}

export function attachFormValidation(form: HTMLFormElement, options?: FormValidationOptions): FormValidationHandle;

export class TcSwitch extends HTMLElement implements ValidationControl {
  checked: boolean;
  defaultChecked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  requiredMessage: string;
  label: string;
  name: string;
  value: string;
  size: 'small' | 'medium' | 'large' | string;
  tone: 'primary' | 'secondary' | string;
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
}

export class TcTextField extends HTMLElement implements ValidationControl {
  value: string;
  defaultValue: string;
  name: string;
  label: string;
  helper: string;
  autocomplete: string;
  clearLabel: string;
  requiredMessage: string;
  typeMismatchMessage: string;
  type: 'text' | 'email';
  variant: 'standard' | 'filled' | 'outlined';
  required: boolean;
  readOnly: boolean;
  disabled: boolean;
  clearable: boolean;
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
}

export function defineThiscloudUiWeb(): boolean;

declare global {
  interface HTMLElementTagNameMap {
    'tc-switch': TcSwitch;
    'tc-text-field': TcTextField;
  }
}
