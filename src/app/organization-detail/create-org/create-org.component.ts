import { Component, Input, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { Observable } from 'rxjs';
import { Location } from "@angular/common";
import { IAMService } from "api-kit";
import { FHRoleModel } from "../../fh/fh-role-model/fh-role-model.model";

@Component ({
  templateUrl: 'create-org.template.html'
})
export class OrgCreatePage {

  orgFormConfig: any;
  orgType: string = "";
  orgParentId: string = "";
  hierarchyPath: any = [];
  hierarchyPathMap: any = [];

  fhRoleModel: FHRoleModel;
  loadData: boolean = false;

  constructor(private builder: FormBuilder,
              private _router: Router,
              private route: ActivatedRoute,
              private fhService: FHService,
              public flashMsgService: FlashMsgService,
              private location: Location,
              private iamService: IAMService) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(queryParams => {
      this.orgType = queryParams["orgType"];
      this.orgParentId = queryParams["parentID"];
      this.orgFormConfig = {
        mode: 'create',
        parentId: this.orgParentId,
        orgType: this.orgType,
      };
      this.iamService.iam.checkSession(this.checkAccess, this.redirectToSignin);

    });

  }

  checkAccess = (user) => {
    let accessOrg = "";
    if (this.orgType.toLowerCase() !== "department") accessOrg = this.orgParentId;
    this.fhService.getAccess(accessOrg).subscribe(
      (data) => {
        if(accessOrg === ""){
          this.loadData = true;
        }else {
          this.fhService.getOrganizationDetail(accessOrg).subscribe(
            val => {
              this.setupHierarchyPathMap(val._embedded[0].org.fullParentPath, val._embedded[0].org.fullParentPathName);
              this.fhRoleModel = FHRoleModel.FromResponse(val);
              let checkPermissionType = this.orgType.toLowerCase();
              if(checkPermissionType === "majcommand" || checkPermissionType === "subcommand") checkPermissionType = "office";
              if (!this.fhRoleModel.hasPermissionType("POST", checkPermissionType)) {
                this.redirectToForbidden();
              } else {
                this.loadData = true;
              }
            });
        }

      },
      (error) => {
        if (error.status === 403) this.redirectToForbidden();
      }
    );
  };

  redirectToSignin = () => { this._router.navigateByUrl('/signin')};
  redirectToForbidden = () => {this._router.navigateByUrl('/403')};

  setupHierarchyPathMap(fullParentPath:string, fullParentPathName:string){
    this.hierarchyPath = fullParentPathName.split('.').map( e => {
      return e.split('_').join(' ');
    });
    let parentOrgIds = fullParentPath.split('.');
    this.hierarchyPathMap = [];
    parentOrgIds.forEach((elem,index) => {
      this.hierarchyPathMap[this.hierarchyPath[index]] = elem;
    });

  }

  onChangeOrgDetail(hierarchyName){
    this._router.navigate(['organization-detail', this.hierarchyPathMap[hierarchyName],'profile'])
  }
}
