import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/task.dart';

void main() {
  test('parses a valid task', () {
    final task = Task.fromJson({'id': 'task-1', 'title': 'Plan tests'});

    expect(task.id, 'task-1');
    expect(task.title, 'Plan tests');
  });

  test('rejects an empty title', () {
    expect(
      () => Task.fromJson({'id': 'task-1', 'title': '   '}),
      throwsFormatException,
    );
  });

  test('rejects a missing id', () {
    expect(
      () => Task.fromJson({'title': 'Plan tests'}),
      throwsFormatException,
    );
  });

  test('rejects a missing title', () {
    expect(
      () => Task.fromJson({'id': 'task-1'}),
      throwsFormatException,
    );
  });

  test('rejects a title with the wrong type', () {
    expect(
      () => Task.fromJson({'id': 'task-1', 'title': 42}),
      throwsFormatException,
    );
  });

  test('accepts a title at the maximum allowed length (120)', () {
    final title = 'a' * 120;
    final task = Task.fromJson({'id': 'task-1', 'title': title});

    expect(task.title.length, 120);
  });
}
