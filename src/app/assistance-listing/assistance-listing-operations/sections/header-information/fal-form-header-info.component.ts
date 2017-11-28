import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { ProgramService } from "../../../../../api-kit/program/program.service";
import { falCustomValidatorsComponent } from "../../../validators/assistance-listing-validators";
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALSectionNames } from '../../fal-form.constants';
import { FALFormViewModel } from "../../fal-form.model";
import { FALFormService } from "../../fal-form.service";
import { AutocompleteConfig } from "../../../../../sam-ui-elements/src/ui-kit/types";
import { Subscription } from 'rxjs/Subscription';

@Component({
  providers: [FALFormService, ProgramService],
  selector: 'fal-form-header-information',
  templateUrl: 'fal-form-header-info.template.html'
})

export class FALFormHeaderInfoComponent implements OnInit, OnDestroy {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();

  falHeaderInfoForm: FormGroup;

  titleHint: string = `<p>Spell out any acronyms and limit to 144 characters.</p>
           <p><br>The number for a particular program remains constant from one Catalog submission to another.
           The program-title should be a concise description of the program. The use of the principal subject area followed by a dash and the particular application is encouraged.
           For example, use “Adult Education Teacher Training” as opposed to simply “Teacher Training.”
           Generally, the words “Program” and “Project” are superfluous and should not be used.
           The length of program titles should be kept reasonably short (two 72 character lines).</p>`;

  popularNameHint: string = `Many programs do not have a popular name, but if one exists,
                    it may be a name less descriptive than the program title, an acronym,
                     or a reference to legislation by name or number.
                     The program title should not be repeated as the popular name.`;
  agencyPickerHint: string = `List the administering department or independent agency.
                              For Cabinet-level departments, the National Foundation on the Arts and the Humanities,
                               Environmental Protection Agency, and the Federal Emergency Management Agency,
                               the primary organizational subunit name should precede the departmental name.`;
  relatedFalHint: string = `In this section of the program description, agencies should determine whether the programs listed are closely related based first on program objectives,
                          and second on program uses. Programs listed in the Catalog that are administered by other agencies should also be considered for inclusion in this section.
                          Programs being deleted from the Catalog should be taken out of this section.
                          Programs being placed in this section should first be checked against the latest Agency Program Index,
                          or more recent internal information. Programs should be listed in consecutive CFDA number sequence.`;

  //  TODO Remove and replace with call to FH to get cfdaCode using organization id
  falNoPrefix: string = '';
  public falNo = '';
  public organizationData: any;
  public orgLevels: any;
  public orgRoot: any = [];
  toggleAgencyPicker: boolean = true;
  OrganizationDataOnRole: any;
  autoProgNoGeneration: boolean = true;
  programNumberLow: number;
  programNumberHigh: number;

  private subscriptions: Subscription = new Subscription();

