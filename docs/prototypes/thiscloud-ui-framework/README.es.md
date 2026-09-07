# Prototipo de documentación de Thiscloud UI

El prototipo en vivo ofrece una superficie completa de documentación en inglés/español para el lenguaje UI de Center Aurora: cuatro rutas de API RC verificadas y 67 rutas de demostración de diseño, iconografía semántica, demostraciones y detalles visibles, navegación directa y un explorador local de Material Symbols Rounded.

## Recorrido rápido de revisión

1. Abrir Explorar y comparar las siete categorías de origen.
2. Revise `BreakpointProvider`, `Container`, `Grid` y `Hidden`; cada referencia expone anatomía, uso, API, accesibilidad, demostraciones, variantes y estados específicos de fundamentos.
3. Abrir el explorador de iconos y buscar `rocket_launch` o `zoom_out_map`; seleccionar un token para revisar cinco matrices y 24 combinaciones prácticas.
4. Abrir Estado de construcción para consultar el registro vivo de etapas y el límite de verificación.

## Arquitectura, rutas y recursos

- `framework-preview.html` es el renderizador local con rutas hash y la carcasa interactiva.
- `catalog.css` contiene estilos fuente legibles; `catalog.js` contiene el comportamiento fuente legible.
- `assets/i18n/en.json` y `assets/i18n/es.json` son las fuentes de locale isomorfas. El español es el idioma de primera visita; se restaura la preferencia local explícita.
- Las rutas de componentes usan `#component/<slug>`; las de categorías, `#category/<slug>`; las de guía, `#guidance/<slug>`; los iconos usan `#icons` y `#icons/<token>`.
- La fuente local, los metadatos de iconos y los recursos de licencia permanecen intactos y nunca se descargan de forma remota.

## Compilación y verificación local

Desde la raíz del repositorio, instale las dependencias locales fijadas y use uno de estos comandos:

```bash
pnpm install
pnpm ui-catalog:dev-build
pnpm ui-catalog:build
pnpm ui-catalog:verify
pnpm ui-catalog:serve
```

- `ui-catalog:dev-build` crea salida de diagnóstico legible y sin minificar en `dist/`.
- `ui-catalog:build` minifica CSS y JavaScript, y luego ofusca el JavaScript de producción con una semilla fija. No genera mapas de código fuente.
- `ui-catalog:serve` expone únicamente `dist/` generado en el puerto loopback `8095` de forma predeterminada; use `UI_CATALOG_PORT` para elegir otro puerto.
- `dist/` es generado e ignorado. La ofuscación eleva el costo de la inspección casual, pero no brinda seguridad; el código cliente nunca debe contener secretos.

## Reglas de contenido bilingüe

Cada texto visible para la persona usuaria se obtiene del locale activo. Inglés y español se renderizan con las mismas funciones de ruta; el cambio actualiza el contenido visible, `<html lang>`, etiquetas, placeholders, título, estados, interfaz de iconos, diálogo, toast y búsqueda.

Los identificadores técnicos canónicos permanecen invariantes. Solo Switch, TextField, Field y Form tienen identidades de API RC; las rutas de demostración no tienen una API `Tc*` ni `tc.ui.*`.

## Invariantes intencionales

La marca `Thiscloud UI` y `Center Aurora`, los nombres canónicos de componentes (`ButtonFab`, `TextField`), las API `Tc*` y `tc.ui.*`, los tokens de iconos, los fragmentos de código, los ejes `FILL`/`wght`/`GRAD`/`opsz`, los nombres de archivo y los valores numéricos no se traducen. También permanecen invariantes los nombres de fuentes y los identificadores de ruta.

## Etapa actual y cobertura

- Etapa 1 — IA y catálogo de componentes con 71 rutas: completada.
- Etapa 2 — documentación bilingüe, iconos semánticos, gráficos, fundamentos adaptables,
  distribución del catálogo, lotes visuales Divider, Highlighter, Image, Link, Paper, Skeleton,
  ScrollToTop, SwipeArea, FocusTrap, Element, Typography, los cinco lotes de Inputs/Forms, el lote de
     detalle del componente Radio, el lote de detalle DropZone/FileUpload, el lote Button/ButtonFab/ButtonGroup
     y el lote IconButton/ToggleIconButton/Toolbar:
       el lote de detalle Checkbox/Switch/Slider, el lote de detalle Field/TextField/Form
       y el lote de detalle Breadcrumbs/Pagination/Tabs:
         el lote de detalle ColorPicker/DatePicker/TimePicker y el lote de detalle AppBar/Drawer/NavMenu:
         el lote de detalle List/Menu/TreeView:
         completados; quedan pendientes otros lotes.
           Lote de detalle Carousel/ExpansionPanels: completado con wrap manual y despliegues independientes.
           Lote de detalle Avatar/Badge/Card: completado con demos bilingües, semánticas y acciones locales.
            Lote de detalle Icons/Rating: completado con semántica de iconos locales y puntuaciones con radios nativos.
             Lote de detalle Alert/Progress/Snackbar: completado con estados localizados, progress nativo
             y recuperación local.
              Lote de detalle Dialog/MessageBox/Overlay: completado con foco modal nativo, resultados de
              alertdialog interruptivo y semántica de capa busy acotada.
                Lote de detalle Popover/Tooltip: completado con cierre ligero nativo del popover auto y
                comportamiento aislado del tooltip al enfocar o pasar el puntero.
                 Lote de detalle DataGrid: completado con encabezados ordenables, un punto de tabulación roving,
                 selección de una fila, anuncios localizados y navegación de teclado acotada al wrapper.
                 Lote de detalle SimpleTable/Table: completado con tablas nativas pasivas, captions, scopes explícitos,
                 wrappers con nombre para scroll local y significado textual de estados.
                 Lote de detalle Timeline: completado con eventos nativos ordenados, títulos locales, fechas completas,
                 un paso actual y estados textuales independientes del color.
                  Lote de detalle BarChart/DonutChart/LineChart/PieChart/StackedBarChart: completado con visuales
                  con nombre, leyendas localizadas y datos equivalentes nativos cerrados por defecto.
