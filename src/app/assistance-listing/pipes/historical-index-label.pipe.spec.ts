import { HistoricalIndexLabelPipe } from './historical-index-label.pipe';

describe('src/app/assistance-listing/pipes/historical-index-label.pipe.spec.ts', () => {
  let pipe = new HistoricalIndexLabelPipe();
  it('HistoricalIndexLabelPipe: transforms "agency" to "Agency Changed"', () => {
    expect(pipe.transform('agency')).toBe('Agency Changed');
  });
  it('HistoricalIndexLabelPipe: transforms "unarchive" to "Reinstated"', () => {
    expect(pipe.transform('unarchive')).toBe('Reinstated');
  });
  it('HistoricalIndexLabelPipe: transforms "title" to "Title Changed"', () => {
    expect(pipe.transform('title')).toBe('Title Changed');
  });
  it('HistoricalIndexLabelPipe: transforms "archived" to "Archived"', () => {
    expect(pipe.transform('archived')).toBe('Archived');
  });
  it('HistoricalIndexLabelPipe: transforms "program_number" to "Number Changed"', () => {
    expect(pipe.transform('program_number')).toBe('Number Changed');
  });
  it('HistoricalIndexLabelPipe: transforms "publish" to "Published"', () => {
    expect(pipe.transform('publish')).toBe('Published');
  });
});
