import ModuleA from '../src/ModuleA';

describe('ModuleA', () => {
  const moduleA = new ModuleA('name');
  test('constructor', () => {
    expect(moduleA.name).toBe('name');
  });
});
