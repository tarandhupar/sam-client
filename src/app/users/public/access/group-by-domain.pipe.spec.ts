import { GroupByDomainPipe } from './group-by-domain.pipe';

fdescribe('GroupByDomainPipe', () => {
  let pipe = new GroupByDomainPipe();

  it('should group together roleData items, if they have the same domain', () => {
    let dat = [];
    expect(pipe.transform(dat).length).toEqual(1);
  });

  it('should return an empty array if roleData is empty', () => {
    let dat = [];
    expect(pipe.transform(dat).length).toEqual(0);
  });

  it('should not group together roleData items if all the domains are distinct', () => {
    let dat = [];
    expect(pipe.transform(dat).length).toEqual(2);
  });
});
