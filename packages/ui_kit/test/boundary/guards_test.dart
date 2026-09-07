import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import '../../tool/check_boundaries.dart' as b;
import '../../tool/check_licenses.dart' as l;
import '../../tool/check_public_api.dart' as p;
import '../../tool/check_toolchain.dart' as t;

void _containsAll(Object actual, Iterable<String> values) {
  final text = actual is Iterable<String> ? actual.join('\n') : '$actual';
  for (final value in values) expect(text, contains(value));
}

String _imports(Iterable<String> u) => u.map((v) => "import '$v';").join('\n');
void main() {
  test('only the runtime and testing barrels are public', () {
    final names = Directory('lib')
        .listSync()
        .whereType<File>()
        .map((file) => file.uri.pathSegments.last)
        .where((name) => name.endsWith('.dart'))
        .toSet();
    expect(names, {'thiscloud_ui.dart', 'testing.dart'});
  });
  test('release toolchain mismatches are actionable', () {
    expect(t.toolchainIssues('3.13.1', '3.47.1', '3.13.1'), isEmpty);
    _containsAll(t.toolchainIssues('3.13.0', '3.46.0', '3.12.0').single, [
      'expected Dart 3.13.1 and Flutter 3.47.1',
      'PATH',
    ]);
  });
  test('boundary guard allows public APIs and rejects forbidden imports', () {
    expect(
      b.boundaryIssues(
        '.',
        sources: {
          'lib/src/good.dart': "import 'package:flutter_localizations/flutter_localizations.dart';",
          'test/good_test.dart': "import 'package:thiscloud_ui/testing.dart';\nimport 'package:thiscloud_ui/thiscloud_ui.dart';",
        },
      ),
      isEmpty,
    );
    const forbidden = [
      'package:thiscloud_center/shell.dart',
      '../../apps/storefront/lib/main.dart',
      'package:product/auth/session.dart',
      'package:product/api/client.dart',
      'package:product/router/routes.dart',
      'package:product/storage/cache.dart',
      'package:product/l10n/messages.dart',
      'package:thiscloud_ui/testing.dart',
    ];
    const deep = [
      'package:thiscloud_ui/src/button.dart',
      '../../lib/testing.dart',
    ];
    _containsAll(
      b.boundaryIssues(
        '.',
        sources: {
          'lib/src/bad.dart': _imports(forbidden),
          'test/bad_test.dart': _imports(deep),
        },
      ),
      [...forbidden, ...deep],
    );
  });
  test('public API guard honors comments, privacy, and Tc naming', () {
    const good = {
      'lib/thiscloud_ui.dart': '/// class CommentOnly {}\nlibrary;',
      'lib/testing.dart': 'library;',
      'lib/src/good.dart':
          '/* class CommentOnly {} */\nclass _Private {}\nclass TcButton {}',
    };
    expect(p.publicApiIssues('.', sources: good), isEmpty);
    _containsAll(
      p.publicApiIssues(
        '.',
        sources: {
          ...good,
          'lib/widgets.dart': 'library;',
          'lib/src/bad.dart': "import 'package:thiscloud_ui/src/internal.dart';\nclass Button {}",
        },
      ),
      ['lib/widgets.dart', 'package:thiscloud_ui/src/internal.dart', 'Button'],
    );
  });
  test('license guard detects legal and font tampering in memory', () {
    expect(l.licenseIssues(Directory.current.path), isEmpty);
    for (final tamper in <String, List<int>>{
      'LICENSE': 'tampered'.codeUnits,
      'assets/fonts/InterVariable.ttf': [0, 1, 2],
    }.entries) {
      _containsAll(
        l.licenseIssues(
          Directory.current.path,
          overrides: {tamper.key: tamper.value},
        ),
        [tamper.key],
      );
    }
  });
}
