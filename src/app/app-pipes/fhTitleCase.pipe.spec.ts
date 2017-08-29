import { FHTitleCasePipe } from './fhTitleCase.pipe';

describe('src/app/app-pipes/fhTitleCase.pipe.spec.ts', () => {
  let pipe = new FHTitleCasePipe();
  it('FHTitleCasePipe: transforms a string to a string with words in title case', () => {
    let string1 = "COMMERCE, DEPARTMENT OF";
    let result1 = 'Commerce, Department of';
    let string2 = "ECONOMIC AFFAIRS";
    let result2 = 'Economic Affairs';
    let string3 = "ADMINISTRATIVE OFFICE OF THE U.S. COURTS";
    let result3 = 'Administrative Office of the U.S. Courts';
    
    expect(pipe.transform(string1)).toBe(result1);
    expect(pipe.transform(string2)).toBe(result2);
    expect(pipe.transform(string3)).toBe(result3);

  });
});
