import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FALAccountIdentificationComponent } from './account-identification/account-identification.component';
import { SamCheckboxToggledTextareaComponent } from './checkbox-toggled-textarea/checkbox-toggled-textarea.component';
import { FALTafsComponent } from './tafs/tafs.component';
import { SamTextRadioButtonComponent } from './text-radio/text-radio-button.component';
import { FALAuthSubFormComponent } from './authorization-subform/authorization-subform.component';
import { SamUIKitModule } from 'sam-ui-kit';
import { ReactiveFormsModule } from '@angular/forms';
import { FALAuthInfoTableComponent } from "./authorization-table/authorization-table.component";


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
    FALAuthSubFormComponent,
    FALAuthInfoTableComponent
  ],
  exports: [
    FALAccountIdentificationComponent,
    SamCheckboxToggledTextareaComponent,
    FALTafsComponent,
    SamTextRadioButtonComponent,
    FALAuthSubFormComponent,
    FALAuthInfoTableComponent
  ]
})
export class FALComponentsModule {}
