# Security Policy

[Español](SECURITY.es.md) · [Documentation](docs/README.en.md)

Security reports for Thiscloud UI Aurora must use GitHub private vulnerability reporting. Do not disclose vulnerabilities, credentials, personal data, or working exploits in public issues or pull requests.

## Supported versions

| Version | Supported |
| --- | --- |
| `0.1.0-rc.5` | Yes |
| `0.1.0-rc.4` | Yes |
| `0.1.0-rc.2` | Yes |
| `0.1.0-rc.1` | Yes |
| Earlier previews | No |

These support entries do not establish which versions are publicly distributed. The repository's `@thiscloud/ui-web` package is private at `0.1.0-rc.5`; the documented public download is `0.1.0-rc.1`.

The catalog at `ui.thiscloud.com.ar` distributes static documentation and versioned package artifacts. It does not process product credentials or application data.

## Reporting

Open the repository `Security` tab and select `Report a vulnerability`. Include the affected version, impact, minimal reproduction, and a safe contact method. If private reporting is unavailable, do not disclose report details in public issues or pull requests. This policy does not identify an alternative private contact channel.

## Handling

The maintainer will acknowledge the report, validate its impact, coordinate remediation, and publish an advisory when appropriate. Compromised secrets are revoked and removed from history; a source deletion alone is not considered remediation.
