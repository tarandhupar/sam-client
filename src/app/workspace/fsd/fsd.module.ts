import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from 'app-components/app-components.module';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { FSDRouter } from './fsd.route';
import { FSDGuard } from './fsd.guard';
import { IsLoggedInGuard } from 'application-content/403/is-logged-in.guard';

import { FSDComponent } from './fsd.component';
import { FSDUserComponent } from './fsd-user/fsd-user.component';
import { FSDUsersComponent } from './fsd-users/fsd-users.component';
import { UserService } from 'role-management/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    Ng2PageScrollModule.forRoot(),
    FSDRouter,
  ],

  declarations: [
    FSDComponent,
    FSDUserComponent,
    FSDUsersComponent,
  ],

  providers: [
    UserService,
    IsLoggedInGuard,
    FSDGuard,
  ],
})
export class FSDModule { }
