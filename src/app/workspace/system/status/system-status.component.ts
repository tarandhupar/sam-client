import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IAMService } from 'api-kit';
import { System } from '../system.interface';

@Component({
  templateUrl: './system-status.component.html',
  providers: [
    IAMService,
  ],
})
export class SystemStatusComponent {
  private store = {};
  private states = {
    status: 'Pending Approval',
  };

  public system: System;

  constructor(private route: ActivatedRoute, private router: Router, private api: IAMService) {}

  ngOnInit() {
    this.store['observer'] = this.route.params.subscribe(params => {
      if(params['id']) {
        this.api.iam.system.account.get(params['id'], system => {
          this.system = system;
        }, error => {
          this.router.navigate(['/workspace/system']);
        });
      }
    });

  }

  ngOnDestroy() {
    if(this.store['observer']) {
      this.store['observer'].unsubscribe();
    }
  }
}
