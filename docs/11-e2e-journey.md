# Prueba end-to-end (flujo completo)

Este flujo necesita la app Flutter real (con `lib/main.dart` y las claves `Key` indicadas) y una API de prueba. Este repo incluye solo el modelo y los widgets, así que el código se deja aquí como **plan** para cuando tengas la app completa. Cópialo a `mobile/integration_test/app_test.dart` y ejecútalo con `flutter test integration_test`.

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('user can sign in, create and complete a task, and log out',
      (tester) async {
    app.main();
    await tester.pumpAndSettle();

    await tester.enterText(
        find.byKey(const Key('email-field')), 'tester@example.test');
    await tester.enterText(
        find.byKey(const Key('password-field')), 'local-test-password');
    await tester.tap(find.byKey(const Key('login-button')));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('add-task-button')));
    await tester.enterText(
        find.byKey(const Key('task-title-field')), 'Check release flow');
    await tester.tap(find.byKey(const Key('save-task-button')));
    await tester.pumpAndSettle();
    expect(find.text('Check release flow'), findsOneWidget);

    // Extensión del ejercicio: completar y cerrar sesión.
    await tester.tap(find.byKey(const Key('complete-task-checkbox')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('logout-button')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('login-button')), findsOneWidget);
  });
}
```

## Reglas
- Usar credenciales de prueba dedicadas y reiniciar los datos de la cuenta antes de cada ejecución.
- Nunca apuntar a producción.
- Mantener pocas pruebas end-to-end: son lentas y sensibles al entorno.
