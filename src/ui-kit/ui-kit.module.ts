// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Sam Angular Exports
import { SamSelectComponent } from './form-controls/select';
import { SamMultiSelectComponent } from './form-controls/multiselect';
import { SamCheckboxComponent } from "./form-controls/checkbox";
import { LabelWrapper } from './form-controls/wrapper/label-wrapper.component';
import { FieldsetWrapper } from './form-controls/wrapper/fieldset-wrapper.component';
import { SamRadioButtonComponent } from "./form-controls/radiobutton/radiobutton.component";
import { SamSearchHeaderComponent } from './search-header/search-header.component';
import { SamSearchbarComponent } from "./form-controls/searchbar/searchbar.component";
import { SamBannerComponent } from "./banner/banner.component";
import { SamStickyComponent } from "./sticky/sticky.component";
import { SamFooterComponent } from "./footer/footer.component";
import { SamLabelComponent } from "./label/label.component";
import { SamHeaderComponent } from "./header/header.component";
import { SamAlertComponent } from "./alert/alert.component";
import { SamAccordionComponent, SamAccordionSection } from "./accordion/accordion.component";
import { SamButtonComponent } from "./form-controls/button/button.component.ts";
import { SamPointOfContactComponent } from "./point-of-contact/point-of-contact.component";
import { SamPaginationComponent } from "./pagination/pagination.component";
import { SamClickOutsideDirective } from "./click-outside/click-outside.directive";
import { SamHeaderLinksComponent } from "./header-links/header-links.component";
import { SamMultiSelectDropdownComponent } from "./multiselect-dropdown/multiselect-dropdown.component";
import { SamNameEntryComponent } from "./form-controls/name-entry/name-entry.component";
import { SamPhoneEntryComponent } from "./form-controls/phone-entry/phone-entry.component";
import { SamDateEntryComponent } from "./form-controls/date-entry/date-entry.component";
import { SamTextComponent } from "./form-controls/text/text.component";
import { SamTextareaComponent } from "./form-controls/textarea/textarea.component";
import { InputAutocompleteComponent } from "./form-controls/input-autocomplete/input-autocomplete.component";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamClickOutsideDirective,
    SamHeaderLinksComponent,
    SamPaginationComponent,
    SamAccordionComponent,
    SamAccordionSection,
    SamButtonComponent,
    SamLabelComponent,
    SamSelectComponent,
    SamMultiSelectComponent,
    SamCheckboxComponent,
    SamRadioButtonComponent,
    SamSearchbarComponent,
    SamBannerComponent,
    SamSearchHeaderComponent,
    SamStickyComponent,
    SamFooterComponent,
    SamHeaderComponent,
    SamAlertComponent,
    SamPointOfContactComponent,
    SamMultiSelectDropdownComponent,
    SamNameEntryComponent,
    SamPhoneEntryComponent,
    SamDateEntryComponent,
    SamTextComponent,
    SamTextareaComponent,
    InputAutocompleteComponent,
    LabelWrapper,
    FieldsetWrapper,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    SamClickOutsideDirective,
    SamHeaderLinksComponent,
    SamPaginationComponent,
    SamAccordionComponent,
    SamAccordionSection,
    SamButtonComponent,
    SamLabelComponent,
    SamSelectComponent,
    SamMultiSelectComponent,
    SamCheckboxComponent,
    SamRadioButtonComponent,
    SamSearchbarComponent,
    SamBannerComponent,
    SamSearchHeaderComponent,
    SamStickyComponent,
    SamFooterComponent,
    SamHeaderComponent,
    SamAlertComponent,
    SamPointOfContactComponent,
    SamMultiSelectDropdownComponent,
    SamNameEntryComponent,
    SamPhoneEntryComponent,
    SamDateEntryComponent,
    SamTextComponent,
    SamTextareaComponent,
    InputAutocompleteComponent,
  ],
  providers: [ ]
})
export class SamUIKitModule { }
