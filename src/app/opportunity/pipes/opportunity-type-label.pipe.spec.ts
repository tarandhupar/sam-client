import { OpportunityTypeLabelPipe } from "./opportunity-type-label.pipe";

describe('src/app/opportunity/pipes/opportunity-type-label.pipe.spec.ts', () => {
  let pipe = new OpportunityTypeLabelPipe();

  it('OpportunityLabelPipe: transforms "p" to "Presolicitation"', () => {
    expect(pipe.transform('p')).toBe('Presolicitation');
  });
  it('OpportunityLabelPipe: transforms "a" to "Award Notice"', () => {
    expect(pipe.transform('a')).toBe('Award Notice');
  });
  it('OpportunityLabelPipe: transforms "m" to "Update/Amendment"', () => {
    expect(pipe.transform('m')).toBe('Update/Amendment');
  });
  it('OpportunityLabelPipe: transforms "r" to "Sources Sought"', () => {
    expect(pipe.transform('r')).toBe('Sources Sought');
  });
  it('OpportunityLabelPipe: transforms "s" to "Special Notice"', () => {
    expect(pipe.transform('s')).toBe('Special Notice');
  });
  it('OpportunityLabelPipe: transforms "f" to "Foreign Government Standard"', () => {
    expect(pipe.transform('f')).toBe('Foreign Government Standard');
  });
  it('OpportunityLabelPipe: transforms "g" to "Sale of Surplus Property"', () => {
    expect(pipe.transform('g')).toBe('Sale of Surplus Property');
  });
  it('OpportunityLabelPipe: transforms "k" to "Combined Synopsis/Solicitation"', () => {
    expect(pipe.transform('k')).toBe('Combined Synopsis/Solicitation');
  });
  it('OpportunityLabelPipe: transforms "j" to "Justification and Approval (J&A)"', () => {
    expect(pipe.transform('j')).toBe('Justification and Approval (J&A)');
  });
  it('OpportunityLabelPipe: transforms "i" to "Intent to Bundle Requirements (DoD-Funded)"', () => {
    expect(pipe.transform('i')).toBe('Intent to Bundle Requirements (DoD-Funded)');
  });
  it('OpportunityLabelPipe: transforms "l" to "Fair Opportunity / Limited Sources Justification"', () => {
    expect(pipe.transform('l')).toBe('Fair Opportunity / Limited Sources Justification');
  });
  it('OpportunityLabelPipe: transforms null to ""', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
