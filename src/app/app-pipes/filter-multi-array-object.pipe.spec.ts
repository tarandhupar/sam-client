import { FilterMultiArrayObjectPipe } from './filter-multi-array-object.pipe';

describe('src/app/app-pipes/filter-multi-array-object.pipe.spec.ts', () => {
  let pipe = new FilterMultiArrayObjectPipe();
  let aData: any[] = [{
      'id': '1',
      'value': 'Foo',
      'elements': [
          {
            'id': '11',
            'value': 'Foo 1.1',
          },
          {
            'id': '12',
            'value': 'Foo 1.2',
          }
      ]
    }, {
      'id': '2',
      'value': 'Bar'
  }, {
    'id': '3',
    'value': 'Bar',
    'elements': [
      {
        'id': '33',
        'value': 'Foo 3.1',
        'elements': [
          {
            'id': '333',
            'value': 'Foo 33.1'
          }
        ]
      }
    ]
  }
  ];

  it('FilterMultiArrayObjectPipe Test: Not found', () => {
    expect(pipe.transform(['4'], aData, 'id', false, '')).toEqual([]);
  });

  it('FilterMultiArrayObjectPipe Test: Not nested: Single array', () => {
    expect(pipe.transform(['2'], aData, 'id', false, '')).toEqual([{'id': '2', 'value': 'Bar'}]);
  });

  it('FilterMultiArrayObjectPipe Test: Nested array', () => {
    expect(pipe.transform(['11'], aData, 'id', true, 'elements')).toEqual([{'id': '11', 'value': 'Foo 1.1'}]); //second level
    expect(pipe.transform(['333'], aData, 'id', true, 'elements')).toEqual([{'id': '333', 'value': 'Foo 33.1'}]); ///third level
  });
});
