import { GroupByPipe } from './group-by.pipe';

describe('src/app/app-pipes/group-by.pipe.spec.ts', () => {
  let pipe = new GroupByPipe();
  it('GroupByPipe: lodash groupby', () => {
    expect(pipe.transform(["aaa","bbb","ccccc"], "length")[1]['items'][0]).toBe("ccccc");
  });
});
