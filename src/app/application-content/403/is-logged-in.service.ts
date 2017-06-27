import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { AdminLevelService } from "./admin-level.service";

@Injectable()
export class IsLoggedInService {
  constructor(private adminLevelService: AdminLevelService) { }

  isLoggedIn(): boolean {
    return true;
    //return this.adminLevelService.getLevel() < 3;
  }
}