- Etapa 3 — API RC web/híbrida: cuatro rutas (`TcSwitch`/`<tc-switch>`, `TcTextField`/`<tc-text-field>`, `ValidationControl` y `attachFormValidation(nativeForm, options)`); las otras 67 rutas siguen siendo demostraciones de diseño. La implementación Flutter queda diferida.
- Cobertura: 71 componentes; siete categorías con cantidades 15 / 6 / 17 / 11 / 5 / 8 / 9; 4.275 tokens oficiales de iconos / 3.975 codepoints únicos; locales EN y ES.

## Lista de verificación local

- Analizar ambos JSON y comparar rutas recursivas de claves y formas de valores.
- Confirmar las 71 claves canónicas de componentes en ambos locales y recorrer cada ruta en los dos idiomas.
- Probar Explorar, todas las categorías, todos los destinos de guía, Iconos, rutas directas, cambio de idioma, búsqueda, diálogo, toast, tema, densidad, navegación móvil y anchos adaptables.
- Confirmar metadatos de iconos, búsquedas, cinco matrices, 24 combinaciones, solicitudes solo locales, ausencia de errores de consola, IDs duplicados y desbordamiento horizontal.
- Enfocar List/Menu/TreeView en lista nativa, menú APG y nodos visibles del árbol en ambos idiomas.
- Enfocar Carousel/ExpansionPanels en una diapositiva visible, controles con wrap y despliegues nativos independientes.
 - Enfocar Avatar/Badge/Card en avatares con nombre o decorativos, badges contextuales y cards article
   sin controles interactivos anidados.
 - Enfocar Icons/Rating en nombres de iconos decorativos e informativos, fallback textual visible,
   teclado de radios nativos, valores de solo lectura, estados deshabilitados y rerenderizados aislados.
  - Enfocar Alert/Progress/Snackbar en anuncios pasivos frente a urgentes, progress determinado e
    indeterminado, finalización explícita, estado cortés oculto de snackbar y foco lógico de Undo.
   - Enfocar Dialog/MessageBox/Overlay en contención y restauración de foco nativas, decisiones
     alertdialog menos destructivas y contenido busy/inert acotado sin declaraciones modales.
     - Enfocar Popover/Tooltip en cierre ligero nativo, estado sincronizado del disparador, referencias
       descriptivas, foco lógico y contenido complementario no interactivo.
     - Enfocar DataGrid en encabezados ordenables, navegación con flechas/Home, Control+Home/End,
       selección única, aria-sort/aria-selected veraces, conservación del foco y revelado horizontal acotado.
     - Enfocar SimpleTable/Table en captions, relaciones de encabezados de columna y fila, semántica pasiva,
       wrappers con foco y scroll local, y ausencia de desbordamiento del documento/barra lateral.
     - Enfocar Timeline en semántica de lista ordenada, jerarquía de títulos, valores time completos, un paso,
       marcadores decorativos ocultos, estados textuales y legibilidad en anchos estrechos.
       - Enfocar los gráficos en un nombre role=img, details/tabla nativos, datos exactos, controles de teclado
         y puntero, exposición cerrada y tablas abiertas utilizables en anchos estrechos.
- Compilar con `pnpm ui-catalog:dev-build` o `pnpm ui-catalog:build` y luego usar `pnpm ui-catalog:serve` para ver `dist/framework-preview.html`. No servir el HTML fuente ni usar `file://`: los locales, los recursos SDK generados y las fuentes son salidas relativas de compilación.

## Estándar de aceptación adaptable y de espaciado

Cada lote futuro de componentes debe verificar los anchos 390, 768/800, 1024, 1280, 1440, 1600, 1920 y 2560; el ajuste de acciones relacionadas; cero desbordamiento horizontal del documento y la barra lateral sin ocultamiento global; el espaciado calculado cómodo/compacto; la distribución centrada de artículo y TOC; y objetivos visibles mínimos de 40px para botones, navegación y controles. Los lotes de iconos, gráficos y fundamentos adaptables siguen siendo trabajo documental; la WU-03 no comenzó.

## Próximo límite

Este artefacto RC1 documenta una vista previa web/híbrida. No declara API para las 67 demostraciones de diseño ni implementa controles Flutter/nativos.
