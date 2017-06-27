import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FHService } from "api-kit/fh/fh.service";
import {Cookie} from "ng2-cookies";

@Injectable()
export class UserRoleDetailsResolve implements Resolve<any> {
  constructor(
    private accessService: UserAccessService,
    private router: Router,
    private fhService: FHService
  )
  {

  }

  resolve(route: ActivatedRouteSnapshot) {
    let oid = route.queryParams['org'];
    let did = route.queryParams['domain'];
    let rid = route.queryParams['role'];
    let uid = route.params['id'];

    if (!uid) {
      let u = Cookie.get('IAMSession');
      let uo = JSON.parse(u);
      uid = uo.uid;
    }

    if (!oid || !uid || !did) {
      this.router.navigate(['/404']);
      return Observable.throw('parameter missing')
    }

    return this.accessService
      .getAccess(uid, { domainKey: did, orgKey: oid, roleKey: rid }, false)
      .map(res => {
        if (res.status === 204) {
          this.router.navigate(['/404']);
          return Observable.throw('access object not found');
        }
        return res.json();
      })
      .map(json => {
        let objects = json.domainMapContent[0].roleMapContent[0].organizationMapContent[0].functionMapContent.map(func => {
          let perms = func.permission.map(perm => perm.val);
          return {
            name: func.function.val,
            permissions: perms
          };
        });

        return <any>{
          name: json.id,
          domain: json.domainMapContent[0].domain.val,
          domainId: json.domainMapContent[0].domain.id,
          role: json.domainMapContent[0].roleMapContent[0].role.val,
          roleId: json.domainMapContent[0].roleMapContent[0].role.id,
          organizationId: json.domainMapContent[0].roleMapContent[0].organizationMapContent[0].organizations[0],
          objects: objects
        };
      })
      .switchMap(details => {
        return this.fhService.getOrganizations({orgKey: details.organizationId})
          .catch(() => {
            // if org name service is down show Organization name unavailable text
            return Observable.of(details);
          })
          .map(res => {
            if (!res || !res._embedded.orgs.length) {
              details.organization = "Organization name unavailable";
            } else {
              details.organization = res._embedded.orgs[0].org.name;
            }
            return details;
          });
      });
  }
}
