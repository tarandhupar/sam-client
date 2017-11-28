import { FeedsDateTimePipe } from './feeds-date-time-display.pipe';

describe('src/app/app-pipes/feeds-date-time-display.pipe.spec.ts', () => {
  let pipe = new FeedsDateTimePipe();
  it('FeedsDateTimePipe: transforms a string to a date', () => {
    let string1 = "2016-12-12T13:01";
    
    expect(pipe.transform(string1)).toBe("Dec 12 2016 01:01PM");
  });
});
