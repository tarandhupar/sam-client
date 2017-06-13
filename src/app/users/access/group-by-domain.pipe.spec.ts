import { GroupByDomainPipe } from './group-by-domain.pipe';

describe('GroupByDomainPipe', () => {
  let pipe = new GroupByDomainPipe();

  it('should group together roleData items, if they have the same domain', () => {
    let dat = [
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain": { id: 1, val: 'My Domain'},
        "email":"brendan.mcdonough@gsa.gov"
      },
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain": { id: 1, val: 'My Domain'},
        "email":"brendan.mcdonough@gsa.gov"
      }
    ];
    let domains = pipe.transform(dat);
    expect(domains.length).toEqual(1);
    expect(domains[0].id === 1);
  });

  it('should not group together roleData items if all the domains are distinct', () => {
    let dat = [
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain": { id: 1, val: 'My Domain'},
        "email":"brendan.mcdonough@gsa.gov"
      },
      {
        "organizationContent": { "orgKey":"100186605", },
        "domain": { id: 2, val: 'My Domain 2'},
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
