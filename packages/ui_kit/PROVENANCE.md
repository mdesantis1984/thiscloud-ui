# Provenance

## First-party implementation

Thiscloud Services authors the package source and documentation as a clean-room Dart and Flutter implementation under MIT. WU-01 contains only the package/legal metadata and catalog shell; it adapts no third-party source.

## Redistributed font assets

The two font files and license come from the official upstream Inter v4.1 release archive:

- Release: <https://github.com/rsms/inter/releases/tag/v4.1>
- Archive: <https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip>
- Tag commit: `e3a3d4c57d5ecc01453a575621882a384c1995a3`
- Archive SHA-256: `9883fdd4a49d4fb66bd8177ba6625ef9a64aa45899767dde3d36aa425756b11e`
- Upstream files: `InterVariable.ttf`, `InterVariable-Italic.ttf`, and `LICENSE.txt`
- Installed names: `InterVariable.ttf`, `InterVariable-Italic.ttf`, and `OFL.txt`
- OFL SHA-256: `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a`

Exact installed font checksums are in [`assets/fonts/SHA256SUMS`](assets/fonts/SHA256SUMS) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). The license is preserved byte-for-byte and the fonts remain under SIL OFL 1.1.

## Conceptual references

MudBlazor architecture and documentation are conceptual references for future API organization, theming, and accessibility work. MudBlazor is MIT-licensed at <https://github.com/MudBlazor/MudBlazor>. No MudBlazor source is copied, translated, or adapted in WU-01, so no MudBlazor code is redistributed by this package.

YNEX is excluded from implementation provenance. No YNEX code, CSS, JavaScript, assets, screenshots, icons, or distinctive composition is included or used as a pixel target.

Future source adaptation requires a separately reviewed provenance entry naming the exact upstream file and version, plus all applicable notices, before the adapted bytes enter the package.
