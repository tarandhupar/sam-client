import { PropertyCollector } from './property-collector';

describe('PropertyCollector', () => {

  it('should collect properties on an object', () => {
    let obj = { a: 1 };
    let path = ['a'];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([1]);
  });

  it('should collect properties on an array', () => {
    let obj = [1, 2];
    let path = [[]];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([1, 2]);
  });

  it('should return an empty array if nothing is found at the path', () => {
    let obj = { a: 1 };
    let path = ['b'];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([]);
  });

  it('should return an empty array if nothing is found at the path', () => {
    let obj = [1, 2];
    let path = ['b'];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([]);
  });

  it('should work with nested objects', () => {
    let obj = { a: { b: { c: 123}}};
    let path = ['a', 'b', 'c'];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([123]);
  });

  it('should work with nested arrays', () => {
    let obj = [ [1, 2, 3], [4, 5] ];
    let path = [[], []];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should work with nested arrays and nested objects', () => {
    let obj = [ { a: [1, 2]}, { a: [3, 4] } ];
    let path = [[], 'a', []];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([1, 2, 3, 4]);
  });

  it('should work with unbalanced trees', () => {
    let obj = [ { a: [1, 2]}, { a: "nope" } ];
    let path = [[], 'a', []];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([1, 2]);
  });

  it('should accept just about anything as input', () => {
    let path = ['a'], coll;
    coll = new PropertyCollector(undefined);
    expect(coll.collect(path)).toEqual([]);
    coll = new PropertyCollector('strings');
    expect(coll.collect(path)).toEqual([]);
    coll = new PropertyCollector(null);
    expect(coll.collect(path)).toEqual([]);
    coll = new PropertyCollector(0);
    expect(coll.collect(path)).toEqual([]);
    coll = new PropertyCollector(false);
    expect(coll.collect(path)).toEqual([]);
  });

  it('should return the item if the path is null', () => {
    let path = [], coll;
    coll = new PropertyCollector(undefined);
    expect(coll.collect(path)).toEqual([]);
    coll = new PropertyCollector('strings');
    expect(coll.collect(path)).toEqual(['strings']);
    coll = new PropertyCollector(null);
    expect(coll.collect(path)).toEqual([null]);
    coll = new PropertyCollector(0);
    expect(coll.collect(path)).toEqual([0]);
    coll = new PropertyCollector(true);
    expect(coll.collect(path)).toEqual([true]);
    coll = new PropertyCollector(false);
    expect(coll.collect(path)).toEqual([false]);
    coll = new PropertyCollector({});
    expect(coll.collect(path)).toEqual([{}]);
  });

  it('should allow numbers to be used as array indices', () => {
    let path = [0];
    let obj: any = [0, 1];
    let coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual([0]);

    path = [0, 1, 0, 1];
    obj = [['no', [['no', 'yes'], 'no']], 'no'];
    coll = new PropertyCollector(obj);
    expect(coll.collect(path)).toEqual(['yes']);
  });
});
