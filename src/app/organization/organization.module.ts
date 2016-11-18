import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationPage }   from './organization.page.ts';
import { routing } from './organization.route.ts';
import { SamUIKitModule } from 'ui-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    SamUIKitModule
  ],
  exports: [
    OrganizationPage,
    CapitalizePipe
  ],
  declarations: [
    OrganizationPage,
    CapitalizePipe
  ],
})
export class OrganizationModule { }
