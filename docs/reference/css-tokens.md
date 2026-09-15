# Tokens CSS del paquete web

[English](css-tokens.en.md) · [Índice de documentación](../README.md)

Esta referencia cubre únicamente las propiedades personalizadas exportadas por `@thiscloud/ui-web/tokens.css`. Los valores corresponden a la revisión validada `0.1.0-rc.3` del repositorio.

## Camino mínimo

Importa los tokens antes de tus personalizaciones:

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

Las propiedades personalizadas heredan hacia el Shadow DOM. Una definición en `:root` afecta a todos los controles; una definición en un contenedor o en el propio elemento limita el alcance.

## Contrato exportado

| Token | Valor o fallback predeterminado | Uso actual |
| --- | --- | --- |
| `--tc-control-height` | `44px` | Altura mínima interactiva del switch |
| `--tc-space-3` | `12px` | Separación entre switch y etiqueta |
| `--tc-focus` | `#bb86fc` | Anillo de foco visible del switch |
| `--tc-text` | `var(--text, currentColor)` | Texto del campo |
| `--tc-text-muted` | `var(--muted, #666)` | Etiqueta, ayuda y acción de limpieza |
| `--tc-switch-track` | `#616161` | Pista sin activar |
| `--tc-switch-thumb` | `#fff` | Pulgar del switch |
| `--tc-switch-checked` | `#5946b2` | Pista activada con tono primario |
| `--tc-switch-secondary` | `#42a5f5` | Pista activada con `tone="secondary"` |
| `--tc-switch-small-scale` | `.82` | Escala de pista con `size="small"` |
| `--tc-switch-large-scale` | `1.18` | Escala de pista con `size="large"` |
| `--tc-field-line` | `var(--line, #767676)` | Borde o línea del campo |
| `--tc-field-focus` | `var(--focus, #5946b2)` | Borde y etiqueta con foco |
| `--tc-field-error` | `var(--tc-catalog-field-error, var(--bad, #b3261e))` | Error del campo y switch |
| `--tc-field-filled` | `var(--field, #f1eff8)` | Fondo de `variant="filled"` |
| `--tc-field-readonly` | `var(--raised, #eee)` | Fondo de sólo lectura |
| `--tc-field-surface` | `var(--surface, #fff)` | Superficie detrás de la etiqueta outlined |

Los nombres `--text`, `--muted`, `--line`, `--focus`, `--bad`, `--field`, `--raised`, `--surface` y `--tc-catalog-field-error` son fallbacks de integración, no tokens exportados por este paquete. Define primero el token `--tc-*` cuando necesites un contrato estable.

## Alcance y estados

- `tone="secondary"` usa `--tc-switch-secondary`; otros valores conservan el tono primario.
- `size="small"` y `size="large"` escalan la pista. La altura mínima interactiva sigue controlada por `--tc-control-height`.
- Los estados `disabled`, `readonly`, inválido y foco aplican opacidad o color sobre estos tokens; no requieren una hoja de tema separada.
- `prefers-reduced-motion: reduce` elimina las transiciones de los dos controles publicados.

## Límites y evidencia

Variables internas presentes sólo en el CSS de un componente no forman parte de esta referencia. Agregar o cambiar un token exportado requiere actualizar esta página, su par inglés, el changelog y la evidencia de paquete en la misma unidad de trabajo.

La fuente ejecutable es [`packages/ui-web/src/tokens.css`](../../packages/ui-web/src/tokens.css). `pnpm ui-web:test` construye el paquete y prueba sus estilos desde un consumidor empaquetado en Chromium; no certifica contraste de una paleta personalizada.
