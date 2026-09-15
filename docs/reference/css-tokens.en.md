# Web package CSS tokens

[Español](css-tokens.md) · [Documentation index](../README.en.md)

This reference covers only the custom properties exported by `@thiscloud/ui-web/tokens.css`. Values match the repository-validated `0.1.0-rc.3` revision.

## Shortest path

Import the tokens before your overrides:

```js
import '@thiscloud/ui-web/tokens.css';
```

```css
:root {
  --tc-field-focus: #185abc;
  --tc-switch-checked: #185abc;
}

.danger-zone {
  --tc-field-error: #a61b1b;
}
```

Custom properties inherit into Shadow DOM. A definition on `:root` affects every control; a definition on a container or on the element itself limits its scope.

## Exported contract

| Token | Default value or fallback | Current use |
| --- | --- | --- |
| `--tc-control-height` | `44px` | Minimum interactive switch height |
| `--tc-space-3` | `12px` | Gap between switch and label |
| `--tc-focus` | `#bb86fc` | Visible switch focus ring |
| `--tc-text` | `var(--text, currentColor)` | Field text |
| `--tc-text-muted` | `var(--muted, #666)` | Label, helper, and clear action |
| `--tc-switch-track` | `#616161` | Unchecked track |
| `--tc-switch-thumb` | `#fff` | Switch thumb |
| `--tc-switch-checked` | `#5946b2` | Checked track with primary tone |
| `--tc-switch-secondary` | `#42a5f5` | Checked track with `tone="secondary"` |
| `--tc-switch-small-scale` | `.82` | Track scale with `size="small"` |
| `--tc-switch-large-scale` | `1.18` | Track scale with `size="large"` |
| `--tc-field-line` | `var(--line, #767676)` | Field border or line |
| `--tc-field-focus` | `var(--focus, #5946b2)` | Focused border and label |
| `--tc-field-error` | `var(--tc-catalog-field-error, var(--bad, #b3261e))` | Field and switch errors |
| `--tc-field-filled` | `var(--field, #f1eff8)` | `variant="filled"` background |
| `--tc-field-readonly` | `var(--raised, #eee)` | Read-only background |
| `--tc-field-surface` | `var(--surface, #fff)` | Surface behind an outlined label |

The names `--text`, `--muted`, `--line`, `--focus`, `--bad`, `--field`, `--raised`, `--surface`, and `--tc-catalog-field-error` are integration fallbacks, not tokens exported by this package. Define the `--tc-*` token first when you need a stable contract.

## Scope and states

- `tone="secondary"` uses `--tc-switch-secondary`; other values retain the primary tone.
- `size="small"` and `size="large"` scale the track. `--tc-control-height` continues to control the minimum interactive height.
- Disabled, read-only, invalid, and focus states apply opacity or color over these tokens; they require no separate theme sheet.
- `prefers-reduced-motion: reduce` removes transitions from both published controls.

## Limits and evidence

Internal variables found only in component CSS are outside this reference. Adding or changing an exported token requires updating this page, its Spanish pair, the changelog, and package evidence in the same work unit.

The executable source is [`packages/ui-web/src/tokens.css`](../../packages/ui-web/src/tokens.css). `pnpm ui-web:test` builds the package and tests its styles from a packed Chromium consumer; it does not certify contrast for a custom palette.
