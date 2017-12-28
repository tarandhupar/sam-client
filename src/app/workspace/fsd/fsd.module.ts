import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from 'app-components/app-components.module';
import { UsersModule } from 'users/users.module';
import { PipesModule } from 'app-pipes/app-pipes.module';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { FSDRouter } from './fsd.route';
import { FSDGuard } from './fsd.guard';
import { IsLoggedInGuard } from 'app-services/is-logged-in.guard';
import { RmAccessGuard } from 'app-services/rm-access.guard';

import { FSDUserResolve } from './fsd-user/fsd-user.resolve';
import { UserResolve } from 'role-management/user.resolve';

import { UserService } from 'role-management/user.service';

import { FSDComponent } from './fsd.component';
import { FSDUserComponent } from './fsd-user/fsd-user.component';
import { FSDUsersComponent } from './fsd-users/fsd-users.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    UsersModule,
    PipesModule,
    Ng2PageScrollModule.forRoot(),
    FSDRouter,
  ],

  declarations: [
    FSDComponent,
    FSDUserComponent,
    FSDUsersComponent,
  ],

  providers: [
    IsLoggedInGuard,
    FSDGuard,
    FSDUserResolve
    RmAccessGuard,
    UserResolve,
    UserService,
  ],
})
export class FSDModule { }
