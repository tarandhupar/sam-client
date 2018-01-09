import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FHTitleCasePipe } from '../../app-pipes/fhTitleCase.pipe';
import { FHRoleModel } from '../../fh/fh-role-model/fh-role-model.model';
import { IBreadcrumb } from 'sam-ui-elements/src/ui-kit/types';

@Component({
  templateUrl: 'create-org.template.html'
})
export class OrgCreatePage {
  orgFormConfig: any;
  orgType: string = '';
  orgParentId: string = '';
  parentOrg: any;
  hierarchyPath: any = [];
  hierarchyPathMap: any = [];
  crumbs: Array<IBreadcrumb> = [];
  creataleOrgType: any = ['office', 'agency', 'department'];

  fhRoleModel: FHRoleModel;
  loadData: boolean = false;
  title: string = 'Federal Hierarchy';

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private fhTitleCasePipe: FHTitleCasePipe
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.orgType = queryParams['orgType'];
      this.orgParentId = queryParams['orgId'];
      this.parentOrg = this.route.snapshot.data['parentOrg'];

      if (this.checkOrgType()) {
        this.orgFormConfig = {
          mode: 'create',
          parentId: this.orgParentId,
          orgType: this.orgType,
          parentOrg: this.parentOrg
        };

        this.setupCrumbs(this.parentOrg);
      }else {
        this._router.navigateByUrl('/404');
      }
    });
  }

  checkOrgType(): boolean {
    return this.creataleOrgType.includes(this.orgType.toLowerCase());
  }

  setupCrumbs(parentOrg) {
    if (parentOrg) {
      this.crumbs.push({
        url: '/org/detail/' + parentOrg.l1OrgKey,
        breadcrumb: this.fhTitleCasePipe.transform(parentOrg.l1Name)
      });
      switch (this.orgType.toLowerCase()) {
        case 'agency':
          this.crumbs.push({ breadcrumb: 'Create Sub-Tier Agency' });
          break;
        case 'office':
          this.crumbs.push({
            url: '/org/detail/' + parentOrg.l2OrgKey,
            breadcrumb: this.fhTitleCasePipe.transform(parentOrg.l2Name)
          });
          this.crumbs.push({ breadcrumb: 'Create Office' });
          break;
        default:
          break;
      }
      return;
    }
    this.crumbs = [
      { url: '/federal-hierarchy', breadcrumb: 'Search Federal Hiearchy' },
      { breadcrumb: 'Create Department/Ind. Agency' }
    ];
  }

  onCreateFormCancel() {
    switch (this.orgType.toLowerCase()) {
      case 'department':
        this._router.navigateByUrl('/federal-hierarchy');
        break;
      case 'agency':
        this._router.navigateByUrl('/org/detail/' + this.parentOrg.l1OrgKey);
        break;
      case 'office':
        this._router.navigateByUrl('/org/detail/' + this.parentOrg.l2OrgKey);
        break;
      default:
        break;
    }
  }
}
