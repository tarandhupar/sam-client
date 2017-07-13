import {ActionHistoryLabelPipe} from "./action-history-label.pipe";

describe('src/app/assistance-listing/pipes/action-history-label.pipe.spec.ts', () => {
  let pipe = new ActionHistoryLabelPipe();
  it('ActionHistoryLabelPipe: transforms "retract" to "Program Retracted"', () => {
    expect(pipe.transform('retract')).toBe('Program Retracted');
  });
  it('ActionHistoryLabelPipe: transforms "publish" to "Revision Published"', () => {
    expect(pipe.transform('publish')).toBe('Revision Published');
  });
  it('ActionHistoryLabelPipe: transforms "reject_program" to "Program Rejected"', () => {
    expect(pipe.transform('reject_program')).toBe('Program Rejected');
  });
  it('ActionHistoryLabelPipe: transforms "archive_reject" to "Archive Request Rejected"', () => {
    expect(pipe.transform('archive_reject')).toBe('Archive Request Rejected');
  });
  it('ActionHistoryLabelPipe: transforms "archive" to "Program Archived"', () => {
    expect(pipe.transform('archive')).toBe('Program Archived');
  });
  it('ActionHistoryLabelPipe: transforms "archive_cancel" to "Archive Request Cancelled"', () => {
    expect(pipe.transform('archive_cancel')).toBe('Archive Request Cancelled');
  });
});
