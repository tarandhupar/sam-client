import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FALAccountIdentificationComponent } from './account-identification/account-identification.component';
import { SamCheckboxToggledTextareaComponent } from './checkbox-toggled-textarea/checkbox-toggled-textarea.component';
import { FALTafsComponent } from './tafs/tafs.component';
import { SamTextRadioButtonComponent } from './text-radio/text-radio-button.component';
import { FALAuthSubFormComponent } from './authorization-subform/authorization-subform.component';
import { SamUIKitModule } from 'sam-ui-kit';
import { ReactiveFormsModule } from '@angular/forms';
import { FALFormulaMatchingComponent } from "./formula-matching/formula-matching.component";
import { FALAuthInfoTableComponent } from "./authorization-table/authorization-table.component";
import { FALFiscalYearTableComponent } from "./fiscal-year-table/fiscal-year-table.component";
import { FALAssistSubFormComponent } from "./applying-assistance-subform/applying-assistance-subform.component";
import { FALAssistInfoTableComponent } from './applying-assistance-table/applying-assistance-table.component';

@NgModule({
  imports: [
    CommonModule,
    SamUIKitModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FALAccountIdentificationComponent,
    SamCheckboxToggledTextareaComponent,
    FALTafsComponent,
    SamTextRadioButtonComponent,
    FALFormulaMatchingComponent,
    FALAuthSubFormComponent,
    FALAuthInfoTableComponent,
    FALAssistSubFormComponent,
    FALAssistInfoTableComponent,
    FALFiscalYearTableComponent
  ],
  exports: [
    FALAccountIdentificationComponent,
    SamCheckboxToggledTextareaComponent,
    FALTafsComponent,
    SamTextRadioButtonComponent,
    FALFormulaMatchingComponent,
    FALAuthSubFormComponent,
    FALAuthInfoTableComponent,
    FALFiscalYearTableComponent,
    FALAssistSubFormComponent,
    FALAssistInfoTableComponent
  ]
})
export class FALComponentsModule {}
