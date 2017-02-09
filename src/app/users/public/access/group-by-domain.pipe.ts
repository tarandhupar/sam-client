import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'groupByDomain'})
export class GroupByDomainPipe implements PipeTransform {
  transform(roleData): any[] {
    let domains = new Map();
    for (let orgDomainEmail of roleData) {
      const domainId = orgDomainEmail.domain;
      if (!domains.has(domainId)) {
        let newDomain = {
          id: domainId,
          organizations: [ orgDomainEmail.organizationContent ]
        };
        domains.set(domainId, newDomain);
      } else {
        domains.get(domainId).organizations.push(orgDomainEmail.organizationContent);
      }
    }
    return Array.from(domains.values());
  }
}
