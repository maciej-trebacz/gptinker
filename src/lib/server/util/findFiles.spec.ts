import { findFiles } from './findFiles';

const FAKE_IDENTIFIER = 'FAKE_IDENTIFIER_FOR_TESTING';

describe('findFiles', () => {
  test('should find files containing the specified text', async () => {
    const results = await findFiles(FAKE_IDENTIFIER);
    const path = './src/lib/server/findFiles.spec.ts';
    const expected = `${path}:const FAKE_IDENTIFIER = '${FAKE_IDENTIFIER}';`;
    expect(results.includes(expected)).toBe(true);
  }, 10000);

  test('should throw an exception if no files contain the specified text', async () => {
    const nonExistentText = 'NON' + 'EXISTENT' + 'TEXT';
    let error;

    try {
      await findFiles(nonExistentText);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect((error as Error).message).toMatch(/No files contain the specified text/);
  }, 10000);
});