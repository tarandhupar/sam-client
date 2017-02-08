import { GroupByDomainPipe } from './group-by-domain.pipe';

describe('GroupByDomainPipe', () => {
  let pipe = new GroupByDomainPipe();

  it('should group together roleData items, if they have the same domain', () => {
    let dat = [
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain":1,
        "email":"brendan.mcdonough@gsa.gov"
      },
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain":1,
        "email":"brendan.mcdonough@gsa.gov"
      }
    ];
    let newDat = pipe.transform(dat);
    expect(newDat.length).toEqual(1);
    expect(newDat[0].domain.id === 1);
  });

  it('should not group together roleData items if all the domains are distinct', () => {
    let dat = [
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain":1,
        "email":"brendan.mcdonough@gsa.gov"
      },
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain":2,
        "email":"brendan.mcdonough@gsa.gov"
      }
    ];
    expect(pipe.transform(dat).length).toEqual(2);
  });

  it('should return an empty array if roleData is empty', () => {
    let dat = [];
    expect(pipe.transform(dat).length).toEqual(0);
  });
});
