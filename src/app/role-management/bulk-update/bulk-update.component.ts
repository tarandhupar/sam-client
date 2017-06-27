import {Component} from "@angular/core";
import {UserAccessService} from "api-kit/access/access.service";

@Component({
  templateUrl: './bulk-update.template.html'
})
export class BulkUpdateComponent {
  constructor(private userAccessService: UserAccessService) {

  }


}
