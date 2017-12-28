import { CapitalizePipe } from './capitalize.pipe';

describe('src/app/app-pipes/capitalize.pipe.spec.ts', () => {
  let pipe = new CapitalizePipe();
  it('CapitalizePipe: transforms a string to a string with words capitalized', () => {
    let string1 = "COMMERCE, DEPARTMENT OF";
    let result1 = 'Commerce, Department of';
    let string2 = "ECONOMIC AFFAIRS";
    let result2 = 'Economic Affairs';

    expect(pipe.transform(string1)).toBe(result1);
    expect(pipe.transform(string2)).toBe(result2);

  });

  it('CapitalizePipe: will preserves caps in initialisms', () => {
    let string1 = "THE GSA";
    let res1 = "The GSA";
    let string2 = "THEGSA";
    let res2 = "Thegsa";
    let string3 = "GSA rOcKs";
    let res3 = "GSA Rocks";

    expect(pipe.transform(string1)).toBe(res1);
    expect(pipe.transform(string2)).toBe(res2);
    expect(pipe.transform(string3)).toBe(res3);
  });
});
