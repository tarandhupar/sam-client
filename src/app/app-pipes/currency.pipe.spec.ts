import { SamCurrencyPipe } from './currency.pipe';

describe('src/app/app-pipes/currency.pipe.spec.ts', () => {
  let pipe = new SamCurrencyPipe();
  it('SamCurrencyPipe: transforms a string to currency', () => {
    let string1 = "12.1";
    let result1 = '12.10';
    
    expect(pipe.transform("12.1")).toBe("12.10");
    expect(pipe.transform("12")).toBe("12.00");
  });
});
