import { Component, OnInit } from '@angular/core';
import { UserService } from "api-kit/user/user.service";
import {UserAccessModel} from "../../access.model";


@Component({
  templateUrl: 'access.template.html'
})
export class UserAccessPage implements OnInit {

  private userAccessModel: UserAccessModel;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAccess('00.T.BRENDAN.MCDONOUGH@GSA.GOV').subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
    });
  }
}
