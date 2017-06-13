import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { SamModalComponent } from "sam-ui-kit/components/modal";
import { UserAccessModel } from "../access.model";
import {UserAccessService} from "../../../api-kit/access/access.service";

@Component({
  selector: 'role-table',
  templateUrl:'role-table.template.html'
})
export class RoleTable {
  @Input() roles: Array<RoleTableRow>;
  @Input() userName: string;
  @Output() deleteRow: EventEmitter<any> = new EventEmitter();
  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  private roleToDelete: RoleTableRow;
  private indexToDelete: number;

  constructor(private userService: UserAccessService){ }

  onDeleteClick(role, index) {
    this.roleToDelete = role;
    this.indexToDelete = index;
    this.deleteModal.openModal();
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
