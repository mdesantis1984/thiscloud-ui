# Thiscloud UI documentation prototype

The live prototype provides a complete English/Spanish documentation surface for the Center Aurora UI language: four verified RC API routes and 67 design-demo routes, semantic component iconography, visible demos/details, direct navigation, and a local Material Symbols Rounded explorer.

## Quick review path

1. Open Explore and compare the seven source categories.
2. Review `BreakpointProvider`, `Container`, `Grid`, and `Hidden`; each reference exposes foundation-specific anatomy, usage, API, accessibility, demos, variants, and states.
3. Open Icons and search `rocket_launch` or `zoom_out_map`; select a token to inspect five matrices and 24 practical combinations.
4. Open Build status for the living stage record and verification boundary.

## Architecture, routes, and assets

- `framework-preview.html` is the local hash-routed renderer and interaction shell.
- `catalog.css` contains readable source styles; `catalog.js` contains readable source behavior.
- `assets/i18n/en.json` and `assets/i18n/es.json` are the isomorphic locale sources. Spanish is the first-visit default; an explicit local preference is restored.
- Component routes use `#component/<slug>`; category routes use `#category/<slug>`; guidance uses `#guidance/<slug>`; icons use `#icons` and `#icons/<token>`.
- Local font, icon metadata, and font license assets remain unchanged and are never fetched remotely.

## Local build and verification

From the repository root, install the pinned local dependencies and use one of these commands:

```bash
pnpm install
pnpm ui-catalog:dev-build
pnpm ui-catalog:build
pnpm ui-catalog:verify
pnpm ui-catalog:serve
```

- `ui-catalog:dev-build` creates readable, unminified diagnostic output in `dist/`.
- `ui-catalog:build` minifies CSS and JavaScript, then obfuscates the production JavaScript with a fixed seed. It does not emit source maps.
- `ui-catalog:serve` exposes only generated `dist/` on loopback port `8095` by default; set `UI_CATALOG_PORT` to choose another port.
- `dist/` is generated and ignored. Obfuscation raises the cost of casual inspection but does not provide security; client code must never contain secrets.

## Bilingual content rules

Every user-facing string is read from the active locale content. English and Spanish are rendered together through the same route functions; toggling updates visible copy, `<html lang>`, labels, placeholders, title, status names, icon UI, dialog, toast, and search behavior.

Canonical technical identifiers remain invariant. Only Switch, TextField, Field, and Form have RC API identities; demo routes intentionally have no `Tc*` or `tc.ui.*` API.

## Intentional invariants

The `Thiscloud UI` and `Center Aurora` brands, canonical component names (`ButtonFab`, `TextField`), `Tc*` and `tc.ui.*` APIs, icon tokens, code snippets, `FILL`/`wght`/`GRAD`/`opsz` axes, file names, and numeric values are intentionally not translated. Font names and route identifiers also remain invariant.

## Current stage and coverage

- Stage 1 — IA and the 71-route component catalog: completed.
- Stage 2 — bilingual documentation, semantic icons, five-chart detail, responsive foundation,
  catalog-layout, visual-foundation batches for Divider, Highlighter, Image, Link, Paper, Skeleton,
  ScrollToTop, SwipeArea, FocusTrap, Element, Typography, all five Inputs/Forms slices, the Radio
   component-detail slice, the DropZone/FileUpload detail slice, the Button/ButtonFab/ButtonGroup detail slice,
   and the IconButton/ToggleIconButton/Toolbar detail slice:
   the Checkbox/Switch/Slider detail slice, the Field/TextField/Form detail slice,
   and the Breadcrumbs/Pagination/Tabs detail slice:
     the ColorPicker/DatePicker/TimePicker detail slice, and the AppBar/Drawer/NavMenu detail slice:
     the List/Menu/TreeView detail slice:
     completed; remaining detail batches are pending.
      Carousel/ExpansionPanels detail slice: completed with manual wrap behavior and independent disclosures.
      Avatar/Badge/Card detail slice: completed with bilingual, semantic demos and local actions.
       Icons/Rating detail slice: completed with local icon semantics and native radio ratings.
        Alert/Progress/Snackbar detail slice: completed with localized status semantics, native progress,
        and local recovery actions.
         Dialog/MessageBox/Overlay detail slice: completed with native modal focus behavior, interruptive
         alertdialog outcomes, and bounded busy-layer semantics.
           Popover/Tooltip detail slice: completed with native auto popover light dismiss and isolated
           hover/focus tooltip behavior.
           DataGrid detail slice: completed with sortable headers, one roving tab stop, single-row selection,
           localized announcements, and wrapper-scoped keyboard navigation.
           SimpleTable/Table detail slice: completed with passive native tables, captions, explicit header scopes,
           named local scrolling wrappers, and textual status meaning.
            Timeline detail slice: completed with ordered native events, local headings, complete machine-readable
             dates, one current step, and textual non-color status.
             BarChart/DonutChart/LineChart/PieChart/StackedBarChart detail slice: completed with named visuals,
             localized legends, and native closed-by-default equivalent-data disclosures.
