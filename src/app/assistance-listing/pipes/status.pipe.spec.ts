import {StatusPipe} from "./status.pipe";

describe('src/app/assistance-listing/pipes/status.pipe.spec.ts', () => {
  let pipe = new StatusPipe();
  it('StatusPipe: transforms "rejected" to "Rejected"', () => {
    expect(pipe.transform('rejected')).toBe('Rejected');
  });
  it('StatusPipe: transforms "pending" to "Pending"', () => {
    expect(pipe.transform('pending')).toBe('Pending');
  });
  it('StatusPipe: transforms "draft" to "Draft"', () => {
    expect(pipe.transform('draft')).toBe('Draft');
  });
  it('StatusPipe: transforms "draft_review" to "Draft Review"', () => {
    expect(pipe.transform('draft_review')).toBe('Draft Review');
  });
});
