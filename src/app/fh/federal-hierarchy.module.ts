import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { routing } from './federal-hierarchy.route';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { FederalHierarchyPage } from "./federal-hierarchy.page";
import { FHSideNav } from "./fh-sidenav/fh-sidenav.component";

@NgModule({
  imports: [
    routing,
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    Ng2PageScrollModule.forRoot()
  ],
  exports: [],
  declarations: [
    FederalHierarchyPage,
    FHSideNav,
  ],
  providers: [],
})
export class FederalHierarchyModule { }
