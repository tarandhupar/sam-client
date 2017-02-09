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
import { SamHeaderLinksComponent } from "./header-links/header-links.component";
import { SamHeaderMenuComponent } from './header-menu';
import { SamAlertComponent } from "./alert/alert.component";
import { SamSpinnerComponent } from './spinner/spinner.component';
import { SamAccordionComponent, SamAccordionSection } from "./accordion/accordion.component";
import { SamButtonComponent } from "./form-controls/button/button.component.ts";
import { SamPointOfContactComponent } from "./point-of-contact/point-of-contact.component";
import { SamPaginationComponent } from "./pagination/pagination.component";
import { SamClickOutsideDirective } from "./click-outside/click-outside.directive";
import { SamMultiSelectDropdownComponent } from "./multiselect-dropdown/multiselect-dropdown.component";
import { SamNameEntryComponent } from "./form-controls/name-entry/name-entry.component";
import { SamPhoneEntryComponent } from "./form-controls/phone-entry/phone-entry.component";
import { SamDateComponent } from "./form-controls/date/date.component";
import { SamTimeComponent } from "./form-controls/time";
import { SamDateTimeComponent } from "./form-controls/date-time";
import { SamTextComponent } from "./form-controls/text/text.component";
import { SamTextareaComponent } from "./form-controls/textarea/textarea.component";
import { SamTabComponent } from "./tabs/tabs.component";
import { SamTabsComponent } from "./tabs/tabs.component";
import { InputAutocompleteComponent } from "./form-controls/input-autocomplete/input-autocomplete.component";
import { SamModalComponent } from "./modal/modal.component";
import { SamAlphabetSelectorComponent } from "./alphabet-selector/alphabet-selector.component";
import { AlphabetSelectorService } from "./alphabet-selector/alphabet-selector.component";
import { SamSidenavModule } from './sidenav';

import { SamCollapsibleComponent } from './collapsible';
import { SamSearchFiltersContainerComponent } from '../app/search-layout/search-filters-container';

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamClickOutsideDirective,
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
    SamHeaderLinksComponent,
    SamHeaderMenuComponent,
    SamAlertComponent,
    SamPointOfContactComponent,
    SamMultiSelectDropdownComponent,
    SamNameEntryComponent,
    SamSpinnerComponent,
    SamPhoneEntryComponent,
    SamDateComponent,
    SamTimeComponent,
    SamDateTimeComponent,
    SamTextComponent,
    SamTextareaComponent,
    InputAutocompleteComponent,
    SamModalComponent,
    LabelWrapper,
    FieldsetWrapper,
    SamTabsComponent,
    SamTabComponent,
    SamAlphabetSelectorComponent,
    SamCollapsibleComponent,
    SamSearchFiltersContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    SamSidenavModule
  ],
  exports: [
    LabelWrapper,
    SamClickOutsideDirective,
    SamHeaderComponent,
    SamHeaderLinksComponent,
    SamHeaderMenuComponent,
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
    SamSpinnerComponent,
    SamAlertComponent,
    SamPointOfContactComponent,
    SamMultiSelectDropdownComponent,
    SamNameEntryComponent,
    SamPhoneEntryComponent,
    SamDateComponent,
    SamTimeComponent,
    SamDateTimeComponent,
    SamTextComponent,
    SamTextareaComponent,
    InputAutocompleteComponent,
    SamTabsComponent,
    SamTabComponent,
    SamModalComponent,
    SamAlphabetSelectorComponent,
    SamSidenavModule,
    SamCollapsibleComponent,
    SamSearchFiltersContainerComponent
  ],
  providers: [
    AlphabetSelectorService
  ]
})
export class SamUIKitModule { }
