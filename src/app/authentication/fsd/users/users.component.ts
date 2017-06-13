import { Component } from '@angular/core';
import { IAMService } from 'api-kit';

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
