import { CapitalizePipe } from './capitalize.pipe';

describe('AuthorizationPipe', () => {
  let pipe = new CapitalizePipe();
  it('transforms a string to a string with words capitalized', () => {
    let string1 = "COMMERCE, DEPARTMENT OF";
    let result1 = 'Commerce, Department of';
    let string2 = "ECONOMIC AFFAIRS";
    let result2 = 'Economic Affairs';
    
    expect(pipe.transform(string1)).toBe(result1);
    expect(pipe.transform(string2)).toBe(result2);

  });
});
