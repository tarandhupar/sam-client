import { DateFormatPipe } from './date-format.pipe';

describe('src/app/app-pipes/date-format.pipe.spec.ts', () => {
  let pipe = new DateFormatPipe();
  it('DateFormatPipe: transforms a string to a date', () => {
    let string1 = "2016-12-12T13:01";
    
    expect(pipe.transform(string1, "Y")).toBe("2016");
  });
});
