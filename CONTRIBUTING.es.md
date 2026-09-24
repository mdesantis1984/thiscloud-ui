# Contribuir

[English](CONTRIBUTING.md) · [Documentación](docs/README.md)

Los cambios en Thiscloud UI Aurora siguen un proceso basado en issues y revisiones. Comience por el issue aprobado y la documentación del paquete correspondiente. Esta guía describe el proceso del repositorio, no una auditoría actual de la protección de ramas en GitHub.

## Proceso

1. Proponga o elija un issue con un resultado observable, alcance, evidencia de aceptación e [impacto de entrega](.github/ISSUE_TEMPLATE/documentation.yml). Espere a que la persona autorizada aplique `status:approved` antes de implementar.
2. Cree una rama desde `develop` con el formato `type/description` (por ejemplo, `docs/contribution-guide`). Implemente una unidad de trabajo coherente con las pruebas y la documentación que correspondan.
3. Ejecute las verificaciones pertinentes y `git diff --check`; registre los resultados reales, las limitaciones, los riesgos y el alcance de reversión. Haga un commit con el formato Conventional Commits.
4. Abra un PR hacia `develop` con la [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md). Incluya `Closes #<approved-issue-number>`, seleccione un tipo de cambio, aplique exactamente una etiqueta `type:*` correspondiente y complete el contexto de la cadena, la verificación y Delivery Impact con evidencia concreta. Las cinco clasificaciones de impacto deben coincidir con las opciones del issue vinculado, no solo con las expectativas de quien crea el PR.
5. Obtenga las comprobaciones para la base actual y la revisión explícita de la persona responsable antes de fusionar; aprobar una comprobación no equivale a aceptar el cambio. No presente un cambio solo del repositorio como una publicación.

Para PR de unidades de trabajo ordinarias, el [validador](scripts/validate-pr-policy.mjs) suma líneas agregadas y eliminadas y rechaza más de **1000** líneas modificadas, salvo que un administrador del repositorio aplique `size:exception` y el PR incluya una justificación concreta en Size Exception Rationale. Los cortes más pequeños (alrededor de 400 líneas) pueden facilitar la revisión, pero son una recomendación opcional, no una regla automatizada. Separe resultados revisables de forma independiente en PR ordenados; no agrupe trabajo ajeno para completar el presupuesto.

## Modelo de ramas

- La [política de PR](scripts/validate-pr-policy.mjs) acepta ramas de trabajo tipadas hacia `develop`, `develop` hacia `main` para promoción y `fix/description` hacia `main` para correcciones urgentes.
- El proceso documentado revisa las unidades en `develop` antes de promoverlas a `main`. Los PR de promoción pueden agrupar unidades ya revisadas y están exentos del límite de 1000 líneas; no introduzca nuevas implementaciones allí. Reincorpore a `develop` las correcciones urgentes después de la publicación.
- [CODEOWNERS](.github/CODEOWNERS) identifica a quienes revisan; no acredita los permisos, métodos de fusión o protecciones actuales de GitHub. Siga los controles vigentes del repositorio y obtenga autorización de la persona responsable para fusionar.

## Verificación

Desde la raíz del repositorio, ejecute las comprobaciones correspondientes al área modificada. Para cambios web y del catálogo, los [scripts del paquete](package.json) actuales ofrecen:

```bash
pnpm check:web
pnpm check:release
git diff --check
```

Ejecute `check:web` y `check:release` de forma secuencial; ambos generan o consumen el catálogo. No verifican enlaces Markdown ni paridad de traducción. Los cambios de Flutter también requieren el SDK fijado y las comprobaciones del paquete indicadas en [`packages/ui_kit/README.md`](packages/ui_kit/README.md). Para cambios solo documentales, revise los enlaces locales y las afirmaciones coincidentes en español e inglés; indique qué comprobaciones ejecutó y cuáles no correspondían. No agregue artefactos generados ni secretos.

## Commits

Use `type(scope): outcome`, por ejemplo `docs(maintainers): clarify contribution steps`. Incluya las pruebas y la documentación en la misma unidad de trabajo e identifique los archivos o el comportamiento que pueden revertirse sin deshacer trabajo ajeno.

## Lista de revisión

- [ ] El PR vincula un issue aprobado; Delivery Impact coincide con sus opciones y cita evidencia concreta.
- [ ] El PR tiene exactamente una etiqueta `type:*`, una rama y destino válidos, y un Conventional Commit.
- [ ] El PR cumple el límite de 1000 líneas o documenta una excepción aprobada por un administrador.
- [ ] Constan las verificaciones reales, las limitaciones, los riesgos y el alcance de reversión; se repiten las comprobaciones si cambia la base.
- [ ] No hay secretos, artefactos generados ni código de producto ajeno; la aceptación de la persona responsable sigue pendiente hasta que se otorgue explícitamente.
