describe('Sam Angular Demo Page', () => {

  beforeEach(() => {
    browser.get('/sam-angular');
  });

  it('should have a select button', () => {
    let elems = element.all(by.css('select'));
    expect(elems.count()).toBeGreaterThan(0);
  });

  it('should have some radio buttons', () => {
    let elems = element.all(by.css('input[type=checkbox]'));
    expect(elems.count()).toBeGreaterThan(1);
  });

  it('should have some checkboxes', () => {
    let elems = element.all(by.css('input[type=radio]'));
    expect(elems.count()).toBeGreaterThan(1);
  });


});
