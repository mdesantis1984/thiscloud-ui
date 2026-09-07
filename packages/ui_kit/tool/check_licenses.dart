import 'dart:io';
import 'dart:typed_data';

import 'check_boundaries.dart' show runGuard;

const _manifest = '''
3a62a92365dbdbcc7a81e396d7d05b3e6dde3cdcf85d7b2c443c802eb8efd323 LICENSE
5db3e5f6c812e27515f13a389fcfe589cd4a0c1bc73822cfb3e936b3114a4adf PROVENANCE.md
e1940017ce6ce0cd7f38bdfe8dae0157fd85a7826796014d2b8b6c817363bc76 THIRD_PARTY_NOTICES.md
262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a assets/fonts/OFL.txt
fbca9187daf8b6a07d1bb0a83ba0ec0d4dd26c4cfe2c77a7e06da8d1a301682d assets/fonts/SHA256SUMS
4989b125924991b90d05b2d16e0e388c48f7d5bb8b30539bbf9c755278d0ccaf assets/fonts/InterVariable.ttf
d6f1f6a172d9e588438db9f986fd5cfad7b30f644374080a8a9d4d91e344586f assets/fonts/InterVariable-Italic.ttf
''';
final _expected = {
  for (final row in _manifest.trim().split('\n'))
    row.substring(65): row.substring(0, 64),
};
const _roundHex =
    '428a2f9871374491b5c0fbcfe9b5dba53956c25b59f111f1923f82a4ab1c5ed5'
    'd807aa9812835b01243185be550c7dc372be5d7480deb1fe9bdc06a7c19bf174'
    'e49b69c1efbe47860fc19dc6240ca1cc2de92c6f4a7484aa5cb0a9dc76f988da'
    '983e5152a831c66db00327c8bf597fc7c6e00bf3d5a7914706ca635114292967'
    '27b70a852e1b21384d2c6dfc53380d13650a7354766a0abb81c2c92e92722c85'
    'a2bfe8a1a81a664bc24b8b70c76c51a3d192e819d6990624f40e3585106aa070'
    '19a4c1161e376c082748774c34b0bcb5391c0cb34ed8aa4a5b9cca4f682e6ff3'
    '748f82ee78a5636f84c878148cc7020890befffaa4506cebbef9a3f7c67178f2';
final _round = _words(_roundHex);
List<int> _words(String hex) => [
  for (var offset = 0; offset < hex.length; offset += 8)
    int.parse(hex.substring(offset, offset + 8), radix: 16),
];
List<String> licenseIssues(
  String root, {
  Map<String, List<int>> overrides = const {},
}) {
  final base = Directory(root).absolute;
  final issues = <String>[];
  for (final entry in _expected.entries) {
    final file = File('${base.path}${Platform.pathSeparator}${entry.key}');
    if (!overrides.containsKey(entry.key) && !file.existsSync()) {
      issues.add('${entry.key}: required legal/provenance asset is missing');
      continue;
    }
    final actual = _sha256(overrides[entry.key] ?? file.readAsBytesSync());
    if (actual != entry.value)
      issues.add(
        '${entry.key}: checksum mismatch; expected ${entry.value}, found $actual. Restore the reviewed WU-01 bytes.',
      );
  }
  issues.sort();
  return issues;
}

int _rotate(int value, int count) =>
    ((value >>> count) | (value << (32 - count))) & 0xffffffff;
String _sha256(List<int> input) {
  final bytes = <int>[...input, 0x80];
  while (bytes.length % 64 != 56) bytes.add(0);
  final bitLength = input.length * 8;
  for (var shift = 56; shift >= 0; shift -= 8)
    bytes.add((bitLength >>> shift) & 0xff);
  final data = Uint8List.fromList(bytes);
  final state = _words(
    '6a09e667bb67ae853c6ef372a54ff53a510e527f9b05688c1f83d9ab5be0cd19',
  );
  for (var offset = 0; offset < data.length; offset += 64) {
    final block = ByteData.sublistView(data, offset, offset + 64);
    final words = List<int>.filled(64, 0);
    for (var index = 0; index < 16; index++)
      words[index] = block.getUint32(index * 4);
    for (var index = 16; index < 64; index++) {
      final x = words[index - 15];
      final y = words[index - 2];
      final s0 = _rotate(x, 7) ^ _rotate(x, 18) ^ (x >>> 3);
      final s1 = _rotate(y, 17) ^ _rotate(y, 19) ^ (y >>> 10);
      words[index] =
          (words[index - 16] + s0 + words[index - 7] + s1) & 0xffffffff;
    }
    final work = [...state];
    for (var index = 0; index < 64; index++) {
      final a = work[0];
      final e = work[4];
      final sum1 = _rotate(e, 6) ^ _rotate(e, 11) ^ _rotate(e, 25);
      final choice = (e & work[5]) ^ ((~e) & work[6]);
      final temp1 =
          (work[7] + sum1 + choice + _round[index] + words[index]) & 0xffffffff;
      final sum0 = _rotate(a, 2) ^ _rotate(a, 13) ^ _rotate(a, 22);
      final temp2 =
          (sum0 + ((a & work[1]) ^ (a & work[2]) ^ (work[1] & work[2]))) &
          0xffffffff;
      work.setRange(1, 8, work.sublist(0, 7));
      work[4] = (work[4] + temp1) & 0xffffffff;
      work[0] = (temp1 + temp2) & 0xffffffff;
    }
    for (var index = 0; index < state.length; index++)
      state[index] = (state[index] + work[index]) & 0xffffffff;
  }
  return state.map((value) => value.toRadixString(16).padLeft(8, '0')).join();
}

void main(List<String> args) => runGuard(args, 'Legal assets', licenseIssues);
