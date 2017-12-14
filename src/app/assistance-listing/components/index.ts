import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FALAccountIdentificationCodeComponent } from './account-indentification-code/account-indentification-code.component';
import { SamCheckboxToggledTextareaComponent } from './checkbox-toggled-textarea/checkbox-toggled-textarea.component';
import { SamTextRadioButtonComponent } from './text-radio/text-radio-button.component';
import { FALAuthSubFormComponent } from './authorization-subform/authorization-subform.component';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { ReactiveFormsModule } from '@angular/forms';
import { FALFormulaMatchingComponent } from "./formula-matching/formula-matching.component";
import { FALAuthInfoTableComponent } from "./authorization-table/authorization-table.component";
import { FALFiscalYearTableComponent } from "./fiscal-year-table/fiscal-year-table.component";
import { FALObligationFYTableComponent } from "./obligation-table/obligation-table.component";
import { FALObligationSubFormComponent } from "./obligation-subform/obligation-subform.component";
import { FALContactInfoTableComponent } from "./contact-information-table/contact-information-table.component";
import { FALChangeRequestDropdownComponent } from "./change-request-dropdown/change-request-dropdown.component";
import { FALWrapperChangeRequestDropdownComponent } from "./change-request-dropdown/wrapper-change-request-dropdown.component";
import { FeedsFilterComponent } from "./feeds-filter/feeds-filter.component";
import {
  FALErrorDisplayComponent,
  FALErrorDisplayHelperComponent
} from './fal-error-display/fal-error-display.component';
import { PipesModule } from '../../app-pipes/app-pipes.module';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { TabsFalComponent } from "./tabs/tabs-fal.component";
import {FALAuthGuard} from "./authguard/authguard.service";
import {SamFALTextComponent} from "./fal-text/fal-text.component";
import {CheckActiveAssistanceAdministratorComponent} from './check-active-assistance-administrator/check-active-assistance-administrator.component';

@NgModule({
  imports: [
    CommonModule,
    SamUIKitModule,
    ReactiveFormsModule,
    AppComponentsModule,
    PipesModule
  ],
  declarations: [
    FALAccountIdentificationCodeComponent,
    SamCheckboxToggledTextareaComponent,
    SamTextRadioButtonComponent,
    FALFormulaMatchingComponent,
    FALAuthSubFormComponent,
    FALAuthInfoTableComponent,
    FALFiscalYearTableComponent,
    FALObligationFYTableComponent,
    FALObligationSubFormComponent,
    FALChangeRequestDropdownComponent,
    FALWrapperChangeRequestDropdownComponent,
    FALContactInfoTableComponent,
    FeedsFilterComponent,
    FALErrorDisplayComponent,
    FALErrorDisplayHelperComponent,
    SamFALTextComponent,
    CheckActiveAssistanceAdministratorComponent,
    TabsFalComponent
  ],
  exports: [
    FALAccountIdentificationCodeComponent,
    SamCheckboxToggledTextareaComponent,
    SamTextRadioButtonComponent,
    FALFormulaMatchingComponent,
    FALAuthSubFormComponent,
    FALAuthInfoTableComponent,
    FALFiscalYearTableComponent,
    FALObligationFYTableComponent,
    FALObligationSubFormComponent,
    FALChangeRequestDropdownComponent,
    FALWrapperChangeRequestDropdownComponent,
    FALContactInfoTableComponent,
    FeedsFilterComponent,
    FALErrorDisplayComponent,
    SamFALTextComponent,
    CheckActiveAssistanceAdministratorComponent,
    TabsFalComponent
  ],
  providers: [
    FALAuthGuard
  ],
})
export class FALComponentsModule {}
