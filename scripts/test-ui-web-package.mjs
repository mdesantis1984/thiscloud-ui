import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { access, cp, mkdir, mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { chromium } from 'playwright-core';
import { build } from 'esbuild';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const packageDir = resolve(root, 'packages/ui-web');
const packageVersion = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8')).version;
const temp = await mkdtemp(resolve(tmpdir(), 'thiscloud-ui-web-'));

async function browserExecutable() {
  const candidates = [process.env.UI_WEB_CHROME, chromium.executablePath()].filter(Boolean);
  try {
    const { stdout } = await exec('sh', ['-lc', 'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser']);
    candidates.push(stdout.trim());
  } catch {}
  for (const candidate of candidates) {
    try { await access(candidate); return candidate; } catch {}
  }
  throw new Error('No Chromium executable was found. Set UI_WEB_CHROME to an existing Chrome/Chromium binary, or install a local browser available on PATH. This test never downloads or installs a browser.');
}

async function packageArtifact() {
  await exec('pnpm', ['--dir', packageDir, 'pack', '--pack-destination', temp], { cwd: root });
  const archive = (await readdir(temp)).find((name) => name.endsWith('.tgz'));
  assert.ok(archive, 'Packing @thiscloud/ui-web must produce a tarball.');
  const { stdout: contents } = await exec('tar', ['-tzf', resolve(temp, archive)]);
  for (const file of ['LICENSE', 'README.md', 'CHANGELOG.md', 'MIGRATION.md', 'SUPPORT.md', 'index.d.ts', 'dist/index.js', 'dist/tokens.css']) {
    assert.match(contents, new RegExp(`package/${file.replace('.', '\\.')}`), `The packed archive must include ${file}.`);
  }
  await exec('tar', ['-xzf', resolve(temp, archive), '-C', temp]);
  const packageRoot = resolve(temp, 'package');
  assert.equal(JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8')).version, packageVersion, 'The packed package version must match its source manifest.');
  const consumer = resolve(temp, 'consumer');
  await mkdir(resolve(consumer, 'node_modules/@thiscloud'), { recursive: true });
  await cp(packageRoot, resolve(consumer, 'node_modules/@thiscloud/ui-web'), { recursive: true });
  const output = await build({ stdin: { contents: "import '@thiscloud/ui-web';", resolveDir: consumer, sourcefile: 'consumer.js' }, bundle: true, format: 'esm', platform: 'browser', write: false });
  assert.match(output.outputFiles[0].text, /customElements\.define\(['"]tc-switch/, 'A side-effect-only public import must retain registration.');
  return { packageRoot, bundle: output.outputFiles[0].text };
}

function createHostServer({ packageRoot, bundle }) {
  return createServer(async (request, response) => {
    const files = {
      '/sdk/index.js': ['dist/index.js', 'text/javascript'],
      '/sdk/tokens.css': ['dist/tokens.css', 'text/css'],
    };
    if (request.url === '/') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end(`<!doctype html><link rel="stylesheet" href="/sdk/tokens.css"><form id="form"><fieldset id="fieldset"><label id="external" for="control">External control</label><tc-switch id="control" name="notifications" label="Notifications" value="enabled"></tc-switch><label id="wrapping">Wrapping label <tc-switch id="wrapped" name="wrapped"></tc-switch></label><label id="accessible" for="associated">Associated accessible name</label><tc-switch id="associated" name="associated"></tc-switch></fieldset><button type="reset">Reset</button></form><form id="defaults"><tc-switch id="initial-true" checked label="Initial true"></tc-switch><tc-switch id="initial-false" label="Initial false"></tc-switch></form><script type="module" src="/sdk/index.js"></script>`);
      return;
    }
    if (request.url === '/side-effect.html') {
      response.writeHead(200, { 'content-type': 'text/html' }); response.end('<!doctype html><script type="module" src="/consumer.js"></script>'); return;
    }
    if (request.url === '/consumer.js') {
      response.writeHead(200, { 'content-type': 'text/javascript' }); response.end(bundle); return;
    }
    const file = files[request.url];
    if (!file) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'content-type': file[1] });
    response.end(await readFile(resolve(packageRoot, file[0])));
  });
}

let server;
let browser;
let catalogServer;
try {
  const chrome = await browserExecutable();
  const artifact = await packageArtifact();
  assert.doesNotMatch(artifact.bundle, /MutationObserver|closest\(['"]fieldset\[disabled\]|formdata/, 'Text fields must rely on form association callbacks, not document observers or FormData mutation.');
  server = createHostServer(artifact);
  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  const address = server.address();
  browser = await chromium.launch({ executablePath: chrome, headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${address.port}`);
  await page.waitForFunction(() => customElements.get('tc-switch') && customElements.get('tc-text-field'));
  const control = page.locator('#control');
  const switchButton = control.getByRole('switch', { name: 'Notifications' });
  assert.equal(await page.locator('tc-switch').evaluateAll((elements) => elements.every((element) => element.shadowRoot.querySelectorAll('[role=switch]').length === 1)), true, 'Each host must expose one switch role.');
  assert.equal(await page.evaluate(() => ['main', 'view', 't', 'catalog.js'].every((name) => !document.querySelector(`#${name}`))), true);
  await page.evaluate(() => {
    const field = document.createElement('tc-text-field');
    field.id = 'text-control'; field.name = 'organization'; field.label = 'Organization'; field.helper = 'Required for the workspace.';
    field.variant = 'filled'; field.required = true; field.clearable = true; field.setAttribute('clear-label', 'Clear organization');
    field.setAttribute('required-message', 'Organization is required.'); field.setAttribute('type-mismatch-message', 'Use a valid email address.');
    document.querySelector('#fieldset').append(field);
  });
  const textControl = page.locator('#text-control');
  const textInput = textControl.getByRole('textbox', { name: 'Organization' });
  assert.deepEqual(await textControl.evaluate((element) => [element.type, element.variant, element.value, element.required, element.clearable]), ['text', 'filled', '', true, true]);
  assert.equal(await textControl.evaluate((element) => element.shadowRoot.querySelector('[part=label]').textContent), 'Organization');
  assert.equal(await textControl.evaluate((element) => element.shadowRoot.querySelector('[part=error]').hidden), true, 'A pristine field must not show an error before validation.');
  const defaultVariants = await page.evaluate(() => {
    const create = (variant) => {
      const field = document.createElement('tc-text-field');
      field.label = 'Default outline';
      field.value = 'Visible value';
      if (variant) field.setAttribute('variant', variant);
      document.body.append(field);
      const input = field.shadowRoot.querySelector('[part=input]');
      const label = field.shadowRoot.querySelector('[part=label]');
      return { variant: field.variant, attribute: field.getAttribute('variant'), border: getComputedStyle(input).borderTopWidth, labelTop: getComputedStyle(label).top, notch: getComputedStyle(label).backgroundColor };
    };
    return [create(), create('unsupported')];
  });
  assert.deepEqual(defaultVariants.map(({ variant, attribute, border, labelTop }) => [variant, attribute, border, labelTop]), [['outlined', null, '1px', '0px'], ['outlined', 'unsupported', '1px', '0px']], 'Missing and unsupported variants must render the outlined default without normalizing the public attribute.');
  assert.equal(await textControl.evaluate((element) => {
    const input = element.shadowRoot.querySelector('[part=input]');
    return [element.shadowRoot.querySelectorAll('input').length, input.getAttribute('aria-describedby'), input.hasAttribute('aria-invalid')];
  }).then(([count, describedBy, invalid]) => count === 1 && describedBy === 'helper error' && !invalid), true, 'A host must expose one native textbox with stable descriptions and no pristine ARIA error.');
  assert.deepEqual(await textControl.evaluate((element) => {
    const input = element.shadowRoot.querySelector('[part=input]');
    element.autocomplete = 'organization';
    const property = [element.autocomplete, input.autocomplete];
    element.setAttribute('autocomplete', 'email');
    return { property, attribute: [element.autocomplete, input.autocomplete] };
  }), { property: ['organization', 'organization'], attribute: ['email', 'email'] }, 'Autocomplete property and attribute changes must reach the native input.');
  const textFieldFallbacks = await page.evaluate(() => {
    const create = (attributes) => {
      const field = document.createElement('tc-text-field');
      Object.assign(field, attributes);
      document.body.append(field);
      return field;
    };
    const required = create({ label: 'Bare required', required: true });
    const email = create({ label: 'Bare email', type: 'email', value: 'invalid-email' });
    const spanish = create({ label: 'Spanish required', required: true, requiredMessage: 'Este campo es obligatorio.' });
    const english = create({ label: 'English email', type: 'email', value: 'invalid-email', typeMismatchMessage: 'Enter a valid email address.' });
    const fields = [required, email, spanish, english];
    fields.forEach((field) => { field.touched = true; field.sync(); });
    const details = (field) => {
      const input = field.shadowRoot.querySelector('[part=input]');
      return {
        inputId: input.id,
        labelFor: field.shadowRoot.querySelector('[part=label]').htmlFor,
        describedBy: input.getAttribute('aria-describedby'),
        visible: field.shadowRoot.querySelector('[part=error]').textContent,
        native: input.validationMessage,
        internal: field.internals.validationMessage,
        role: field.getAttribute('role'),
      };
    };
    return [details(required), details(email), details(spanish), details(english)];
  });
  assert.deepEqual(textFieldFallbacks.slice(0, 2).map(({ visible, native, internal }) => [visible, native, internal]), textFieldFallbacks.slice(0, 2).map(({ native }) => [native, native, native]), 'Bare TextFields must expose the browser native validation message consistently without assuming its locale.');
  assert.ok(textFieldFallbacks.slice(0, 2).every(({ native }) => native.length > 0), 'Native fallback messages must be nonempty for required and email constraints.');
  assert.deepEqual(textFieldFallbacks.slice(2).map(({ visible, internal }) => [visible, internal]), [['Este campo es obligatorio.', 'Este campo es obligatorio.'], ['Enter a valid email address.', 'Enter a valid email address.']], 'Consumer Spanish and English message overrides must replace native fallback consistently.');
  assert.equal(textFieldFallbacks.every(({ inputId, labelFor, describedBy, role }) => inputId === 'input' && labelFor === 'input' && describedBy === 'helper error' && role === null), true, 'Each shadow root must maintain its own native label and description associations without adding host roles.');
  await textInput.fill('Aurora');
  assert.equal(await textControl.evaluate((element) => element.value), 'Aurora');
  const textEvents = await textControl.evaluate((element) => { element.events = []; ['input', 'change'].forEach((type) => element.addEventListener(type, (event) => element.events.push([type, event.composed]))); element.value = 'Quiet'; return element.events; });
  assert.deepEqual(textEvents, [], 'Programmatic text-field updates must be quiet.');
  await textControl.evaluate((element) => { element.events = []; });
  await textInput.fill('Aurora'); await textInput.press('Tab');
  assert.deepEqual(await textControl.evaluate((element) => element.events), [['input', true], ['change', true]], 'A user edit must emit one composed input/change pair.');
   await textControl.evaluate((element) => {
     element.events = []; element.value = 'Enter value';
     document.querySelector('#form').addEventListener('submit', (event) => event.preventDefault(), { once: true });
   });
  await textInput.focus(); await textInput.press('End'); await textInput.press('!'); await textInput.press('Enter'); await textInput.press('Tab');
  assert.deepEqual(await textControl.evaluate((element) => element.events), [['input', true], ['change', true]], 'Enter followed by blur must commit the native edit once.');
  assert.equal(await textControl.evaluate((element) => new FormData(document.querySelector('#form')).get('organization')), 'Enter value!');
  await textControl.evaluate((element) => { element.events = []; });
  await textControl.getByRole('button', { name: 'Clear organization' }).click();
  assert.equal(await textControl.evaluate((element) => element.value), '');
  assert.deepEqual(await textControl.evaluate((element) => ({ events: element.events, focused: element.shadowRoot.activeElement === element.shadowRoot.querySelector('input') })), { events: [['input', true], ['change', true]], focused: true }, 'Clear must emit one native interaction pair and restore input focus.');
  assert.equal(await textControl.evaluate((element) => { const form = document.querySelector('#form'); form.checkValidity(); return element.shadowRoot.querySelector('[part=error]').textContent; }), 'Organization is required.');
  assert.equal(await textControl.evaluate((element) => { const form = document.querySelector('#form'); form.reportValidity(); return element.shadowRoot.activeElement === element.shadowRoot.querySelector('input'); }), true, 'reportValidity must focus the native input.');
  const resetVisualState = await textControl.evaluate((element) => {
    const form = document.querySelector('#form');
    form.reset();
    const input = element.shadowRoot.querySelector('[part=input]');
    const error = element.shadowRoot.querySelector('[part=error]');
    return { value: element.value, constraintAvailable: !element.internals.validity.valid, errorHidden: error.hidden, errorText: error.textContent, ariaInvalid: input.hasAttribute('aria-invalid'), dataInvalid: element.hasAttribute('data-invalid') };
  });
  assert.deepEqual(resetVisualState, { value: '', constraintAvailable: true, errorHidden: true, errorText: '', ariaInvalid: false, dataInvalid: false }, 'Reset must retain native constraint availability while clearing stale visual and ARIA errors.');
  const textForm = await textControl.evaluate(async (element) => { const form = document.querySelector('#form'); element.value = 'Reset value'; const before = new FormData(form).get('organization'); form.reset(); const reset = element.value; element.disabled = true; const disabled = !new FormData(form).has('organization'); element.disabled = false; element.readOnly = true; element.value = ''; const readonlyValid = form.checkValidity(); document.querySelector('#fieldset').disabled = true; await new Promise((resolve) => setTimeout(resolve)); const fieldset = !new FormData(form).has('organization'); document.querySelector('#fieldset').disabled = false; return { before, reset, disabled, readonlyValid, fieldset }; });
  assert.deepEqual(textForm, { before: 'Reset value', reset: '', disabled: true, readonlyValid: true, fieldset: true });
  await textControl.evaluate((element) => { element.readOnly = false; element.type = 'email'; element.value = 'not-an-email'; });
  await textInput.press('Tab');
  assert.equal(await textControl.evaluate((element) => element.shadowRoot.querySelector('[part=error]').textContent), 'Use a valid email address.');
  await textControl.evaluate((element) => { element.disabled = true; });

  const formAssociation = await page.evaluate(() => {
    const owner = document.createElement('form'); owner.id = 'external-owner';
    const outside = document.createElement('tc-text-field'); outside.id = 'external-text-field'; outside.setAttribute('form', owner.id); outside.name = 'shared'; outside.value = 'outside';
    const externalLabel = document.createElement('label'); externalLabel.htmlFor = outside.id; externalLabel.textContent = 'External text label';
    const firstLegend = document.createElement('form');
    firstLegend.innerHTML = '<fieldset disabled><legend><tc-text-field id="legend-field" name="legend" value="included" label="Legend"></tc-text-field></legend><tc-text-field id="fieldset-field" name="fieldset" value="omitted" label="Fieldset"></tc-text-field></fieldset>';
    const sharedOne = document.createElement('tc-text-field'); sharedOne.name = 'shared'; sharedOne.value = 'sdk-one';
    const sharedTwo = document.createElement('tc-text-field'); sharedTwo.name = 'shared'; sharedTwo.value = 'sdk-two'; sharedTwo.disabled = true;
    const native = document.createElement('input'); native.name = 'shared'; native.value = 'native';
    owner.append(sharedOne, sharedTwo, native); document.body.append(owner, externalLabel, outside, firstLegend);
    const labels = [...outside.internals.labels].length;
    externalLabel.click();
    const ownerValues = new FormData(owner).getAll('shared');
    const fieldset = firstLegend.querySelector('fieldset');
    const legendValues = new FormData(firstLegend);
    fieldset.disabled = false;
    const enabledValues = new FormData(firstLegend);
    fieldset.disabled = true;
    return {
      labels,
      externalFocus: outside.shadowRoot.activeElement === outside.shadowRoot.querySelector('input'),
      ownerValues,
      outsideValue: new FormData(owner).get('shared'),
      legendIncluded: legendValues.get('legend'),
      fieldsetOmitted: !legendValues.has('fieldset'),
      fieldsetRestored: enabledValues.get('fieldset'),
      legendDisabled: document.querySelector('#legend-field').disabled,
      fieldsetDisabled: document.querySelector('#fieldset-field').disabled,
    };
  });
  assert.deepEqual(formAssociation, { labels: 1, externalFocus: true, ownerValues: ['sdk-one', 'native', 'outside'], outsideValue: 'sdk-one', legendIncluded: 'included', fieldsetOmitted: true, fieldsetRestored: 'omitted', legendDisabled: false, fieldsetDisabled: true }, 'Form association must preserve sibling names, fieldset toggles, and the first-legend exemption.');
  await page.locator('tc-text-field[form="external-owner"]').evaluate((element) => { element.type = 'unsupported'; });
  assert.deepEqual(await page.locator('tc-text-field[form="external-owner"]').evaluate((element) => [element.type, element.shadowRoot.querySelector('input').type]), ['text', 'text'], 'Unsupported text-field types must fall back to text.');
   assert.deepEqual(await textControl.evaluate((element) => { element.clearLabel = 'Erase value'; element.requiredMessage = 'A value is required.'; element.typeMismatchMessage = 'Provide an email.'; return [element.clearLabel, element.requiredMessage, element.typeMismatchMessage]; }), ['Erase value', 'A value is required.', 'Provide an email.'], 'Declared text-field message and clear-label properties must reflect attributes without extra controls.');

   const formValidation = await page.evaluate(async () => {
     const { attachFormValidation } = await import('/sdk/index.js');
     const form = document.createElement('form');
     form.id = 'managed-form'; form.noValidate = true;
     const text = document.createElement('tc-text-field'); text.name = 'shared'; text.label = 'Managed organization'; text.required = true; text.requiredMessage = 'Organization is required.';
     const native = document.createElement('input'); native.name = 'shared'; native.required = true; native.value = 'native';
     const file = document.createElement('input'); file.type = 'file'; file.name = 'attachments';
     const toggle = document.createElement('tc-switch'); toggle.name = 'updates'; toggle.label = 'Updates'; toggle.required = true; toggle.requiredMessage = 'Choose updates.';
     const submit = document.createElement('button'); submit.type = 'submit'; submit.name = 'intent'; submit.value = 'save';
     const skip = document.createElement('button'); skip.type = 'submit'; skip.formNoValidate = true;
     const reset = document.createElement('button'); reset.type = 'reset';
     const external = document.createElement('tc-text-field'); external.name = 'shared'; external.value = 'external'; external.label = 'External managed'; external.setAttribute('form', form.id);
     form.append(text, native, file, toggle, submit, skip, reset); document.body.append(form, external);
     const calls = [];
      const handle = attachFormValidation(form, {
       preventDefault: true,
       onInvalid: (result) => calls.push(['invalid', result.invalidControls.length]),
       onValid: (result) => calls.push(['valid', [...result.formData.entries()].map(([key, value]) => [key, value instanceof File ? value.name : value])]),
       onSkipped: (result) => calls.push([result.status, result.reason]),
       onReset: () => calls.push(['reset']),
      });
      const sameHandle = attachFormValidation(form) === handle;
      const anchor = document.createElement('button'); anchor.type = 'button'; document.body.append(anchor); anchor.focus();
      let invalidEvents = 0;
      native.value = '';
      native.addEventListener('invalid', () => { invalidEvents += 1; });
      const noFocus = handle.validate({ submitter: submit, focus: false });
      const noFocusActive = document.activeElement === anchor;
      const noFocusEvents = invalidEvents;
      const invalid = handle.validate({ submitter: submit, focus: true });
      const invalidFocus = text.shadowRoot.activeElement === text.shadowRoot.querySelector('input');
     const publicSurface = [text, toggle].map((control) => ({
       willValidate: control.willValidate,
       valid: control.validity.valid,
       message: control.validationMessage,
       check: control.checkValidity(),
     }));
      text.value = 'Aurora'; native.value = 'native'; toggle.checked = true;
      const valid = handle.validate({ submitter: submit });
      const skipped = handle.validate({ submitter: skip });
      form.reset();
      let cancelledReset = false;
      const cancel = (event) => { event.preventDefault(); cancelledReset = true; };
      form.addEventListener('reset', cancel, { once: true });
      form.reset(); await new Promise((resolve) => setTimeout(resolve));
      const afterCancelled = calls.filter(([kind]) => kind === 'reset').length;
     handle.dispose();
     form.dispatchEvent(new SubmitEvent('submit', { cancelable: true, submitter: submit }));
     const afterDispose = calls.length;
     const replacement = attachFormValidation(form, { onValid: () => calls.push(['replacement']) });
     const reattached = replacement !== handle;
      replacement.validate({ submitter: submit });
     replacement.dispose();
     return {
        sameHandle, noFocus: { status: noFocus.status, count: noFocus.invalidControls.length, active: noFocusActive, events: noFocusEvents }, invalid: { status: invalid.status, count: invalid.invalidControls.length }, invalidFocus,
       publicSurface, valid: { status: valid.status, shared: valid.formData.getAll('shared'), intent: valid.formData.get('intent'), attachment: valid.formData.get('attachments') instanceof File },
        skipped: { status: skipped.status, reason: skipped.reason }, calls, cancelledReset, afterCancelled, afterDispose, reattached,
       resetValues: { text: text.value, checked: toggle.checked }, externalInElements: [...form.elements].includes(external), noValidate: form.noValidate,
     };
   });
    assert.deepEqual(formValidation.sameHandle, true, 'Form validation attachment must be idempotent.');
    assert.deepEqual(formValidation.noFocus, { status: 'invalid', count: 3, active: true, events: 1 }, 'focus: false must call native checkValidity exactly once without moving active focus.');
    assert.deepEqual(formValidation.invalid, { status: 'invalid', count: 3 }, 'Managed validation must report all invalid SDK controls.');
   assert.equal(formValidation.invalidFocus, true, 'Managed validation must focus the first invalid public control.');
   assert.deepEqual(formValidation.publicSurface.map(({ willValidate, valid, check }) => [willValidate, valid, check]), [[true, false, false], [true, false, false]], 'SDK controls must expose the public native validation surface.');
   assert.deepEqual(formValidation.valid, { status: 'valid', shared: ['Aurora', 'native', 'external'], intent: 'save', attachment: true }, 'Valid acceptance must preserve duplicate names, submitter data, external ownership, and native file entries.');
   assert.deepEqual(formValidation.skipped, { status: 'skipped', reason: 'formnovalidate' }, 'A formnovalidate submitter must be skipped rather than reported valid.');
   assert.equal(formValidation.cancelledReset, true);
   assert.equal(formValidation.afterCancelled, 1, 'A later cancelled reset must not erase the earlier uncancelled reset callback.');
   assert.deepEqual(formValidation.resetValues, { text: '', checked: false }, 'Native and SDK defaults must be restored before the reset callback.');
    assert.equal(formValidation.afterDispose, 5, 'Disposed handles must not retain submit listeners.');
   assert.equal(formValidation.reattached, true, 'A disposed form can receive a fresh validation handle.');
   assert.equal(formValidation.externalInElements, true, 'Externally-associated SDK controls must be visible through form.elements.');
    assert.equal(formValidation.noValidate, true, 'The helper must not alter the consumer form novalidate policy.');

    const namedFormControls = await page.evaluate(async () => {
      const { attachFormValidation } = await import('/sdk/index.js');
      const form = document.createElement('form'); form.noValidate = true;
      form.innerHTML = '<input name="elements" required><input name="checkValidity" required><input name="reportValidity" required><input name="requestSubmit"><button type="submit" name="intent" value="save">Submit</button>';
      const field = document.createElement('tc-text-field'); field.name = 'sdk'; form.append(field); document.body.append(form);
      const handle = attachFormValidation(form, { preventDefault: true });
      const result = handle.validate({ focus: false });
      field.value = 'ready'; [...form.querySelectorAll('input[required]')].forEach((input) => { input.value = 'ready'; });
      const events = [];
      form.addEventListener('submit', (event) => { event.preventDefault(); events.push(event.submitter?.name); });
      field.shadowRoot.querySelector('input').focus();
      const getter = Object.getOwnPropertyDescriptor(form.ownerDocument.defaultView.HTMLFormElement.prototype, 'elements').get;
      return { collision: [form.elements.name, typeof form.checkValidity, getter.call(form).length], result: [result.status, result.invalidControls.length], field };
    });
    assert.deepEqual(namedFormControls.collision, ['elements', 'object', 6], 'The fixture must shadow named form members while the native prototype getter retains all controls.');
    assert.deepEqual(namedFormControls.result, ['invalid', 3], 'Managed validation must collect every invalid native named control once.');

    const formValidationSafety = await page.evaluate(async () => {
      const { attachFormValidation } = await import('/sdk/index.js');
      const form = document.createElement('form'); form.noValidate = true;
      const input = document.createElement('input'); input.required = true;
      const submit = document.createElement('button'); submit.type = 'submit';
      const skip = document.createElement('button'); skip.type = 'submit'; skip.formNoValidate = true;
      form.append(input, submit, skip); document.body.append(form);
      let currentEvent;
      const callbackCancelled = {};
      const dispatch = (submitter) => {
        const event = new SubmitEvent('submit', { cancelable: true, submitter });
        currentEvent = event;
        form.dispatchEvent(event);
        return { cancelled: event.defaultPrevented };
      };
      const invalidHandle = attachFormValidation(form, { onInvalid: () => { callbackCancelled.invalid = currentEvent.defaultPrevented; throw new Error('invalid callback'); } });
      const invalid = dispatch(submit); invalidHandle.dispose();
      input.value = 'valid';
      const validHandle = attachFormValidation(form, { preventDefault: true, onValid: () => { callbackCancelled.valid = currentEvent.defaultPrevented; throw new Error('valid callback'); } });
      const valid = dispatch(submit); validHandle.dispose();
      const skippedHandle = attachFormValidation(form, { preventDefault: true, onSkipped: () => { callbackCancelled.skipped = currentEvent.defaultPrevented; throw new Error('skipped callback'); } });
      const skipped = dispatch(skip); skippedHandle.dispose();
      return { invalid, valid, skipped, callbackCancelled };
    });
    assert.deepEqual(formValidationSafety, {
      invalid: { cancelled: true },
      valid: { cancelled: true },
      skipped: { cancelled: true },
      callbackCancelled: { invalid: true, valid: true, skipped: true },
    }, 'Managed submission cancellation must happen before any throwing callback.');

    const publicValidationCapability = await page.evaluate(() => {
      const switchControl = document.createElement('tc-switch'); switchControl.internals = undefined;
      const textField = document.createElement('tc-text-field'); textField.internals = undefined;
      const message = (() => { try { switchControl.checkValidity(); } catch (error) { return error.message; } return ''; })();
      return { switchMessage: message, textValid: textField.checkValidity(), textValidity: textField.validity.valid };
    });
    assert.match(publicValidationCapability.switchMessage, /ElementInternals/, 'A switch must fail descriptively instead of fabricating valid validation state.');
    assert.deepEqual([publicValidationCapability.textValid, publicValidationCapability.textValidity], [true, true], 'A TextField may use its native input when ElementInternals is unavailable.');

    await page.evaluate(() => {
      const createField = (form, id) => {
        const field = document.createElement('tc-text-field'); field.id = id; field.setAttribute('form', form.id); field.name = id;
        document.body.append(field); return field;
      };
      const owner = document.createElement('form'); owner.id = 'enter-owner'; document.body.append(owner);
      const external = createField(owner, 'external-enter');
      const externalSubmit = document.createElement('button'); externalSubmit.type = 'submit'; externalSubmit.setAttribute('form', owner.id); document.body.append(externalSubmit);
      const disabledForm = document.createElement('form'); disabledForm.id = 'disabled-enter'; document.body.append(disabledForm);
      const disabled = createField(disabledForm, 'disabled-enter-field');
      const disabledSubmit = document.createElement('button'); disabledSubmit.type = 'submit'; disabledSubmit.disabled = true; disabledForm.append(disabledSubmit);
      const fieldsetForm = document.createElement('form'); fieldsetForm.id = 'fieldset-enter'; document.body.append(fieldsetForm);
      const fieldsetField = createField(fieldsetForm, 'fieldset-enter-field');
      const disabledFieldset = document.createElement('fieldset'); disabledFieldset.disabled = true;
      const fieldsetSubmit = document.createElement('button'); fieldsetSubmit.type = 'submit'; disabledFieldset.append(fieldsetSubmit); fieldsetForm.append(disabledFieldset);
      const multi = document.createElement('form'); multi.id = 'multi-enter'; document.body.append(multi);
      const multiOne = createField(multi, 'multi-one'); const multiTwo = createField(multi, 'multi-two');
      const nativeMulti = document.createElement('form'); nativeMulti.id = 'native-multi-enter'; document.body.append(nativeMulti);
      const nativeMultiField = createField(nativeMulti, 'native-multi-enter-field');
      const number = document.createElement('input'); number.type = 'number'; nativeMulti.append(number);
      const prevented = document.createElement('form'); prevented.id = 'prevented-enter'; document.body.append(prevented);
      const preventedField = createField(prevented, 'prevented-field'); const preventedSubmit = document.createElement('button'); preventedSubmit.type = 'submit'; prevented.append(preventedSubmit);
      preventedField.addEventListener('keydown', (event) => event.preventDefault());
      const windowCancelled = document.createElement('form'); windowCancelled.id = 'window-cancelled-enter'; document.body.append(windowCancelled);
      const windowCancelledField = createField(windowCancelled, 'window-cancelled-enter-field'); const windowCancelledSubmit = document.createElement('button'); windowCancelledSubmit.type = 'submit'; windowCancelled.append(windowCancelledSubmit);
      const noValidate = document.createElement('form'); noValidate.id = 'formnovalidate-enter'; document.body.append(noValidate);
      const noValidateField = createField(noValidate, 'formnovalidate-enter-field'); noValidateField.required = true;
      const noValidateSubmit = document.createElement('button'); noValidateSubmit.id = 'formnovalidate-enter-submit'; noValidateSubmit.type = 'submit'; noValidateSubmit.formNoValidate = true; noValidate.append(noValidateSubmit);
      const closedHost = document.createElement('div'); const closedRoot = closedHost.attachShadow({ mode: 'closed' });
      const closedForm = document.createElement('form'); closedForm.id = 'closed-enter'; const closedField = document.createElement('tc-text-field'); closedField.name = 'closed';
      const closedSubmit = document.createElement('button'); closedSubmit.id = 'closed-enter-submit'; closedSubmit.type = 'submit'; closedForm.append(closedField, closedSubmit); closedRoot.append(closedForm); document.body.append(closedHost);
      const reparentSource = document.createElement('form'); reparentSource.id = 'reparent-source'; const reparentTarget = document.createElement('form'); reparentTarget.id = 'reparent-target'; document.body.append(reparentSource, reparentTarget);
      const reparentField = createField(reparentSource, 'reparent-enter-field'); const reparentSubmit = document.createElement('button'); reparentSubmit.type = 'submit'; reparentSource.append(reparentSubmit);
      const removalForm = document.createElement('form'); removalForm.id = 'removal-enter'; document.body.append(removalForm);
      const removalField = createField(removalForm, 'removal-enter-field'); const removalSubmit = document.createElement('button'); removalSubmit.type = 'submit'; removalForm.append(removalSubmit);
      const orderForm = document.createElement('form'); orderForm.id = 'order-enter'; document.body.append(orderForm);
      const orderField = createField(orderForm, 'order-enter-field'); const orderSubmit = document.createElement('button'); orderSubmit.id = 'order-enter-submit'; orderSubmit.type = 'submit'; orderForm.append(orderSubmit);
      const laterDocument = (event) => {
        const source = event.composedPath()[0];
        if (source === reparentField.shadowRoot.querySelector('input')) { reparentField.removeAttribute('form'); reparentTarget.append(reparentField); }
        if (source === removalField.shadowRoot.querySelector('input')) removalField.remove();
        if (source === preventedField.shadowRoot.querySelector('input')) event.preventDefault();
      };
      document.addEventListener('keydown', laterDocument);
      window.addEventListener('keydown', (event) => {
        if (event.composedPath()[0] === windowCancelledField.shadowRoot.querySelector('input')) event.preventDefault();
      });
      window.__closedEnter = { field: closedField, form: closedForm };
      externalSubmit.id = 'external-enter-submit'; disabledSubmit.id = 'disabled-enter-submit'; preventedSubmit.id = 'prevented-enter-submit';
    });
    await page.evaluate(() => {
      const result = [];
      for (const form of document.querySelectorAll('#enter-owner, #disabled-enter, #fieldset-enter, #multi-enter, #native-multi-enter, #prevented-enter, #window-cancelled-enter, #formnovalidate-enter, #reparent-source, #reparent-target, #removal-enter, #order-enter')) {
        form.addEventListener('submit', (event) => { if (!event.defaultPrevented) result.push([form.id, event.submitter?.id ?? null]); event.preventDefault(); });
      }
      window.__closedEnter.form.addEventListener('submit', (event) => { event.preventDefault(); result.push(['closed-enter', event.submitter?.id ?? null]); });
      const order = [];
      document.querySelector('#order-enter-field').addEventListener('change', () => order.push('change'));
      document.querySelector('#order-enter').addEventListener('submit', () => order.push('submit'));
      window.__enterOrder = order;
      window.__enterSubmissions = result;
      return result;
    });
    await page.locator('#external-enter').getByRole('textbox').press('Enter');
    await page.locator('#disabled-enter-field').getByRole('textbox').press('Enter');
    await page.locator('#fieldset-enter-field').getByRole('textbox').press('Enter');
    await page.locator('#multi-one').getByRole('textbox').press('Enter');
    await page.locator('#native-multi-enter-field').getByRole('textbox').press('Enter');
    await page.locator('#prevented-field').getByRole('textbox').press('Enter');
    await page.locator('#window-cancelled-enter-field').getByRole('textbox').press('Enter');
    await page.locator('#formnovalidate-enter-field').getByRole('textbox').press('Enter');
    await page.evaluate(() => window.__closedEnter.field.shadowRoot.querySelector('input').focus());
    await page.keyboard.press('Enter');
    await page.locator('#reparent-enter-field').getByRole('textbox').press('Enter');
    await page.locator('#removal-enter-field').getByRole('textbox').press('Enter');
    await page.locator('#order-enter-field').getByRole('textbox').press('a');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    assert.deepEqual(await page.evaluate(() => window.__enterSubmissions), [
      ['enter-owner', 'external-enter-submit'],
      ['formnovalidate-enter', 'formnovalidate-enter-submit'],
      ['closed-enter', 'closed-enter-submit'],
      ['order-enter', 'order-enter-submit'],
    ], 'Trusted Enter must submit once through an external default submitter, honor formnovalidate, and respect disabled, multi-field, and prevented-keydown cases.');
    assert.deepEqual(await page.evaluate(() => window.__enterOrder), ['change', 'submit'], 'TextField must commit its native change before the trusted Enter submission.');

   await page.getByText('External control').click();
  assert.equal(await control.evaluate((element) => element.checked), true, 'Associated labels must toggle the control.');
  const wrapped = page.locator('#wrapped');
  await wrapped.getByRole('switch', { name: 'Wrapping label' }).click();
  assert.equal(await wrapped.evaluate((element) => element.checked), true, 'An internal pointer click in a wrapping label must toggle exactly once.');
  assert.equal(await page.locator('#associated').getByRole('switch').getAttribute('aria-label'), 'Associated accessible name', 'Associated labels must name a switch without label.');
  await switchButton.press('ArrowLeft');
  await control.evaluate((element) => { element.keyEvents = []; for (const type of ['input', 'change']) element.addEventListener(type, (event) => element.keyEvents.push([type, event.composed])); });
  await switchButton.press('Space'); const afterFirstSpace = await control.evaluate((element) => element.checked);
  await switchButton.press('Space'); const afterSecondSpace = await control.evaluate((element) => element.checked);
  await switchButton.press('ArrowLeft'); const afterOffNoop = await control.evaluate((element) => element.checked);
  await switchButton.press('ArrowRight'); const afterOn = await control.evaluate((element) => element.checked);
  await switchButton.press('ArrowRight'); const afterOnNoop = await control.evaluate((element) => element.checked);
  const keyEvents = await control.evaluate((element) => element.keyEvents);
  assert.deepEqual([afterFirstSpace, afterSecondSpace, afterOffNoop, afterOn, afterOnNoop], [true, false, false, true, true]);
  assert.deepEqual(keyEvents, [['input', true], ['change', true], ['input', true], ['change', true], ['input', true], ['change', true]]);

  await page.locator('#initial-true').getByRole('switch').click();
  await page.locator('#initial-false').getByRole('switch').click();
  await page.evaluate(() => { const control = document.createElement('tc-switch'); control.id = 'dynamic-default'; control.setAttribute('checked', ''); document.querySelector('#defaults').append(control); });
  await page.locator('#dynamic-default').getByRole('switch').click();
  const defaults = await page.evaluate(() => { document.querySelector('#defaults').reset(); return ['initial-true', 'initial-false', 'dynamic-default'].map((id) => document.querySelector(`#${id}`).checked); });
  assert.deepEqual(defaults, [true, false, true], 'Form reset must restore defaults captured at first connection.');

  const sideEffectPage = await browser.newPage();
  await sideEffectPage.goto(`http://127.0.0.1:${address.port}/side-effect.html`);
  await sideEffectPage.waitForFunction(() => customElements.get('tc-switch'));

  const behavior = await control.evaluate((element) => {
    const events = [];
    for (const type of ['input', 'change']) element.addEventListener(type, (event) => events.push([type, event.composed]));
    element.label = 'Runtime label'; element.name = 'runtime'; element.value = ''; element.checked = false;
    const form = document.querySelector('form');
    return { events, programmaticChecked: element.checked, label: element.label, value: element.value, sameConstructor: customElements.get('tc-switch') === element.constructor };
  });
  assert.deepEqual(behavior.events, [], 'Programmatic property changes must not emit input or change.');
  assert.equal(behavior.label, 'Runtime label'); assert.equal(behavior.value, ''); assert.equal(behavior.sameConstructor, true);
  const eventCountBeforePointer = await control.evaluate((element) => element.keyEvents.length);
  await control.getByRole('switch').click();
  assert.deepEqual((await control.evaluate((element) => element.keyEvents)).slice(eventCountBeforePointer), [['input', true], ['change', true]], 'A real pointer interaction emits one input/change pair.');
  const formBehavior = await page.evaluate(() => {
    const form = document.querySelector('#form');
    const fieldset = document.querySelector('#fieldset');
    const control = document.querySelector('#control');
    control.checked = true;
    const emptyValue = new FormData(form).get('runtime');
    control.required = true; control.checked = false;
    const invalid = !form.checkValidity();
    const reportValidityResult = form.reportValidity();
    const buttonFocusedAfterReportValidity = control.shadowRoot.activeElement === control.shadowRoot.querySelector('button');
    control.readOnly = true;
    const readonlyValid = form.checkValidity();
    control.readOnly = false; control.disabled = true;
    const disabledExcluded = !new FormData(form).has('runtime');
    control.disabled = false; fieldset.disabled = true;
    const fieldsetValid = form.checkValidity();
    const fieldsetExcluded = !new FormData(form).has('runtime');
    fieldset.disabled = false;
    return { emptyValue, invalid, reportValidityResult, buttonFocusedAfterReportValidity, readonlyValid, disabledExcluded, fieldsetValid, fieldsetExcluded };
  });
  assert.equal(formBehavior.emptyValue, '', 'An empty checked value must remain a submitted value.');
  assert.equal(formBehavior.invalid, true);
  assert.equal(formBehavior.reportValidityResult, false, 'reportValidity must return false for an invalid switch.');
  assert.equal(formBehavior.buttonFocusedAfterReportValidity, true, 'reportValidity must focus the inner button anchor.');
  assert.equal(formBehavior.readonlyValid, true, 'A readonly unchecked required switch must not remain invalid.');
  assert.equal(formBehavior.disabledExcluded, true);
  assert.equal(formBehavior.fieldsetValid, true);
  assert.equal(formBehavior.fieldsetExcluded, true);
  const labels = await page.evaluate(() => {
    const wrapped = document.querySelector('#wrapped');
    const oldLabel = document.querySelector('#external');
    const control = document.querySelector('#control');
    control.checked = false;
    control.remove();
    oldLabel.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    const oldListenerRemoved = !control.checked;
    document.querySelector('#fieldset').append(control);
    const replacement = oldLabel.cloneNode(true);
    oldLabel.replaceWith(replacement);
    control.remove(); document.querySelector('#fieldset').append(control);
    replacement.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    return { oldListenerRemoved, replacementWorks: control.checked, wrappedChecked: wrapped.checked };
  });
  assert.deepEqual(labels, { oldListenerRemoved: true, replacementWorks: true, wrappedChecked: true }, 'Disconnect/reconnect must remove old label listeners and attach current labels.');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const styles = await control.evaluate((element) => {
    element.readOnly = false; element.checked = true; element.size = 'small'; element.tone = 'secondary';
    element.style.setProperty('--tc-switch-checked', 'rgb(1, 2, 3)');
    const track = element.shadowRoot.querySelector('[part=track]');
    return { background: getComputedStyle(track).backgroundColor, transform: getComputedStyle(track).transform, transition: getComputedStyle(track).transitionDuration };
  });
  assert.equal(styles.background, 'rgb(1, 2, 3)'); assert.notEqual(styles.transform, 'none'); assert.equal(styles.transition, '0s');

  catalogServer = spawn(process.execPath, ['scripts/serve-ui-catalog.mjs'], {
    cwd: root, env: { ...process.env, UI_CATALOG_PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  catalogServer.stdout.on('data', (chunk) => { output += chunk; });
  await once(catalogServer.stdout, 'data');
  const catalogPort = Number(output.match(/127\.0\.0\.1:(\d+)/)?.[1]);
  assert.ok(catalogPort > 0, 'Catalog server must use its requested ephemeral port.');
  const catalogPage = await browser.newPage();
  await catalogPage.goto(`http://127.0.0.1:${catalogPort}/downloads`);
  await catalogPage.waitForSelector('[data-package-download]');
  const downloadRoute = await catalogPage.evaluate(() => ({
    title: document.querySelector('main h1')?.textContent,
    packageHref: document.querySelector('[data-package-download]')?.getAttribute('href'),
    checksumHref: document.querySelector('[data-checksum-download]')?.getAttribute('href'),
    guest: document.querySelector('#guestText')?.textContent,
    ownerInitials: document.querySelector('#guest')?.textContent.includes('MD'),
    navigationHref: document.querySelector('#sideNav a[href="#guidance/download"]')?.getAttribute('href'),
    cards: document.querySelectorAll('.download-guide .card').length,
    background: getComputedStyle(document.body).backgroundColor,
  }));
  assert.deepEqual(downloadRoute, {
    title: 'Descargar la RC web/híbrida verificada',
    packageHref: `/downloads/thiscloud-ui-web-${packageVersion}.tgz`,
    checksumHref: `/downloads/thiscloud-ui-web-${packageVersion}.tgz.sha256`,
    guest: 'Invitado',
    ownerInitials: false,
    navigationHref: '#guidance/download',
    cards: 2,
    background: 'rgb(18, 18, 18)',
  }, 'The public download route must use the catalog shell, localized guest state, and immutable package links.');
  assert.doesNotMatch(await catalogPage.content(), />MD<|:8080/, 'The public download route must not expose owner initials or an internal port.');
  await catalogPage.setViewportSize({ width: 390, height: 844 });
  assert.ok((await catalogPage.locator('#download').boundingBox()).width >= 40, 'The mobile download action must retain a usable target.');
  assert.ok((await catalogPage.locator('#guest').boundingBox()).width >= 40, 'The mobile guest marker must remain visible.');
  assert.equal(await catalogPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'The mobile download route must not overflow the viewport.');
  await catalogPage.locator('#language').click();
  await catalogPage.waitForFunction(() => document.documentElement.lang === 'en');
  assert.deepEqual(await catalogPage.evaluate(() => [document.querySelector('main h1')?.textContent, document.querySelector('#guestText')?.textContent]), ['Download the verified web/hybrid RC', 'Guest'], 'The download guide and guest state must switch to English together.');
  await catalogPage.locator('#language').click();
  await catalogPage.waitForFunction(() => document.documentElement.lang === 'es');
  await catalogPage.setViewportSize({ width: 1280, height: 900 });
  await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/switch`);
  const catalogSwitches = catalogPage.locator('tc-switch');
  assert.equal(await catalogSwitches.count(), 8, 'The Switch route must render its eight SDK-backed examples.');
  assert.equal(await catalogPage.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tc-switch-checked').trim()), '#5946b2', 'Catalog pages must load public SDK tokens.');
  assert.deepEqual(await catalogSwitches.evaluateAll((elements) => elements.map((element) => [element.size, element.tone])), [
    ['small', 'primary'], ['medium', 'primary'], ['large', 'secondary'],
    ['small', 'primary'], ['medium', 'primary'], ['large', 'secondary'],
    ['medium', 'primary'], ['medium', 'primary'],
  ], 'Catalog examples must use the public size and tone API.');
  const catalogStatus = catalogPage.locator('[data-native-input="Switch"] [data-native-status]').first();
  const statusBefore = await catalogStatus.textContent();
  const catalogSwitch = catalogSwitches.first().getByRole('switch');
  await catalogSwitch.click();
  assert.equal(await catalogSwitch.getAttribute('aria-checked'), 'true', 'The obfuscated catalog adapter must load and operate tc-switch.');
  assert.notEqual(await catalogStatus.textContent(), statusBefore, 'Catalog switch input must update its local status.');
  await catalogPage.locator('#language').click();
  await catalogPage.waitForFunction(() => document.documentElement.lang === 'en');
  assert.equal(await catalogPage.locator('tc-switch').count(), 8, 'English Switch documentation must retain the SDK examples.');
  await catalogPage.setViewportSize({ width: 390, height: 844 });
  assert.equal(await catalogPage.locator('tc-switch').count(), 8, 'Mobile Switch documentation must retain the SDK examples.');
  assert.equal(await catalogSwitches.evaluateAll((elements) => elements.every((element) => {
    const track = element.shadowRoot.querySelector('[part=track]').getBoundingClientRect();
    const thumb = element.shadowRoot.querySelector('[part=thumb]').getBoundingClientRect();
    return getComputedStyle(element.shadowRoot.querySelector('[part=track]')).width === '44px'
      && thumb.left >= track.left && thumb.right <= track.right;
  })), true, 'Mobile tracks must retain a 44px layout width and contain their thumbs.');
  await catalogPage.locator('#language').click();
  await catalogPage.waitForFunction(() => document.documentElement.lang === 'es');
  assert.equal(await catalogPage.locator('tc-switch').count(), 8, 'Spanish mobile Switch documentation must retain the SDK examples.');
  await catalogPage.setViewportSize({ width: 1280, height: 900 });
  await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/text-field`);
  const catalogTextFields = catalogPage.locator('tc-text-field');
  assert.equal(await catalogTextFields.count(), 14, 'The TextField route must render public SDK examples for its variants and states.');
  const catalogTextInput = catalogTextFields.first().getByRole('textbox');
  await catalogTextInput.fill('Aurora workspace');
  assert.equal(await catalogTextFields.nth(1).evaluate((element) => element.value), 'Aurora workspace', 'Shared catalog values must remain scoped to their TextField demo group.');
  assert.notEqual(await catalogTextFields.nth(4).evaluate((element) => element.value), 'Aurora workspace', 'TextField demo groups must not leak shared values into sibling examples.');
  assert.equal(await catalogTextFields.nth(3).evaluate((element) => element.type), 'email');
  const catalogAutocomplete = await catalogTextFields.evaluateAll((elements) => elements.map((element) => ({ host: element.autocomplete, input: element.shadowRoot.querySelector('[part=input]').autocomplete })));
  assert.ok(catalogAutocomplete.some(({ host, input }) => host === 'organization' && input === 'organization') && catalogAutocomplete.some(({ host, input }) => host === 'email' && input === 'email'), 'Catalog organization and email autocomplete values must reach native TextField inputs.');
  await catalogPage.locator('#language').click();
  await catalogPage.waitForFunction(() => document.documentElement.lang === 'en');
  assert.equal(await catalogPage.locator('tc-text-field').count(), 14, 'English TextField documentation must retain SDK examples.');
  await catalogPage.setViewportSize({ width: 390, height: 844 });
  assert.equal(await catalogPage.locator('tc-text-field').evaluateAll((elements) => elements.every((element) => element.shadowRoot.querySelector('[part=input]').getBoundingClientRect().width > 0)), true, 'Mobile TextField inputs must retain usable geometry.');
  await catalogPage.locator('#theme').click();
  await catalogPage.locator('#density').click();
  assert.deepEqual(await catalogPage.evaluate(() => [document.documentElement.dataset.theme, document.documentElement.dataset.density]), ['light', 'compact'], 'TextField catalog examples must remain usable in light compact mode.');
  for (const width of [1280, 390]) {
    for (const language of ['en', 'es']) {
      for (const [theme, density] of [['light', 'comfortable'], ['dark', 'compact']]) {
        await catalogPage.setViewportSize({ width, height: 844 });
        if (await catalogPage.evaluate(() => document.documentElement.lang) !== language) {
          await catalogPage.locator('#language').click();
          await catalogPage.waitForFunction((target) => document.documentElement.lang === target, language);
        }
        if (await catalogPage.evaluate(() => document.documentElement.dataset.theme) !== theme) await catalogPage.locator('#theme').click();
        if (await catalogPage.evaluate(() => document.documentElement.dataset.density) !== density) await catalogPage.locator('#density').click();
        const state = await catalogPage.locator('tc-text-field').evaluateAll((elements) => ({
          variants: [...new Set(elements.map((element) => element.variant))].sort(),
          values: elements.filter((element) => element.value).length,
          empty: elements.filter((element) => !element.value).length,
          readonly: elements.filter((element) => element.readOnly).length,
          visible: elements.every((element) => element.shadowRoot.querySelector('[part=input]').getBoundingClientRect().width > 0),
          colors: (() => {
            const filled = elements.find((element) => element.variant === 'filled');
            const readonly = elements.find((element) => element.readOnly);
            const outlined = elements.find((element) => element.variant === 'outlined');
            if (!filled || !readonly || !outlined) return null;
            outlined.value = 'Focused';
            outlined.shadowRoot.querySelector('[part=input]').focus();
            return {
              text: getComputedStyle(filled.shadowRoot.querySelector('[part=input]')).color,
              helper: getComputedStyle(filled.shadowRoot.querySelector('[part=helper]')).color,
              filled: getComputedStyle(filled.shadowRoot.querySelector('[part=input]')).backgroundColor,
              readonly: getComputedStyle(readonly.shadowRoot.querySelector('[part=input]')).backgroundColor,
              notch: getComputedStyle(outlined.shadowRoot.querySelector('[part=label]')).backgroundColor,
            };
          })(),
        }));
        assert.deepEqual(state.variants, ['filled', 'outlined', 'standard'], `All TextField variants must render at ${width}px in ${language}/${theme}/${density}.`);
        assert.ok(state.values > 0 && state.empty > 0 && state.readonly > 0 && state.visible, `TextField value, empty, readonly, and usable input states must render at ${width}px in ${language}/${theme}/${density}.`);
        assert.deepEqual(state.colors, theme === 'dark'
          ? { text: 'rgb(255, 255, 255)', helper: 'rgb(189, 189, 189)', filled: 'rgb(48, 48, 48)', readonly: 'rgb(45, 45, 45)', notch: 'rgb(36, 36, 36)' }
          : { text: 'rgb(33, 33, 33)', helper: 'rgb(97, 97, 97)', filled: 'rgb(238, 238, 238)', readonly: 'rgb(250, 250, 250)', notch: 'rgb(255, 255, 255)' }, `TextField theme bridge must produce readable ${theme} colors at ${width}px in ${language}/${density}.`);
        if (width === 390) {
          await catalogPage.emulateMedia({ reducedMotion: 'reduce' });
          const geometry = await catalogPage.evaluate((language) => {
            const create = (properties) => {
              const field = document.createElement('tc-text-field');
              Object.assign(field, { variant: 'standard', ...properties });
              document.querySelector('#view').append(field);
              return field;
            };
            const helper = create({ label: language === 'en' ? 'Long helper' : 'Ayuda extensa', value: 'value', helper: language === 'en' ? 'This deliberately long English helper wraps on the narrow catalog viewport.' : 'Esta ayuda extensa en español se ajusta en el catálogo angosto.' });
            const error = create({ label: language === 'en' ? 'Long error' : 'Error extenso', required: true, requiredMessage: language === 'en' ? 'This deliberately long English validation message wraps on the narrow catalog viewport.' : 'Este mensaje de validación extenso en español se ajusta en el catálogo angosto.' });
            helper.shadowRoot.querySelector('[part=input]').focus();
            error.touched = true;
            error.sync();
            const helperInput = helper.shadowRoot.querySelector('[part=input]').getBoundingClientRect();
            const helperControl = helper.shadowRoot.querySelector('[part=control]').getBoundingClientRect();
            const helperText = helper.shadowRoot.querySelector('[part=helper]').getBoundingClientRect();
            const errorText = error.shadowRoot.querySelector('[part=error]');
            const errorBackground = (() => {
              let node = errorText;
              while (node) {
                const color = getComputedStyle(node).backgroundColor;
                if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
                node = node.parentElement || node.getRootNode().host;
              }
              return getComputedStyle(document.body).backgroundColor;
            })();
            const contrast = (foreground, background) => {
              const luminance = (color) => color.match(/\d+/g).slice(0, 3).map(Number).map((value) => {
                const channel = value / 255;
                return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
              }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
              const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
              return (light + 0.05) / (dark + 0.05);
            };
            return {
              focused: helper.hasAttribute('data-focused'),
              transform: getComputedStyle(helper.shadowRoot.querySelector('[part=control]'), '::after').transform,
              pseudoBottom: getComputedStyle(helper.shadowRoot.querySelector('[part=control]'), '::after').bottom,
              inputBottom: helperInput.bottom,
              controlBottom: helperControl.bottom,
              helperTop: helperText.top,
              helperHeight: helperText.height,
              errorVisible: !errorText.hidden,
              errorInvalid: error.hasAttribute('data-invalid'),
              errorRole: errorText.getAttribute('role'),
              errorHeight: errorText.getBoundingClientRect().height,
              errorColor: getComputedStyle(errorText).color,
              errorBackground,
              errorContrast: contrast(getComputedStyle(errorText).color, errorBackground),
            };
          }, language);
          assert.ok(geometry.focused && geometry.transform !== 'none' && Math.abs(geometry.inputBottom - geometry.controlBottom) <= 0.5 && geometry.pseudoBottom === '0px', `Standard focus line must anchor to the input bottom at 390px in ${language}.`);
          assert.ok(geometry.helperTop >= geometry.inputBottom && geometry.helperHeight > 20 && geometry.errorVisible && geometry.errorInvalid && geometry.errorRole === 'alert' && geometry.errorHeight > 20 && geometry.errorContrast >= 4.5, `Multiline visible error text must remain invalid, announced, and contrast-safe at 390px in ${language}.`);
        }
        const focused = catalogPage.locator('tc-text-field').first().getByRole('textbox');
        await focused.focus();
        assert.equal(await catalogPage.locator('tc-text-field').first().evaluate((element) => element.hasAttribute('data-focused')), true, 'Catalog TextField focus must remain visible across catalog modes.');
      }
    }
    }
    await catalogPage.setViewportSize({ width: 1280, height: 900 });
    await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/field`);
    await catalogPage.waitForSelector('.field-demo tc-text-field');
    assert.equal(await catalogPage.evaluate(() => document.querySelectorAll('[data-field-control], .field-control').length), 0, 'Field documentation must use public TextField controls rather than duplicate native field markup.');
    assert.ok(await catalogPage.locator('.field-demo tc-text-field').count() > 0, 'Field documentation must render public SDK controls.');
    for (const [route, signature, boundary] of [
      ['field', 'ValidationControl', 'type contract'],
      ['form', 'attachFormValidation(nativeForm, options)', 'native form helper'],
    ]) {
      await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/${route}`);
      assert.deepEqual(await catalogPage.evaluate(() => ({
        badges: [...document.querySelectorAll('.page-head > .row .pill')].slice(0, 2).map((node) => node.textContent),
        api: document.querySelector('#doc-api .card-body > p').textContent,
      })), { badges: [signature, boundary], api: `${signature} · ${boundary}` }, 'Field and Form documentation must show only their actual public web API boundary.');
    }
    await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/form`);
    let catalogForm = catalogPage.locator('[data-form-demo]').first();
    await catalogForm.waitFor();
    assert.deepEqual(await catalogForm.evaluate((form) => ({ noValidate: form.noValidate, textFields: form.querySelectorAll('tc-text-field').length, switches: form.querySelectorAll('tc-switch').length })), { noValidate: true, textFields: 2, switches: 1 }, 'The Form demo must retain an explicit managed native-form boundary with SDK controls.');
    let catalogSummary = catalogForm.locator('[data-form-summary]');
    await catalogForm.locator('button[type="submit"].primary').click();
    assert.equal(await catalogSummary.getAttribute('data-invalid'), 'true', 'Invalid managed catalog submission must expose a local invalid summary.');
    for (const width of [390, 1280]) {
      for (const theme of ['dark', 'light']) {
        for (const language of ['en', 'es']) {
          await catalogPage.setViewportSize({ width, height: 844 });
          if (await catalogPage.evaluate(() => document.documentElement.dataset.theme) !== theme) await catalogPage.locator('#theme').click();
          if (await catalogPage.evaluate(() => document.documentElement.lang) !== language) await catalogPage.locator('#language').click();
          await catalogPage.waitForFunction((target) => document.documentElement.lang === target, language);
          await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/form`);
          await catalogPage.locator('[data-form-demo]').first().locator('button[type="submit"].primary').click();
          const visual = await catalogPage.evaluate(() => {
            const ratio = (foreground, background) => {
              const luminance = (color) => color.match(/\d+/g).slice(0, 3).map(Number).map((value) => {
                const channel = value / 255;
                return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
              }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
              const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
              return (light + .05) / (dark + .05);
            };
            const background = (node) => {
              while (node) { const color = getComputedStyle(node).backgroundColor; if (color !== 'rgba(0, 0, 0, 0)') return color; node = node.parentElement || node.getRootNode().host; }
            };
            const summary = document.querySelector('[data-form-summary]');
            const switchError = document.querySelector('tc-switch').shadowRoot.querySelector('[part=error]');
            return { summary: [getComputedStyle(summary).color, ratio(getComputedStyle(summary).color, background(summary))], switch: [getComputedStyle(switchError).color, ratio(getComputedStyle(switchError).color, background(switchError))] };
          });
          assert.ok(visual.summary[1] >= 4.5 && visual.switch[1] >= 4.5, `Visible form validation text must meet 4.5 contrast at ${width}px in ${language}/${theme}: ${JSON.stringify(visual)}.`);
        }
      }
    }
    await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/form`);
    catalogForm = catalogPage.locator('[data-form-demo]').first();
    catalogSummary = catalogForm.locator('[data-form-summary]');
    await catalogForm.locator('button[type="submit"].primary').click();
    await catalogForm.locator('tc-text-field').nth(0).getByRole('textbox').fill('Aurora');
    await catalogForm.locator('tc-text-field').nth(1).getByRole('textbox').fill('owner@example.com');
    await catalogForm.locator('tc-switch').getByRole('switch').click();
    await catalogForm.locator('button[type="submit"].primary').click();
    assert.equal(await catalogSummary.getAttribute('data-invalid'), 'false', 'Valid managed catalog submission must be accepted locally.');
    await catalogForm.getByRole('button', { name: /without validation|sin validar/i }).click();
    assert.equal(await catalogSummary.getAttribute('data-invalid'), 'false', 'A skipped catalog submission must not be labelled invalid.');
    const detachedSummary = await catalogSummary.elementHandle();
    const detachedState = await detachedSummary.evaluate((node) => ({ hidden: node.hidden, text: node.textContent }));
    await catalogPage.evaluate(() => {
      document.querySelector('[data-form-demo]').reset();
      history.replaceState(null, '', '#component/form');
      window.render();
    });
    await catalogPage.waitForTimeout(0);
    assert.deepEqual(await detachedSummary.evaluate((node) => ({ hidden: node.hidden, text: node.textContent })), detachedState, 'Replacing the catalog view must dispose the old form controller before its pending reset callback can mutate detached summary UI.');
    catalogForm = catalogPage.locator('[data-form-demo]').first();
    catalogSummary = catalogForm.locator('[data-form-summary]');
    await catalogForm.getByRole('button', { name: /reset|restablecer/i }).click();
    await catalogSummary.waitFor({ state: 'hidden' });
    assert.equal(await catalogSummary.isHidden(), true, 'An uncancelled catalog reset must clear the local summary after defaults restore.');
    for (const width of [1280, 390]) {
      for (const language of ['en', 'es']) {
        await catalogPage.setViewportSize({ width, height: 844 });
        if (await catalogPage.evaluate(() => document.documentElement.lang) !== language) {
          await catalogPage.locator('#language').click();
          await catalogPage.waitForFunction((target) => document.documentElement.lang === target, language);
        }
        await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/field`);
        const fieldInput = catalogPage.locator('.field-demo tc-text-field').first().getByRole('textbox');
        assert.ok((await fieldInput.boundingBox()).width > 0, `Field SDK controls must remain usable at ${width}px in ${language}.`);
        await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/form`);
        const responsiveForm = catalogPage.locator('[data-form-demo]').first();
        await responsiveForm.locator('button[type="submit"].primary').click();
        assert.equal(await responsiveForm.locator('[data-form-summary]').getAttribute('data-invalid'), 'true', `Form validation must remain visible at ${width}px in ${language}.`);
      }
    }
    const catalogAssertions = await catalogPage.evaluate(() => window.ThiscloudCatalog.assertions);
    assert.deepEqual(catalogAssertions.actualPublicRoutes, ['switch', 'text-field', 'field', 'form'], 'The catalog must expose exactly four actual public API routes.');
    assert.equal(catalogAssertions.demoOnlyCount, 67, 'The catalog must expose 67 demo-only routes.');
    assert.equal((await catalogPage.evaluate(() => window.ThiscloudCatalog.records)).length, 71, 'The catalog must expose all 71 routes.');
    const actualApi = {
      switch: ['TcSwitch', '<tc-switch>'],
      'text-field': ['TcTextField', '<tc-text-field>'],
      field: ['ValidationControl', 'type contract'],
      form: ['attachFormValidation(nativeForm, options)', 'native form helper'],
    };
    for (const language of ['en', 'es']) {
      if (await catalogPage.evaluate(() => document.documentElement.lang) !== language) await catalogPage.locator('#language').click();
      for (const record of await catalogPage.evaluate(() => window.ThiscloudCatalog.records)) {
        await catalogPage.goto(`http://127.0.0.1:${catalogPort}/framework-preview.html#component/${record.slug}`);
        const text = await catalogPage.locator('.component-layout').textContent();
        if (catalogAssertions.actualPublicRoutes.includes(record.slug)) {
          const [identity, boundary] = actualApi[record.slug];
          const renderedApi = await catalogPage.evaluate(() => ({
            badges: [...document.querySelectorAll('.page-head > .row .pill')].slice(0, 2).map((node) => node.textContent),
            api: document.querySelector('#doc-api .card-body > p').textContent,
          }));
          assert.deepEqual(renderedApi.badges, [identity, boundary], `${language}/${record.slug} must show its actual RC API badges.`);
          assert.ok(renderedApi.api.includes(identity) && renderedApi.api.includes(boundary), `${language}/${record.slug} must show its actual RC API section.`);
          continue;
        }
        assert.match(text, /design demo|demostración de diseño/i, `${language}/${record.slug} must show the demo-only boundary.`);
        assert.doesNotMatch(text, new RegExp(`Tc${record.name}|tc\\.ui\\.${record.slug}`), `${language}/${record.slug} must not fabricate a public API.`);
      }
    }
} finally {
  if (catalogServer && !catalogServer.killed) {
    catalogServer.kill();
    await once(catalogServer, 'exit');
  }
  await browser?.close();
  if (server?.listening) await new Promise((resolveServer) => server.close(resolveServer));
  await rm(temp, { recursive: true, force: true });
}

console.log('UI web packed browser consumer verification passed.');
