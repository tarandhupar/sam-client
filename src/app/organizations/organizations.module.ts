import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrganizationsPage }   from './organizations.page';
import { routing } from './organizations.route';

@NgModule({
  imports: [
    BrowserModule,
    routing,
  ],
  exports: [
    OrganizationsPage,
  ],
  declarations: [
    OrganizationsPage,
  ],
})
export class OrganizationsModule { }
