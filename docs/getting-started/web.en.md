# Get started with the web library

[Español](web.md) · [Documentation index](../README.en.md)

Use the catalog to explore demonstrations or install a locally generated tarball to try `@thiscloud/ui-web` in your own application. These are separate paths: the catalog does not install the package, and the `0.1.0-rc.5` tarball is not a public release.

## Before you begin

- From the repository root: Node.js 22, pnpm 11.13.1, existing dependencies, and Chrome/Chromium for the automated package check. Building does not install dependencies; if they are missing, stop and resolve the environment separately.
- To integrate the package: a web application with a bundler that resolves JavaScript and CSS imports, and a browser with Custom Elements and Shadow DOM. Form-associated selection controls require form-associated custom elements and `ElementInternals`; verify these capabilities in every target browser or WebView.
- Cross-browser compatibility is not guaranteed, nor is manual assistive-technology evaluation claimed here. The automated package matrix uses Chromium.

## Path 1: view the local catalog

At the **repository root**, with dependencies present:

```bash
pnpm ui-catalog:build
pnpm ui-catalog:serve
```

Open `http://127.0.0.1:8095/framework-preview.html` on the same machine. Expect a bilingual catalog with six verified API boundaries and 65 design demonstrations; those demonstrations are not 65 published components. If port 8095 is already in use, reuse the existing instance or choose another with `UI_CATALOG_PORT` before starting the server; do not start a second instance on the same port.

## Path 2: try the package in an application

At the **repository root**, with dependencies present, prepare the local archive and its checksum:

```bash
pnpm release:prepare
```

Expect `tmp/release/thiscloud-ui-web-0.1.0-rc.5.tgz` and its `.sha256` file. This is a Git-ignored local artifact, not a public `rc.5` download. Copy the `.tgz` into your consumer application's working directory. From **that directory**, with pnpm configured:

```bash
pnpm add ./thiscloud-ui-web-0.1.0-rc.5.tgz
```

In that application's bundler-processed JavaScript entry point:

```js
import '@thiscloud/ui-web';
import '@thiscloud/ui-web/tokens.css';
```

In the HTML loaded by that entry point:

```html
<tc-checkbox name="terms" label="Accept terms" value="accepted" required></tc-checkbox>
<tc-radio name="environment" value="production" label="Production"></tc-radio>
<tc-switch name="notifications" label="Notifications"></tc-switch>
<tc-text-field name="organization" label="Organization"></tc-text-field>
```

When the application loads in a compatible browser, `tc-checkbox`, `tc-radio`, `tc-switch`, and `tc-text-field` should be defined. The other two verified boundaries are the `ValidationControl` TypeScript type and the `attachFormValidation` helper; they are not additional HTML tags. See the [package guide](../../packages/ui-web/README.md) for control behavior and the [native form validation guide](../guides/native-form-validation.en.md) for integrating the helper with a form.

## Limits and troubleshooting

| Symptom | Check |
| --- | --- |
| `pnpm` or the build fails because dependencies are missing | Use Node.js 22 and pnpm 11.13.1; this path assumes local dependencies and does not run a repository install. |
| The CSS import or package name cannot be resolved | Run `pnpm add` in the consumer application and use a bundler supporting the package's `.` and `./tokens.css` exports. |
| The tag renders without behavior | Confirm that the side-effect import of `@thiscloud/ui-web` ran and the browser supports Custom Elements and Shadow DOM. |
| A selection control fails during validation | Check form-associated custom elements and `ElementInternals` in the target browser/WebView; do not assume universal support. |

`@thiscloud/ui-web` is marked `private: true` in this `0.1.0-rc.5` checkout. The [main README](../../README.en.md) distinguishes the earlier public `rc.1` from this local candidate; do not install `rc.5` from a registry or treat the catalog as proof of publication. Flutter and the other demonstration routes are outside the verified web contract.
