import { CapitalizePipe } from './capitalize.pipe';


describe('CapitalizePipe', () => {
  // This pipe is a pure function so no need for BeforeEach
  let pipe = new CapitalizePipe();
  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });
  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });
});
