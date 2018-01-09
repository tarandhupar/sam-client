import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WageDeterminationPage} from './wage-determination.page';
import {WageDeterminationDocumentPage} from "./wage-determination-document.page";
import {routing} from './wage-determination.route';
import {PipesModule} from '../app-pipes/app-pipes.module';
import {SamUIKitModule} from 'sam-ui-elements/src/ui-kit';
import {AppComponentsModule} from '../app-components/app-components.module';
import {WageDeterminationRevisedDBAPage} from 'app/wage-determination/to-be-revised/revised-dba.page';
import {CBAFormModule} from "./operations/cba-form.module";
import {CbaPage} from 'app/wage-determination/cba/wd-cba.page';
import {CBADocumentPage} from "./cba/wd-cba-document.page";

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    routing,
    SamUIKitModule,
    AppComponentsModule,
    CBAFormModule
  ],
  exports: [
    WageDeterminationPage,
    WageDeterminationDocumentPage,
    CBADocumentPage
  ],
  declarations: [
    WageDeterminationPage,
    WageDeterminationDocumentPage,
    WageDeterminationRevisedDBAPage,
    CbaPage,
    CBADocumentPage
  ],
})

export class WageDeterminationModule {
}
