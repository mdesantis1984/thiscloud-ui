import 'check_boundaries.dart' show readDartSources, runGuard;

const _entrypoints = {'lib/thiscloud_ui.dart', 'lib/testing.dart'};
final _directive = RegExp(
  r'''^\s*(?:import|export)\s+['"]([^'"]+)['"]''',
  multiLine: true,
);
List<String> publicApiIssues(String root, {Map<String, String>? sources}) {
  final input = sources ?? readDartSources(root);
  final paths = input.keys.map((path) => path.replaceAll('\\', '/')).toList()
    ..sort();
  final visible = paths
      .where((path) => RegExp(r'^lib/[^/]+\.dart$').hasMatch(path))
      .toSet();
  final issues = <String>[];
  for (final path in _entrypoints.difference(visible))
    issues.add('$path: required public barrel is missing');
  for (final path in visible.difference(_entrypoints))
    issues.add('$path: unsupported public package entrypoint');
  for (final path in paths.where((path) => path.startsWith('lib/'))) {
    final source = input[path]!;
    for (final match in _directive.allMatches(source)) {
      final uri = match.group(1)!;
      final publicUri =
          uri == 'package:thiscloud_ui/thiscloud_ui.dart' ||
          uri == 'package:thiscloud_ui/testing.dart';
      if ((uri.startsWith('package:thiscloud_ui/') && !publicUri) ||
          uri.contains('lib/src/'))
        issues.add('$path: deep public import/export "$uri" is forbidden');
    }
    for (final name in _topLevelNames(source)) {
      if (!name.startsWith('_') && !name.startsWith('Tc'))
        issues.add('$path: public declaration "$name" must start with Tc');
    }
  }
  issues.sort();
  return issues;
}

Iterable<String> _topLevelNames(String source) sync* {
  final code = source
      .replaceAll(RegExp(r'/\*[\s\S]*?\*/'), '')
      .replaceAll(RegExp(r'//[^\n]*'), '');
  var depth = 0;
  var start = 0;
  for (var index = 0; index < code.length; index++) {
    final character = code[index];
    if (depth == 0 && (character == '{' || character == ';'))
      yield* _names(code.substring(start, index));
    if (character == '{') depth++;
    if (character == '}' && --depth == 0) start = index + 1;
    if (character == ';' && depth == 0) start = index + 1;
  }
}

Iterable<String> _names(String header) {
  final value = header.trim();
  if (value.isEmpty ||
      RegExp(r'^(library|import|export|part)\b').hasMatch(value))
    return const [];
  final type = RegExp(
    r'\b(?:class|enum|mixin|typedef|extension(?:\s+type)?)\s+([A-Za-z_]\w*)',
  ).firstMatch(value);
  if (type != null) return type.group(1) == 'on' ? const [] : [type.group(1)!];
  final callable = RegExp(
    r'([A-Za-z_]\w*)\s*\([^;{}]*\)\s*(?:async\*?|sync\*?|=>[\s\S]*)?$',
  ).firstMatch(value);
  if (callable != null) return [callable.group(1)!];
  return RegExp(r'\b([A-Za-z_]\w*)\s*(?==|,|$)')
      .allMatches(value)
      .map((match) => match.group(1)!);
}

void main(List<String> args) => runGuard(args, 'Public API', publicApiIssues);
