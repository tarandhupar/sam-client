import { NgModule } from '@angular/core';
import { SamUIKitModule } from 'sam-ui-kit';
import { RMSUserServiceImpl, SamRMSUsersServiceAutoDirective } from "./request-access/username-autocomplete.component";

@NgModule({
  imports: [
  ],
  exports: [
    SamRMSUsersServiceAutoDirective
  ],
  declarations: [
    SamRMSUsersServiceAutoDirective,
  ],
  providers: [
    RMSUserServiceImpl,
  ],
})
export class UserSearchModule { }
