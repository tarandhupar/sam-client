import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FALAccountIdentificationComponent } from './account-identification/account-identification.component';
import { SamCheckboxToggledTextareaComponent } from './checkbox-toggled-textarea/checkbox-toggled-textarea.component';
import { FALTafsComponent } from './tafs/tafs.component';
import { SamTextRadioButtonComponent } from './text-radio/text-radio-button.component';
import { SamUIKitModule } from 'sam-ui-kit';
import { ReactiveFormsModule } from '@angular/forms';

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
    SamTextRadioButtonComponent
  ],
  exports: [
    FALAccountIdentificationComponent,
    SamCheckboxToggledTextareaComponent,
    FALTafsComponent,
    SamTextRadioButtonComponent
  ]
})
export class FALComponentsModule {}
