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
        //if(data.status == '404' || data.status == '401') {
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

  checkPermissions(screen: string, viewModel: any) {
    switch (screen) {
      case 'addoredit':
        let url;
        if (this.router.url.indexOf('/add') >= 0) {
          if (!viewModel.title) {
            url = '/opportunities/add'.concat('#header-information');
            this.router.navigateByUrl(url);
          }
        } else {
          if (!viewModel.title) {
            url = '/opportunities/' + viewModel.opportunityId + '/edit'.concat('#header-information');
            this.router.navigateByUrl(url);
          }
        }
        break;
    }
  }
}
