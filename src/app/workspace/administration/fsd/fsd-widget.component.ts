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
        keyProperty:     'email',
        valueProperty:   'givenName',
        subheadProperty: 'email'
      }
    }
  };

  constructor(private router: Router, private api: PeoplePickerService) {}

  ngOnInit() {
    let params = {
      fle:     '%', // Hack to bypass search phrase requirement
      orderBy: 'lastName',
      dir:     'asc',
      page:    0,
    };

    this.api.getFilteredList(params).subscribe(data => {
      let users = data._embedded.userResources;
      this.accounts = users.map(item => new User(item.user)).slice(0, 3);
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
