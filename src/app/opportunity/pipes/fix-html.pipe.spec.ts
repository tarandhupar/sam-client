import { FixHTMLPipe } from "./fix-html.pipe";

describe('FixHTMLPipe', () => {
  let pipe = new FixHTMLPipe();

  it('it removes ascii space', () => {
    expect(pipe.transform('&nbsp;')).toBe('');
  });

  it('it removes empty tags', () => {
    expect(pipe.transform('<span></span><div></div>')).toBe('');
  });

  it('it removes inline styles', () => {
    expect(pipe.transform('<div style="color: black;">')).toBe('<div>');
  });

  it('it removes strong tags', () => {
    expect(pipe.transform('<strong></strong>')).toBe('');
  });

  it('it removes break tags', () => {
    expect(pipe.transform('<br /><br/><br><br     />')).toBe('');
  });

  it('it removes span tags', () => {
    expect(pipe.transform('<span></span>')).toBe('');
  });

});
