import {RequestTypeLabelPipe} from "./request-type-label.pipe";

describe('src/app/assistance-listing/pipes/request-type-label.pipe.spec.ts', () => {
  let pipe = new RequestTypeLabelPipe();
  it('RequestLabelPipe: transforms "title_request" to "Title Change Request"', () => {
    expect(pipe.transform('title_request')).toBe('Title Change Request');
  });
  it('RequestLabelPipe: transforms "agency_request" to "Agency Change Request"', () => {
    expect(pipe.transform('agency_request')).toBe('Agency Change Request');
  });
  it('RequestLabelPipe: transforms "program_number_request" to "CFDA Number Change Request"', () => {
    expect(pipe.transform('program_number_request')).toBe('CFDA Number Change Request');
  });
  it('RequestLabelPipe: transforms "archive_request" to "Archive Change Request"', () => {
    expect(pipe.transform('archive_request')).toBe('Archive Change Request');
  });
  it('RequestLabelPipe: transforms "unarchive_request" to "Unarchive Change Request"', () => {
    expect(pipe.transform('unarchive_request')).toBe('Unarchive Change Request');
  });
});
