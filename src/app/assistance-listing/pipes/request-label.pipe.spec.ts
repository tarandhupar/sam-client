import {RequestLabelPipe} from "./request-label.pipe";

describe('src/app/assistance-listing/pipes/request-label.pipe.spec.ts', () => {
  let pipe = new RequestLabelPipe();
  it('RequestLabelPipe: transforms "title_request" to "Pending Title Change Request"', () => {
    expect(pipe.transform('title_request')).toBe('Pending Title Change Request');
  });
  it('RequestLabelPipe: transforms "agency_request" to "Pending Agency Change Request"', () => {
    expect(pipe.transform('agency_request')).toBe('Pending Agency Change Request');
  });
  it('RequestLabelPipe: transforms "program_number_request" to "Pending Number Change Request"', () => {
    expect(pipe.transform('program_number_request')).toBe('Pending Number Change Request');
  });
  it('RequestLabelPipe: transforms "archive_request" to "Pending Archive Request"', () => {
    expect(pipe.transform('archive_request')).toBe('Pending Archive Request');
  });
  it('RequestLabelPipe: transforms "unarchive_request" to "Pending Unarchive Request"', () => {
    expect(pipe.transform('unarchive_request')).toBe('Pending Unarchive Request');
  });
});
