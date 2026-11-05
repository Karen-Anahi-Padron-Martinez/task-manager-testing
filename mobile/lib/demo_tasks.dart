import 'package:flutter/material.dart';

import 'task_list_panel.dart';

/// Pantalla de demostración para tomar capturas de los estados del panel.
///
/// Ejecutar con: flutter run -t lib/demo_tasks.dart
void main() {
  runApp(const DemoTasksApp());
}

/// App mínima que muestra [TaskListPanel] con datos sintéticos.
class DemoTasksApp extends StatelessWidget {
  /// Crea la app de demostración.
  const DemoTasksApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Task Manager',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const DemoTasksPage(),
    );
  }
}

/// Permite cambiar entre los estados del panel para capturar cada uno.
class DemoTasksPage extends StatefulWidget {
  /// Crea la página de demostración.
  const DemoTasksPage({super.key});

  @override
  State<DemoTasksPage> createState() => _DemoTasksPageState();
}

class _DemoTasksPageState extends State<DemoTasksPage> {
  String _state = 'Tareas';

  static const _sampleTasks = [
    'Plan tests',
    'Write widget tests',
    'Review bug report',
    'Run k6 health test',
  ];

  Widget _buildPanel() {
    switch (_state) {
      case 'Cargando':
        return const TaskListPanel(loading: true, tasks: []);
      case 'Vacío':
        return const TaskListPanel(loading: false, tasks: []);
      case 'Error':
        return TaskListPanel(
          loading: false,
          tasks: const [],
          errorMessage: 'Could not load tasks.',
          onRetry: () => setState(() => _state = 'Tareas'),
        );
      default:
        return const TaskListPanel(loading: false, tasks: _sampleTasks);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Mis tareas'),
        actions: [
          PopupMenuButton<String>(
            tooltip: 'Cambiar estado',
            onSelected: (value) => setState(() => _state = value),
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'Tareas', child: Text('Tareas')),
              PopupMenuItem(value: 'Cargando', child: Text('Cargando')),
              PopupMenuItem(value: 'Vacío', child: Text('Vacío')),
              PopupMenuItem(value: 'Error', child: Text('Error')),
            ],
          ),
        ],
      ),
      body: _buildPanel(),
    );
  }
}
