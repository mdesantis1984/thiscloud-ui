import 'package:flutter/material.dart';

void main() {
  runApp(const _CatalogShell());
}

class _CatalogShell extends StatelessWidget {
  const _CatalogShell();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Thiscloud UI Catalog',
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(title: const Text('Thiscloud UI Catalog')),
        body: const Center(
          child: Text('Component stories will be added in later work units.'),
        ),
      ),
    );
  }
}
