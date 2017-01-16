import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationPage }   from './organization.page.ts';
import { routing } from './organization.route.ts';
import { SamUIKitModule } from 'ui-kit';
import { PipesModule } from '../app-pipes/app-pipes.module';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    SamUIKitModule,
    PipesModule
  ],
  exports: [
    OrganizationPage
  ],
  declarations: [
    OrganizationPage
  ],
})
export class OrganizationModule { }
