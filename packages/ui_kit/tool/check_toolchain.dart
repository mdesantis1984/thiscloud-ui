import 'dart:convert';
import 'dart:io';

const _dart = '3.13.1';
const _flutter = '3.47.1';
List<String> toolchainIssues(String dart, String flutter, String bundledDart) {
  if ((dart, flutter, bundledDart) == (_dart, _flutter, _dart)) return const [];
  return [
    'Toolchain mismatch: expected Dart $_dart and Flutter $_flutter; found Dart '
        '$dart, Flutter $flutter (bundled Dart $bundledDart). '
        r'Prepend $HOME/.cache/thiscloud-ui/flutter/3.47.1/bin to PATH and retry.',
  ];
}

Never _fail(String message) {
  stderr.writeln(message);
  exit(1);
}

void main() {
  try {
    final result = Process.runSync('flutter', const ['--version', '--machine']);
    if (result.exitCode != 0) {
      _fail('Unable to inspect Flutter $_flutter: ${result.stderr}');
    }
    final data = jsonDecode(result.stdout.toString()) as Map<String, dynamic>;
    final issues = toolchainIssues(
      Platform.version.split(' ').first,
      data['frameworkVersion'].toString().split(' ').first,
      data['dartSdkVersion'].toString().split(' ').first,
    );
    if (issues.isNotEmpty) _fail(issues.join('\n'));
  } on Object catch (error) {
    _fail(
      'Toolchain check failed: $error. Put Flutter $_flutter on PATH and retry.',
    );
  }
}
