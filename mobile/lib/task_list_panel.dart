import 'package:flutter/material.dart';

/// Shows tasks or the current loading, empty, or error state.
class TaskListPanel extends StatelessWidget {
  /// Creates a task list panel.
  const TaskListPanel({
    super.key,
    required this.loading,
    required this.tasks,
    this.errorMessage,
    this.onRetry,
  });

  /// Whether tasks are being loaded.
  final bool loading;

  /// Task titles to display.
  final List<String> tasks;

  /// Optional safe error message.
  final String? errorMessage;

  /// Called when the user taps the retry button in the error state.
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (errorMessage != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(errorMessage!),
            if (onRetry != null)
              TextButton(
                key: const Key('retry-button'),
                onPressed: onRetry,
                child: const Text('Retry'),
              ),
          ],
        ),
      );
    }

    if (tasks.isEmpty) {
      return const Center(child: Text('No tasks yet.'));
    }

    return ListView(
      children: [for (final task in tasks) ListTile(title: Text(task))],
    );
  }
}
