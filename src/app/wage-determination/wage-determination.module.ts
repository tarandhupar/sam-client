import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WageDeterminationPage }   from './wage-determination.page';
import { WageDeterminationDocumentPage } from "./wage-determination-document.page";
import { routing } from './wage-determination.route';
import { PipesModule } from '../app-pipes/app-pipes.module';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { WageDeterminationRevisedDBAPage } from 'app/wage-determination/to-be-revised/revised-dba.page';
import { CbaPage } from 'app/wage-determination/cba/wd-cba.page';


@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    routing,
    SamUIKitModule,
    AppComponentsModule
  ],
  exports: [
    WageDeterminationPage,
    WageDeterminationDocumentPage
  ],
  declarations: [
    WageDeterminationPage,
    WageDeterminationDocumentPage,
    WageDeterminationRevisedDBAPage,
    CbaPage,
  ],
})
export class WageDeterminationModule { }
