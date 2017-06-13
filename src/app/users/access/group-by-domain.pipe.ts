import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'groupByDomain'})
export class GroupByDomainPipe implements PipeTransform {
  transform(roleData): any[] {
    let domains = new Map();
    for (let orgDomainEmail of roleData) {
      const domainId = orgDomainEmail.domain.id;

      if (!domains.has(domainId)) {
        const domainValue = orgDomainEmail.domain.val;
        let newDomain = {
          id: domainId,
          val: domainValue,
          organizations: [ orgDomainEmail.organizationMapContent ]
        };
        domains.set(domainId, newDomain);
      } else {
        domains.get(domainId).organizations.push(orgDomainEmail.organizationMapContent);
      }
    }
    return Array.from(domains.values());
  }
}