- Stage 3 — web/hybrid RC API: four routes (`TcSwitch`/`<tc-switch>`, `TcTextField`/`<tc-text-field>`, `ValidationControl`, and `attachFormValidation(nativeForm, options)`); the other 67 routes remain design demos. Flutter implementation is deferred.
- Coverage: 71 components; seven categories with counts 15 / 6 / 17 / 11 / 5 / 8 / 9; 4,275 official icon tokens / 3,975 unique codepoints; EN and ES locales.

## Local validation checklist

- Parse both JSON files and compare recursive key paths and value shapes.
- Confirm all 71 canonical component keys exist in both locales and exercise every route in both languages.
- Exercise Explore, all categories, all guidance destinations, Icons, direct icon routes, language toggle, search, dialog, toast, theme, density, mobile navigation, and responsive widths.
- Confirm icon metadata, searches, five matrices, 24 combinations, local-only requests, no console errors, no duplicate IDs, and no horizontal overflow.
- Focus List/Menu/TreeView checks on native list, APG menu, and visible-node tree behavior in both locales.
- Focus Carousel/ExpansionPanels on visible slides, wrapped controls, and independent disclosures.
 - Focus Avatar/Badge/Card on named or decorative avatars, contextual badges, and article cards
   without nested interactive controls.
 - Focus Icons/Rating on decorative and informative icon names, visible fallback text, native radio
   keyboard behavior, read-only values, disabled states, and isolated rerenders.
  - Focus Alert/Progress/Snackbar on passive versus urgent announcements, native determinate and
    indeterminate progress, explicit completion, hidden polite snackbar status, and logical Undo focus.
   - Focus Dialog/MessageBox/Overlay on native focus containment and restoration, least-destructive
     alertdialog decisions, and bounded busy/inert content without modal claims.
     - Focus Popover/Tooltip on native light dismiss, synchronized trigger state, descriptive references,
       modality isolation, logical focus, and noninteractive supplementary content.
     - Focus DataGrid on sortable headers, arrow/Home navigation, Control+Home/End, single selection,
       truthful aria-sort/aria-selected, focus retention, and bounded horizontal reveal.
     - Focus SimpleTable/Table on captions, column and row header relationships, passive semantics, named focusable
       wrappers, local horizontal scrolling, and zero document/sidebar overflow.
      - Focus Timeline on ordered list semantics, heading hierarchy, complete time values, one current step,
       hidden decorative markers, textual status, and narrow-width readability.
       - Focus chart routes on one role=img name, native details/table disclosure, exact visual data, keyboard
         and pointer toggles, closed-state exposure, and narrow-width open-table behavior.
- Build with `pnpm ui-catalog:dev-build` or `pnpm ui-catalog:build`, then use `pnpm ui-catalog:serve` to view `dist/framework-preview.html`. Do not serve the source HTML or use `file://`: locales, generated SDK assets, and fonts are relative build outputs.

## Responsive and spacing acceptance standard

Every future component batch must verify widths 390, 768/800, 1024, 1280, 1440, 1600, 1920, and 2560; wrapping related actions; zero document-root and sidebar horizontal overflow without blanket clipping; comfortable/compact computed spacing; centered article/TOC allocation; and minimum 40px visible button, navigation, and control targets. Icon, chart, and responsive-foundation batches remain documentation work; WU-03 is not started.

## Next boundary

This RC1 artifact documents a web/hybrid preview. It does not claim APIs for the 67 design demos or implement Flutter/native controls.
