import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationPage }   from './organization.page.ts';
import { routing } from './organization.route.ts';
import { SamUIKitModule } from 'sam-ui-kit';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AppComponentsModule } from '../app-components/app-components.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SamUIKitModule,
    PipesModule,
    AppComponentsModule
  ],
  exports: [
    OrganizationPage
  ],
  declarations: [
    OrganizationPage
  ],
})
export class OrganizationModule { }
