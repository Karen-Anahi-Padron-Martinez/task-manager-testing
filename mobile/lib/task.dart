/// Converts a JSON object into a task value.
class Task {
  /// Creates a task.
  const Task({required this.id, required this.title});

  /// Unique server identifier.
  final String id;

  /// User-visible task title.
  final String title;

  /// Parses a task from JSON.
  ///
  /// Throws [FormatException] when required fields are missing or invalid.
  factory Task.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final title = json['title'];

    if (id is! String || title is! String || title.trim().isEmpty) {
      throw const FormatException('Invalid task data.');
    }

    return Task(id: id, title: title);
  }
}
