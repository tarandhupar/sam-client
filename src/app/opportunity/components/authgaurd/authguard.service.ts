import { Router, CanActivate } from '@angular/router';
import { Injectable, Input } from '@angular/core';
import { OpportunityFormViewModel } from '../../opportunity-operations/framework/data-model/opportunity-form.model';
import { OpportunityFormService } from '../../opportunity-operations/framework/service/opportunity-form.service';


@Injectable()
export class OpportunityAuthGuard implements CanActivate {
  @Input() viewModel: OpportunityFormViewModel;
  location: any;

  constructor(private router: Router, private service: OpportunityFormService) {
  }

  canActivate() {

    let asyncCallFinishedFlag = false;
    if(this.hasCookie()) {
      this.service.isOpportunityEnabled().subscribe(data => {
        if(data.status == '404') {
          this.router.navigate(['accessrestricted']);
          return false;
        }
        asyncCallFinishedFlag = true;
      });
    }
    else {
      this.router.navigate(['signin']);
      return false;
    }

    if(asyncCallFinishedFlag)
      return true;
  }

  hasCookie() {
    if(OpportunityFormService.getAuthenticationCookie() == undefined) {
      return false;
    }
    return true;
  }
}
