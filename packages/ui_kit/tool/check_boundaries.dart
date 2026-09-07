import 'dart:io';

const _runtimeApi = 'package:thiscloud_ui/thiscloud_ui.dart';
const _testingApi = 'package:thiscloud_ui/testing.dart';
const _ignored = {'.dart_tool', 'build', '.git'};
final _productArea = RegExp(
  r'(^|[/_.:-])(center|apps?|auth|api|router|storage|l10n|locali[sz]ations?)(?=$|[/_.-])',
  caseSensitive: false,
);
final _import = RegExp(r'''^\s*import\s+['"]([^'"]+)['"]''', multiLine: true);
typedef Guard = List<String> Function(String);
List<String> boundaryIssues(String root, {Map<String, String>? sources}) {
  final entries = (sources ?? readDartSources(root)).entries.toList()
    ..sort((a, b) => a.key.compareTo(b.key));
  final issues = <String>[];
  for (final entry in entries) {
    final path = entry.key.replaceAll('\\', '/');
    final isTest =
        path.split('/').contains('test') || path.endsWith('_test.dart');
    for (final match in _import.allMatches(entry.value)) {
      final uri = match.group(1)!;
      String? reason;
      if (uri == _testingApi && !isTest)
        reason = 'production code cannot import the testing API';
      else if (uri.startsWith('package:thiscloud_ui/') &&
          uri != _runtimeApi &&
          uri != _testingApi)
        reason = 'deep/category package import; use $_runtimeApi';
      else if (uri.contains('lib/src/'))
        reason = 'consumer import of private lib/src code';
      else if (isTest &&
          uri != _testingApi &&
          (uri == 'testing.dart' || uri.contains('/lib/testing.dart')))
        reason = 'tests must import helpers through $_testingApi';
      else if (!isTest &&
          !uri.startsWith('package:flutter_localizations/') &&
          _productArea.hasMatch(uri))
        reason = 'forbidden Center/app/product-service dependency';
      if (reason != null) issues.add('$path: $reason: "$uri"');
    }
  }
  issues.sort();
  return issues;
}

Map<String, String> readDartSources(String root) {
  final base = Directory(root).absolute;
  if (!base.existsSync())
    throw FileSystemException('Package root does not exist', base.path);
  final files =
      base
          .listSync(recursive: true, followLinks: false)
          .whereType<File>()
          .where((file) => file.path.endsWith('.dart'))
          .toList()
        ..sort((a, b) => a.path.compareTo(b.path));
  final result = <String, String>{};
  for (final file in files) {
    final path = file.path
        .substring(base.path.length + 1)
        .replaceAll(Platform.pathSeparator, '/');
    if (!path.split('/').any(_ignored.contains))
      result[path] = file.readAsStringSync();
  }
  return result;
}

void runGuard(List<String> args, String title, Guard inspect) {
  try {
    final issues = inspect(args.isEmpty ? Directory.current.path : args.single);
    if (issues.isNotEmpty) {
      stderr.writeln('$title violations:\n${issues.join('\n')}');
      exitCode = 1;
    }
  } on Object catch (error) {
    stderr.writeln('$title check failed: $error');
    exitCode = 1;
  }
}

void main(List<String> args) =>
    runGuard(args, 'Import boundary', boundaryIssues);
