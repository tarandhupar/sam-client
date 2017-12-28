import { FixHTMLPipe } from "./fix-html.pipe";

describe('src/app/opportunity/pipes/fix-html.pipe.spec.ts', () => {
  let pipe = new FixHTMLPipe();

  it('FixHTMLPipe: it removes ascii space', () => {
    expect(pipe.transform('&nbsp;')).toBe('');
  });

  it('FixHTMLPipe: it removes empty tags', () => {
    expect(pipe.transform('<span></span><div></div>')).toBe('');
  });

  it('FixHTMLPipe: it removes inline styles', () => {
    expect(pipe.transform('<div style="color: black;">')).toBe('<div>');
  });

  it('FixHTMLPipe: it removes strong tags', () => {
    expect(pipe.transform('<strong></strong>')).toBe('');
  });

  it('FixHTMLPipe: it removes break tags', () => {
    expect(pipe.transform('<br /><br/><br><br     />')).toBe('');
  });

  it('FixHTMLPipe: it removes span tags', () => {
    expect(pipe.transform('<span></span>')).toBe('');
  });

});
