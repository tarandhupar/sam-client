import {FormatFederalHierarchyType} from "./format-federal-hierarchy-type.pipe";

describe('src/app/assistance-listing/pipes/format-federal-hierarchy-type.pipe.spec.ts', () => {
  let pipe = new FormatFederalHierarchyType();
  it('FormatFederalHierarchyType: transforms "DEPARTMENT" to "Department/Ind. Agency"', () => {
    expect(pipe.transform('DEPARTMENT')).toBe('Department/Ind. Agency');
  });
  it('FormatFederalHierarchyType: transforms "AGENCY" to "Sub-tier"', () => {
    expect(pipe.transform('AGENCY')).toBe('Sub-tier');
  });
  it('FormatFederalHierarchyType: transforms "OFFICE" to "Office"', () => {
    expect(pipe.transform('OFFICE')).toBe('Office');
  });
});
