import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationPage }   from './organization.page.ts';
import { routing } from './organization.route.ts';

@NgModule({
  imports: [
    BrowserModule,
    routing,
  ],
  exports: [
    OrganizationPage,
  ],
  declarations: [
    OrganizationPage,
  ],
})
export class OrganizationModule { }
