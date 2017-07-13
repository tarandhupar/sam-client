import {RequestHistoryLabelPipe} from "./request-history-label.pipe";

describe('src/app/assistance-listing/pipes/request-history-label.pipe.spec.ts', () => {
  let pipe = new RequestHistoryLabelPipe();
  it('RequestHistoryLabelPipe: transforms "title_request" to "Title Changed Requested"', () => {
    expect(pipe.transform('title_request')).toBe('Title Changed Requested');
  });
  it('RequestHistoryLabelPipe: transforms "agency_request" to "Agency Change Requested"', () => {
    expect(pipe.transform('agency_request')).toBe('Agency Change Requested');
  });
  it('RequestHistoryLabelPipe: transforms "program_number_request" to "Program Number Change Requested"', () => {
    expect(pipe.transform('program_number_request')).toBe('Program Number Change Requested');
  });
  it('RequestHistoryLabelPipe: transforms "archive_request" to "Archive Requested"', () => {
    expect(pipe.transform('archive_request')).toBe('Archive Requested');
  });
  it('RequestHistoryLabelPipe: transforms "unarchive_request" to "Unarchive Requested"', () => {
    expect(pipe.transform('unarchive_request')).toBe('Unarchive Requested');
  });
  it('RequestHistoryLabelPipe: transforms "submit" to "Program Submitted"', () => {
    expect(pipe.transform('submit')).toBe('Program Submitted');
  });
});
