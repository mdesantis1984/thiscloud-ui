# Changelog

## 0.1.0-rc.2

- Adds an append-only checksum registry that binds every release version to exact package bytes.
- Rejects packaging when a version's generated tarball differs from its registered checksum.
- Refreshes release metadata after the repository migration without changing the public API.

## 0.1.0-rc.1

- Establishes the private web/hybrid RC API: `TcSwitch`, `TcTextField`, `ValidationControl`, and `attachFormValidation(nativeForm, options)`.
- Adds release-boundary documentation for local tarball consumers.
- Does not publish a registry package, implement Flutter/native controls, or certify cross-browser or manual assistive-technology support.
