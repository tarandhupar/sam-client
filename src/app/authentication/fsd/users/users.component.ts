import { Component } from '@angular/core';

import { IAMService } from 'api-kit';

import { SamUserDirectoryComponent } from 'app/app-components/user-directory/user-directory.component';

@Component({
  templateUrl: './users.component.html',
  providers: [
    IAMService
  ]
})
export class UsersComponent {
  constructor(private api: IAMService) {}
  ngOnInit() {
    //TODO
  }
}
