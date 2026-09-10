# Changelog

## 0.1.0-rc.3

- Clears stale switch validation UI when a native form reset preserves the default checked state.
- Keeps switch and text-field activation, focus, and accessible names aligned with labels inserted after connection.

## 0.1.0-rc.2

- Adds an append-only checksum registry that binds every release version to exact package bytes.
- Normalizes gzip output so release archives are byte-identical across build environments.
- Rejects packaging when a version's generated tarball differs from its registered checksum.
- Refreshes release metadata after the repository migration without changing the public API.

## 0.1.0-rc.1

- Establishes the private web/hybrid RC API: `TcSwitch`, `TcTextField`, `ValidationControl`, and `attachFormValidation(nativeForm, options)`.
- Adds release-boundary documentation for local tarball consumers.
- Does not publish a registry package, implement Flutter/native controls, or certify cross-browser or manual assistive-technology support.