  // Related Program multi-select
  rpNGModel: any;
  relProAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    serviceOptions: {index: 'RP'},
  };

  constructor(private fb: FormBuilder, private service: FALFormService, private errorService: FALFormErrorService, private programService: ProgramService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createForm();
    this.getOrganizationLevels();

    if (!this.viewModel.isNew) {
      this.updateForm();
    }

    this.subscribeToChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createForm() {
    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames': [''],
      'programNumber':  null,
      'relatedPrograms': '',
      'federalAgency': ''
    });

    this.cdr.detectChanges();
    if (this.viewModel.getSectionStatus(FALSectionNames.HEADER) === 'updated') {
      this.falHeaderInfoForm.get('title').markAsDirty();
      this.falHeaderInfoForm.get('title').updateValueAndValidity();
      this.falHeaderInfoForm.get('alternativeNames').markAsDirty();
      this.falHeaderInfoForm.get('alternativeNames').updateValueAndValidity();
      this.falHeaderInfoForm.get('relatedPrograms').markAsDirty();
      this.falHeaderInfoForm.get('relatedPrograms').updateValueAndValidity();
      this.falHeaderInfoForm.get('federalAgency').markAsDirty();
      this.falHeaderInfoForm.get('federalAgency').updateValueAndValidity();
      this.falHeaderInfoForm.markAsPristine({onlySelf: true});
      this.falHeaderInfoForm.get('programNumber').markAsDirty({onlySelf: true});
      this.falHeaderInfoForm.get('programNumber').updateValueAndValidity();
    }
  }

  getOrganizationLevels() {
    this.service.getFALPermission('ORG_LEVELS').subscribe(res => {
      this.orgLevels = res.ORG_LEVELS;
      if (res && res.ORG_LEVELS) {
        if (res.ORG_LEVELS.level === 'none') {
          this.toggleAgencyPicker = false;
          this.orgRoot = [res.ORG_LEVELS.org];
        } else if (res.ORG_LEVELS.org === 'all') {
          this.orgRoot = [];
        } else {
          this.orgRoot = [res.ORG_LEVELS.org];
        }
        let orgId = this.orgRoot.length > 0 ? this.orgRoot[0] : '';
        this.getOrganizationName(orgId);
      }
    });
  }

  getOrganizationName(orgId: any) {
    //set organization name
    this.service.getOrganization(orgId)
      .subscribe(data => {
        if(data && data['_embedded'] && data['_embedded'][0] && data['_embedded'][0]['org']) {
          this.organizationData = data['_embedded'][0]['org'];
          if (this.viewModel.isNew && !this.toggleAgencyPicker) {
            this.falHeaderInfoForm.get('federalAgency').patchValue(this.organizationData.orgKey, {
              emitEvent: false
            });
            this.viewModel.organizationId = this.organizationData.orgKey;
            this.getFHConfig(this.organizationData.orgKey, '');
          }
        }
      }, error => {
        console.error('error retrieving organization', error);
      });
  }

  updateForm() {
    let title = this.viewModel.title;

    let popularName = (this.viewModel.alternativeNames.length > 0 ? this.viewModel.alternativeNames[0] : '');

    this.falNo = (this.viewModel.programNumber ? this.viewModel.programNumber : '');

    let falNoDotIndex = this.falNo.indexOf('.');
    if (falNoDotIndex !== -1) {
      //  Need to preserve prefix, TODO: Remove once FH API lookup is established
      this.falNoPrefix = this.falNo.slice(0, falNoDotIndex);
      this.falNo = this.falNo.slice(falNoDotIndex+1);
    }
    else {
      this.falNoPrefix = '';
    }

    //set organization
    let organizationId = this.viewModel.organizationId;
    this.getOrganizationName(organizationId);

    this.falHeaderInfoForm.patchValue({
      title: title,
      alternativeNames: popularName,
      programNumber: this.falNo,
      federalAgency: organizationId
    }, {
      emitEvent: false
    });

    //set related programs
    this.populateMultiList();

    this.cdr.detectChanges();
    this.updateErrors();
  }

  getFHConfig(orgId, progNo) {
    this.service.getFederalHierarchyConfiguration(orgId).subscribe(data => {

      this.autoProgNoGeneration = data.programNumberAuto;

      if(!this.autoProgNoGeneration) {
        this.service.getCfdaCode(orgId).subscribe( (code) => {
          this.falNoPrefix = code.content.cfdaCode;
          this.viewModel.programNumber = progNo ? (this.falNoPrefix + '.' + progNo.replace(/\./g, '')) : null;
          this.setCustomValidatorsForFALNo(progNo, code, orgId);
          this.falHeaderInfoForm.get('programNumber').patchValue(progNo, {
            emitEvent: true
          });
        });
      }
    });
  }

  setCustomValidatorsForFALNo(programNumber, code, orgId){
    if(programNumber !== null && programNumber !== '' && orgId !== null && orgId !== '') {
      this.falHeaderInfoForm.get('programNumber').setValidators(falCustomValidatorsComponent.isProgramNumberInTheRange(this.programNumberLow, this.programNumberHigh));

      if((this.falHeaderInfoForm.get('programNumber').errors && this.falHeaderInfoForm.get('programNumber').errors == null) || !this.falHeaderInfoForm.get('programNumber').errors) {
        this.falHeaderInfoForm.get('programNumber')
          .setAsyncValidators(falCustomValidatorsComponent.isProgramNumberUnique(this.programService, code.content.cfdaCode, this.viewModel.programId, FALFormService.getAuthenticationCookie(), orgId));
      }
    }
  }

  populateMultiList() {
    if (this.viewModel.relatedPrograms && this.viewModel.relatedPrograms.length > 0) {
      this.service.getRelatedProgramList(this.viewModel.relatedPrograms).subscribe(
        data => this.parseRelatedPrograms(data),
        error => {
          console.error('error retrieving dictionary data', error);
        });
    }
  }

  parseRelatedPrograms(data: any) {
    let rpListDisplay = [];
    for (let dataItem of data) {
      rpListDisplay.push({code: dataItem.id, name: dataItem.value});
    }
    this.falHeaderInfoForm.patchValue({
      relatedPrograms: rpListDisplay
    }, {
      emitEvent: false
    });
  }

  // todo: public for testing purposes
  public updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.updateTitleError();
    this.updateFederalAgencyError();
    this.updateProgNoError();
  }

  private updateTitleError() {
    this.falHeaderInfoForm.get('title').clearValidators();
    this.falHeaderInfoForm.get('title').setValidators((control) => {
      return control.errors
    });
    this.falHeaderInfoForm.get('title').setErrors(this.errorService.validateHeaderTitle().errors);
    this.markAndUpdateFieldStat('title');

    this.emitErrorEvent();
  }

  private updateFederalAgencyError() {

    this.falHeaderInfoForm.get('federalAgency').clearValidators();
    this.falHeaderInfoForm.get('federalAgency').setValidators((control) => {
      return control.errors
    });
    this.falHeaderInfoForm.get('federalAgency').setErrors(this.errorService.validateFederalAgency().errors);
    this.markAndUpdateFieldStat('federalAgency');
    this.emitErrorEvent();
  }

  private updateProgNoError() {

    this.errorService.validateHeaderProgNo()
      .subscribe(res => {

      this.falHeaderInfoForm.get('programNumber').clearValidators();
      this.falHeaderInfoForm.get('programNumber').setValidators((control) => {
        if(control.pristine)
          return null;
        else
          return control.errors;
      });
      this.falHeaderInfoForm.get('programNumber').setErrors(res.errors);
      this.markAndUpdateFieldStat('programNumber');
      this.emitErrorEvent();
    });
  }

  private emitErrorEvent() {
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private markAndUpdateFieldStat(fieldName) {
    this.falHeaderInfoForm.get(fieldName).updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  // needed as a workaround to provide a synchronous method of saving title
  public updateTitle() {
    this.saveTitle(this.falHeaderInfoForm.get('title').value);
  }

  subscribeToChanges(){
    this.linkControlTo(this.falHeaderInfoForm.get('title'), this.saveTitle);
    this.linkControlTo(this.falHeaderInfoForm.get('alternativeNames'), this.saveAlternativeNames);
    this.linkControlTo(this.falHeaderInfoForm.get('federalAgency'), this.saveAgency);
    this.linkControlTo(this.falHeaderInfoForm.get('programNumber'), this.saveProgramNo);
    this.linkControlTo(this.falHeaderInfoForm.get('relatedPrograms'), this.saveRelatedPrograms)
  }

  private linkControlTo(control: AbstractControl, callback: (value: any) => void): void {
    let boundCallback = callback.bind(this);
    this.subscriptions.add(
      control
      .valueChanges
      .debounceTime(10)
      .distinctUntilChanged()
      .subscribe(value => {
        boundCallback(value);
      })
    );
  }

  private saveTitle(title) {
    this.viewModel.title = title;
    this.cdr.detectChanges();
    this.updateTitleError();
  }

  private saveAlternativeNames(altName) {
    let alternativeNames = [];
    alternativeNames.push(altName);
    this.viewModel.alternativeNames = (alternativeNames.length > 0 ? alternativeNames : null);
  }

  private saveAgency(federalAgency) {

    if(federalAgency) {
      let orgId = '';
      let progId = '';
      if (typeof federalAgency === 'object')
        orgId = federalAgency.orgKey;
      else
        orgId = federalAgency;

      if(this.viewModel.organizationId !== orgId) {
        progId = '';
        this.clearFALField();
      }
      else {
        progId = this.falHeaderInfoForm.get('programNumber').value;
      }

      this.getFHConfig(orgId, progId);

      this.viewModel.organizationId = orgId;
    }
    else {
      this.autoProgNoGeneration = true;
      this.viewModel.organizationId = null;
      this.clearFALField();
      this.falHeaderInfoForm.get('programNumber').patchValue('', {
        emitEvent: false
      });
    }

    this.cdr.detectChanges();
    this.updateFederalAgencyError();
    this.updateProgNoError();
  }

  private clearFALField() {
    this.viewModel.programNumber = null;
    this.falHeaderInfoForm.get('programNumber').clearAsyncValidators();
    this.falHeaderInfoForm.get('programNumber').clearValidators();
  }

  private saveProgramNo(progNo) {
    this.getFHConfig(this.viewModel.organizationId, progNo);
    this.viewModel.programNumber = progNo ? (this.falNoPrefix + '.' + progNo.replace(/\./g, '')) : null;
    this.cdr.detectChanges();
    this.updateProgNoError();
  }

  private saveRelatedPrograms(progList) {
    let relatedPrograms = [];
    relatedPrograms = this.updateViewModelRelatedPrograms(progList);
    this.viewModel.relatedPrograms = relatedPrograms.length > 0 ? relatedPrograms : [];
  }

  updateViewModelRelatedPrograms(rpListDisplay) {
    let relatedPrograms = [];
    if (rpListDisplay && rpListDisplay.length > 0) {
      for (let rp of rpListDisplay) {
        relatedPrograms.push(rp.code);
      }
    }
    return relatedPrograms;
  }
}
