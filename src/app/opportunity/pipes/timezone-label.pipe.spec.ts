import { TimezoneLabelPipe } from "./timezone-label.pipe";

describe('src/app/opportunity/pipes/timezone-label.pipe.spec.ts', () => {
  let pipe = new TimezoneLabelPipe();

  it('TimezoneLabelPipe: transforms "UTC-10:00" to "Hawaii"', () => {
    expect(pipe.transform('UTC-10:00')).toBe('Hawaii');
  });
  it('TimezoneLabelPipe: transforms "UTC-09:00" to "Alaska"', () => {
    expect(pipe.transform('UTC-09:00')).toBe('Alaska');
  });
  it('TimezoneLabelPipe: transforms "UTC-08:00" to "Pacific"', () => {
    expect(pipe.transform('UTC-08:00')).toBe('Pacific');
  });
  it('TimezoneLabelPipe: transforms "UTC-07:00" to "Mountain"', () => {
    expect(pipe.transform('UTC-07:00')).toBe('Mountain');
  });
  it('TimezoneLabelPipe: transforms "UTC-06:00" to "Central"', () => {
    expect(pipe.transform('UTC-06:00')).toBe('Central');
  });
  it('TimezoneLabelPipe: transforms "UTC-05:00" to "Eastern"', () => {
    expect(pipe.transform('UTC-05:00')).toBe('Eastern');
  });

  // TODO: Fix this timezone
  it('TimezoneLabelPipe: transforms "UTC-04:00" to "Eastern"', () => {
    expect(pipe.transform('UTC-04:00')).toBe('Eastern');
  });
});
