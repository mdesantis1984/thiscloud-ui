# Gobierno del repositorio y evidencia de revisión

[English](governance.md) · [Índice de documentación](README.md)

La [guía de contribución](../CONTRIBUTING.md) documenta un flujo que comienza por un issue: issue aprobado, unidad de trabajo coherente en una rama tipificada desde `develop`, verificación enfocada y PR para revisión. Esta página describe las reglas documentadas y ejecutables del repositorio; **no** es una auditoría en tiempo real de la configuración de GitHub ni una política de aprobación adicional.

## Ramas y responsables

| Cambio | Ruta documentada | Evidencia |
| --- | --- | --- |
| Trabajo habitual, incluida la documentación | `docs/*` u otra rama tipificada permitida hacia `develop` | [Guía de contribución](../CONTRIBUTING.md), [validador de PR](../scripts/validate-pr-policy.mjs) |
| Promoción | `develop` hacia `main`, sin implementación nueva | [Guía de contribución](../CONTRIBUTING.md), [validador de PR](../scripts/validate-pr-policy.mjs) |
| Corrección de emergencia | `fix/*` desde `main` hacia `main`, seguida de la sincronización con `develop` | [Guía de contribución](../CONTRIBUTING.md), [validador de PR](../scripts/validate-pr-policy.mjs) |

[`CODEOWNERS`](../.github/CODEOWNERS) asigna las rutas del repositorio a `mdesantis1984`. No demuestra los permisos actuales, la cantidad de aprobaciones exigidas, los métodos de integración ni la protección de ramas. Esas configuraciones requieren una consulta independiente a GitHub; para la ruta documentada, consulte la [guía de contribución](../CONTRIBUTING.md) sin tomar esta página como prueba de la configuración de la plataforma.

## Política ejecutable de PR

El [workflow de política de PR](../.github/workflows/pr-policy.yml) ejecuta código de política confiable desde la base del PR mediante `pull_request_target`, con permisos de token de solo lectura. El [validador](../scripts/validate-pr-policy.mjs) comprueba la ruta de ramas, exactamente una etiqueta `type:*`, un issue vinculado y aprobado para los PR que no son de Dependabot y una sección `Delivery Impact` coherente con las clasificaciones del issue vinculado y evidencia concreta. Antes de abrir un PR, consulte el contenido real del issue: los metadatos de aprobación no demuestran que coincidan las opciones de impacto.

| Presupuesto | Significado |
| --- | --- |
| 1000 líneas modificadas (adiciones + eliminaciones) | Umbral del [validador de PR](../scripts/validate-pr-policy.mjs) para PR que no son promociones; un PR que lo supera requiere `size:exception`, justificación y procedencia administrativa. |
| Aproximadamente 400 líneas redactadas | Orientación opcional sobre el tamaño de revisión para planificar unidades coherentes; no es un requisito del repositorio ni un control automatizado y no modifica el umbral exigido de 1000 líneas. |

El validador reconoce a `dependabot[bot]` con destino `develop` desde una rama `dependabot/*` como excepción al vínculo con un issue; los controles de etiqueta y tamaño siguen aplicando. También excluye las promociones `develop` → `main` del umbral de tamaño, pero no de las demás comprobaciones de metadatos. La [guía de contribución](../CONTRIBUTING.md) describe la intención de revisión e integración humanas; este workflow por sí solo no determina quién puede integrar cambios en GitHub.

## Alcance y límites

La documentación y los metadatos de un PR no otorgan permisos de escritura, integración, publicación ni despliegue. Consulte la [guía de contribución](../CONTRIBUTING.md), el [código de la política de PR](../scripts/validate-pr-policy.mjs) y el [workflow](../.github/workflows/pr-policy.yml) vigentes antes de proponer un cambio; si hace falta, solicite evidencia independiente de la configuración de la plataforma. Los reportes de seguridad continúan regidos por la [política de seguridad](../SECURITY.md); aquí no se declara ningún canal nuevo ni compromiso de servicio.
