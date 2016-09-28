import { FilterMultiArrayObjectPipe } from './filter-multi-array-object.pipe'

describe('FilterMultiArrayObjectPipe Test', () => {
  let pipe = new FilterMultiArrayObjectPipe();
  let aData: any[] = [{
      "id": "1",
      "value": "Foo",
      "elements": [
          {
            "id": "11",
            "value": "Foo 1.1",
          },
          {
            "id": "12",
            "value": "Foo 1.2",
          }
      ]
    }, {
      "id": "2",
      "value": "Bar"
  }];

  it('Not found', () => {
    expect(pipe.transform(["3"], aData, "id", false, "")).toEqual([]);
  });

  it('Not nested: Single array', () => {
    expect(pipe.transform(["2"], aData, "id", false, "")).toEqual([{"id": "2", "value": "Bar"}]);
  });

  it('Nested array', () => {
    expect(pipe.transform(["11"], aData, "id", true, "elements")).toEqual([{"id": "11", "value": "Foo 1.1"}]);
  });
});