import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from 'app-components/app-components.module';
import { PipesModule } from 'app-pipes/app-pipes.module';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { SystemSectionsModule } from './create/tabs/system-sections.module';

import { SystemRouter } from './system.route';
import { SystemGuard } from './system.guard';
import { IsLoggedInGuard } from 'application-content/403/is-logged-in.guard';

import {
  SystemComponent,
  SystemCreateComponent,
  SystemDirectoryComponent,
  SystemListingComponent,
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
  SystemStatusComponent,
} from './';

import { FileValueAccessorDirective } from 'app-directives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    PipesModule,
    Ng2PageScrollModule.forRoot(),
    SystemSectionsModule,
    SystemRouter,
  ],

  declarations: [
    SystemComponent,
    SystemCreateComponent,
    SystemDirectoryComponent,
    SystemListingComponent,
    SystemProfileComponent,
    SystemPasswordComponent,
    SystemMigrationsComponent,
    SystemStatusComponent,

    FileValueAccessorDirective,
  ],

  providers: [
    IsLoggedInGuard,
    SystemGuard,
  ],
})
export class SystemModule { }
