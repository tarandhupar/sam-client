import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PeoplePickerService } from 'api-kit';
import { User } from 'api-kit/iam/api/core/user';

@Component({
  selector: 'fsd-widget',
  templateUrl: './fsd-widget.component.html'
})
export class FSDWidgetComponent {
  private accounts = [];
  private store = {
    picker: {
      placeholder: 'Search users',
      keyValueConfig: {
        keyProperty: 'mail',
        valueProperty: 'commonName',
        subheadProperty: 'mail'
      }
    }
  };

  constructor(private router: Router, private api: PeoplePickerService) {}

  ngOnInit() {
    let params = {
      fle:     '%', // Hack to bypass search phrase requirement
      orderBy: 'lastLogin',
      dir:     'asc',
      page:    0,
      size:    3
    };

    this.api.getList(params).subscribe(data => {
      let users = data._embedded.ldapUserResources;
      this.accounts = users.map(item => new User(item.user));
    }, error => {
      // Fallback for when 'lastLogin' is permitted by the API for sorting
      params.orderBy = 'lastName';
      this.api.getList(params).subscribe(data => {
        let users = data._embedded.ldapUserResources;
        this.accounts = users.map(item => new User(item.user));
      });
    });
  }

  search(user) {
    user = new User(user);

    this.router.navigate(['workspace/fsd/users'], {
      queryParams: {
        search: user.fullName,
      }
    });
  }
}
