'use strict';

const { validateTitle } = require('../src/tasks/validation');

describe('validateTitle', () => {
  test('trims a valid title', () => {
    expect(validateTitle('  Plan tests  ')).toBe('Plan tests');
  });

  test('accepts a title with the minimum length (1 character)', () => {
    expect(validateTitle('a')).toBe('a');
  });

  test('accepts a title with the maximum length (120 characters)', () => {
    const title = 'a'.repeat(120);
    expect(validateTitle(title)).toBe(title);
  });

  test('rejects an empty title', () => {
    expect(() => validateTitle('')).toThrow('Enter a valid title.');
  });

  test('rejects a blank (whitespace-only) title', () => {
    expect(() => validateTitle('   ')).toThrow('Enter a valid title.');
  });

  test('rejects a title longer than the limit (121 characters)', () => {
    expect(() => validateTitle('a'.repeat(121))).toThrow('Enter a valid title.');
  });

  test.each([[42], [null], [undefined], [{}], [['x']], [true]])(
    'rejects a non-string title: %p',
    (value) => {
      expect(() => validateTitle(value)).toThrow(TypeError);
    },
  );

  test('treats a SQL-looking string as ordinary text', () => {
    expect(validateTitle("' OR '1'='1")).toBe("' OR '1'='1");
  });
});
