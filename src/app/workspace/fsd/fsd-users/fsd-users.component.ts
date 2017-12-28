import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { IAMService } from 'api-kit';
import { SamUserDirectoryComponent } from 'app-components/user-directory/user-directory.component';

@Component({
  templateUrl: './fsd-users.component.html',
})
export class FSDUsersComponent {
  private subscription: Subscription;
  private directory = {
    search: '',
  };

  constructor(private route: ActivatedRoute, private api: IAMService) {}

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.directory.search = params['search'] || '';
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  router(user) {
    return ['/workspace/fsd/user', user._id];
  }
}
