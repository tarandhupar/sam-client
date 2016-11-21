import { NoticeTypeLabelPipe } from "./notice-type-label.pipe";

describe('NoticeLabelPipe', () => {
  let pipe = new NoticeTypeLabelPipe();

  it('transforms "p" to "Presolicitation"', () => {
    expect(pipe.transform('p')).toBe('Presolicitation');
  });
  it('transforms "a" to "Award Notice"', () => {
    expect(pipe.transform('a')).toBe('Award Notice');
  });
  it('transforms "m" to "Modification/Amendment/Cancel"', () => {
    expect(pipe.transform('m')).toBe('Modification/Amendment/Cancel');
  });
  it('transforms "r" to "Sources Sought"', () => {
    expect(pipe.transform('r')).toBe('Sources Sought');
  });
  it('transforms "s" to "Special Notice"', () => {
    expect(pipe.transform('s')).toBe('Special Notice');
  });
  it('transforms "f" to "Foreign Government Standard"', () => {
    expect(pipe.transform('f')).toBe('Foreign Government Standard');
  });
  it('transforms "g" to "Sale of Surplus Property"', () => {
    expect(pipe.transform('g')).toBe('Sale of Surplus Property');
  });
  it('transforms "k" to "Combined Synopsis/Solicitation"', () => {
    expect(pipe.transform('k')).toBe('Combined Synopsis/Solicitation');
  });
  it('transforms "j" to "Justification and Approval (J&A)"', () => {
    expect(pipe.transform('j')).toBe('Justification and Approval (J&A)');
  });
  it('transforms "i" to "Intent to Bundle Requirements (DoD-Funded)"', () => {
    expect(pipe.transform('i')).toBe('Intent to Bundle Requirements (DoD-Funded)');
  });
  it('transforms "l" to "Fair Opportunity / Limited Sources Justification"', () => {
    expect(pipe.transform('l')).toBe('Fair Opportunity / Limited Sources Justification');
  });
});
