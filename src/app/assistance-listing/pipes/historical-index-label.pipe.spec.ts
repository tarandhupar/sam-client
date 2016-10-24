import { HistoricalIndexLabelPipe } from './historical-index-label.pipe';




describe('HistoricalIndexLabelPipe', () => {
  let pipe = new HistoricalIndexLabelPipe();
  it('transforms "agency" to "Agency Changed"', () => {
    expect(pipe.transform('agency')).toBe('Agency Changed');
  });
  it('transforms "unarchive" to "Reinstated"', () => {
    expect(pipe.transform('unarchive')).toBe('Reinstated');
  });
  it('transforms "title" to "Title Changed"', () => {
    expect(pipe.transform('title')).toBe('Title Changed');
  });
  it('transforms "archived" to "Archived"', () => {
    expect(pipe.transform('archived')).toBe('Archived');
  });
  it('transforms "program_number" to "Number Changed"', () => {
    expect(pipe.transform('program_number')).toBe('Number Changed');
  });
  it('transforms "publish" to "Published"', () => {
    expect(pipe.transform('publish')).toBe('Published');
  });
});
