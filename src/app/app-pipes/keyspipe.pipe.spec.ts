import { KeysPipe } from './keyspipe.pipe';




describe('KeysPipe', () => {
  let pipe = new KeysPipe();
  let oJson = {'2014': 'Value1', '2015': 'Value2', '2016':'Value3'};
  let arrays = [{key:'2014', value:'Value1'},{key:'2015', value:'Value2'},{key:'2016', value:'Value3'}];
  it('transforms a json object to an array of objects with properties', () => {
    expect(pipe.transform(oJson,[])).toEqual(arrays);
  });

});
