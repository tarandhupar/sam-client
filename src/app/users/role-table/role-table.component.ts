import { Component, Input, ViewChild, EventEmitter, Output, OnInit} from '@angular/core';
import { SamModalComponent } from "sam-ui-kit/components/modal";
import { UserAccessModel } from "../access.model";
import {UserAccessService} from "../../../api-kit/access/access.service";

@Component({
  selector: 'role-table',
  templateUrl:'role-table.template.html'
})
export class RoleTable implements OnInit {
  @Input() roles: Array<RoleTableRow>;
  @Input() userName: string;
  @Input() isAdmin: boolean;
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  private roleToDelete: RoleTableRow;
  private indexToDelete: number;

  constructor(private userService: UserAccessService){ }


  ngOnInit(){
    //console.log(this.userName);
    //this.getFunctionPermission();
  }

  onDeleteClick(role, index) {
    this.roleToDelete = role;
    this.indexToDelete = index;
    this.deleteModal.openModal();
  }

  clickfuncPerm(role){
    role.testFlag = !role.testFlag;
    //console.log(role);
    this.getFunctionPermission(role,role.domainId,role.organizationId, role.roleId);
  }

  getFunctionPermission(role,domainId, orgId, roleId){    
    this.userService.getAccess(this.userName,{ domainKey: domainId, orgKey: orgId, roleKey: roleId },true).subscribe(res=>{
      //console.log(res);
      role.funcperm = res.domainMapContent[0].roleMapContent[0].organizationMapContent[0].functionMapContent;
      //console.log(role.funcperm);
    });
  }


  onDeleteConfirm(index) {
    let { domainId, roleId, organizationId} = this.roleToDelete;
    let deleteBody = UserAccessModel.CreateDeletePartial(this.userName, roleId, domainId, [organizationId]);
    this.userService.postAccess(deleteBody, this.userName).subscribe(
      res => {
        this.deleteRow.emit();
        this.deleteModal.closeModal();
      }, err => {

      }, () => {

      });
  }
}

export type RoleTableRow = {
  organization: string,
  organizationId: any,
  domain: string,
  domainId: any,
  path: Array<any>|string,
  queryParams: any,
  role: string,
  roleId: any,
  isDeletable: boolean,
}
