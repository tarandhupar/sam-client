import {Router, CanActivate} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable, Input} from '@angular/core';
import {OpportunityFormViewModel} from '../../opportunity-operations/framework/data-model/opportunity-form/opportunity-form.model';
import {OpportunityFormService} from '../../opportunity-operations/framework/service/opportunity-form/opportunity-form.service';
import { OppNoticeTypeMapService } from '../../opportunity-operations/framework/service/notice-type-map/notice-type-map.service';

@Injectable()
export class OpportunityAuthGuard implements CanActivate {
  @Input() viewModel: OpportunityFormViewModel;
  _oppLinks: any; //store getPermissions() permissions

  constructor(private router: Router, private opportunityFormService: OpportunityFormService, private noticeTypeMapService:OppNoticeTypeMapService) {
  }

  canActivate() {
    if (this.hasCookie()) {
      return this.opportunityFormService.getPermissions().map((res: any) => {
        //Feature Toggle case and managing other cases depending on user permission
        if (res._links != null) {
          this._oppLinks = res;
          return true;
        }

        this.router.navigate(['accessrestricted']);
        return false;
      }).catch(() => {
        this.router.navigate(['accessrestricted']);
        return Observable.of(false);
      });
    } else {
      this.router.navigate(['signin']);
      return false;
    }
  }

  hasCookie() {
    if (this.opportunityFormService.authCookie == undefined) {
      return false;
    }
    return true;
  }

  checkPermissions(screen: string, opportunity: any): boolean {
    this.viewModel = new OpportunityFormViewModel(opportunity);
    let isRestricted: boolean = true;
    let restrictedUrl: string = 'accessrestricted';
    let fragment = '';

    switch (screen) {
      case 'addoredit':
        let url;
        fragment = this.router.url.split('#')[1];

        //add case
        if (this.router.url.indexOf('/add') >= 0) {
          if (this._oppLinks != null && this._oppLinks._links != null && this._oppLinks._links['opportunity:create'] != null && !this.viewModel.title) {
            isRestricted = false;
            url = '/opp/add'.concat('#header');
            this.router.navigateByUrl(url);
          }
        }
        else { //edit
          if (opportunity._links != null && opportunity._links['opportunity:edit'] != null && this.viewModel.title != null) {
            if (this.viewModel.status.code == 'draft') {
              isRestricted = false;
            } else { //any other status different than draft -> kick user out
              restrictedUrl = '/opp/workspace';
            }
          }
        }
        break;
    }

    if (isRestricted) {
      this.router.navigate([restrictedUrl]);
    }

    return !isRestricted;
  }
}
