import {Component, Input, Output, OnInit, EventEmitter, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";
import {AutocompleteConfig} from "sam-ui-kit/types";
import { FALFormErrorService } from '../../fal-form-error.service';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-header-information',
  templateUrl: 'fal-form-header-info.template.html'
})

export class FALFormHeaderInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();
  @ViewChild('agencyPicker') agencyPicker;

  falHeaderInfoForm: FormGroup;

  titleHint:string =`<p>Spell out any acronyms and limit to 144 characters.</p>
           <p><br>The number for a particular program remains constant from one Catalog submission to another.
           The program-title should be a concise description of the program. The use of the principal subject area followed by a dash and the particular application is encouraged.
           For example, use “Adult Education Teacher Training” as opposed to simply “Teacher Training.”
           Generally, the words “Program” and “Project” are superfluous and should not be used.
           The length of program titles should be kept reasonably short (two 72 character lines).</p>`;

  popularNameHint:string=`Many programs do not have a popular name, but if one exists,
                    it may be a name less descriptive than the program title, an acronym,
                     or a reference to legislation by name or number.
                     The program title should not be repeated as the popular name.`;
  agencyPickerHint: string =`List the administering department or independent agency.
                              For Cabinet-level departments, the National Foundation on the Arts and the Humanities,
                               Environmental Protection Agency, and the Federal Emergency Management Agency,
                               the primary organizational subunit name should precede the departmental name.`;
  relatedFalHint: string= `In this section of the program description, agencies should determine whether the programs listed are closely related based first on program objectives,
                          and second on program uses. Programs listed in the Catalog that are administered by other agencies should also be considered for inclusion in this section.
                          Programs being deleted from the Catalog should be taken out of this section.
                          Programs being placed in this section should first be checked against the latest Agency Program Index,
                          or more recent internal information. Programs should be listed in consecutive program number sequence.`;

  //  TODO Remove and replace with call to FH to get cfdaCode using organization id
  falNoPrefix: string = '';
  public falNo = '';
  public organizationId: string;
  public organizationData: any;
  formErrorArr = [];
  review: boolean = false;

  // Related Program multi-select
  rpNGModel: any;
  rpListDisplay = [];
  relProAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
    serviceOptions: {index: 'RP'},
    clearOnSelection: true, showOnEmptyInput: false
  };

  constructor(private fb: FormBuilder, private service: FALFormService, private errorService: FALFormErrorService) {
  }

  ngOnInit() {

    this.createForm();
    this.populateMultiList();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  createForm() {
    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames': [''],
      'programNumber': null,
      'relatedPrograms': '',
      'rpListDisplay': [''],
      'federalAgency': ''
    });

  }

  populateMultiList() {
    if (this.viewModel.relatedPrograms && this.viewModel.relatedPrograms.length > 0) {
      this.service.getRelatedProgramList(this.viewModel.relatedPrograms).subscribe(
        data => this.parseRelatedPrograms(data),
        error => {
          console.error('error retrieving dictionary data', error);
        });
    } else {
      this.falHeaderInfoForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
      });
    }
  }

  parseRelatedPrograms(data: any) {
    for (let dataItem of data) {
      this.rpListDisplay.push({code: dataItem.id, name: dataItem.value});
    }
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(data);
    this.falHeaderInfoForm.patchValue({
      rpListDisplay: this.rpListDisplay
    }, {
      emitEvent: false
    });

    this.falHeaderInfoForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
    });
  }

  updateViewModel(data) {

    let alternativeNames = [];
    let relatedPrograms = [];

    relatedPrograms = this.updateViewModelRelatedPrograms(data['rpListDisplay']);
    alternativeNames.push(data.alternativeNames);

    if (data['programNumber'] === 'undefined')
      data['programNumber'] = null;

    this.viewModel.title = data['title'] || null;
    this.viewModel.alternativeNames = (alternativeNames.length > 0 ? alternativeNames : null);
    this.viewModel.programNumber = data['programNumber'] ? (this.falNoPrefix + data['programNumber']) : null;
    this.viewModel.relatedPrograms = relatedPrograms.length > 0 ? relatedPrograms : [];

    setTimeout(() => {
      this.updateErrors();
    });
  }

  updateViewModelRelatedPrograms(rpListDisplay) {
    let relatedPrograms = [];
    if (rpListDisplay.length > 0) {
      for (let rp of rpListDisplay) {
        relatedPrograms.push(rp.code);
      }
    }
    return relatedPrograms;
  }

  updateForm() {
    let title = this.viewModel.title;

    let popularName = (this.viewModel.alternativeNames.length > 0 ? this.viewModel.alternativeNames[0] : '');

    this.falNo = (this.viewModel.programNumber ? this.viewModel.programNumber : '');

    if (this.falNo.trim().length == 6) {
      //  Need to preserve prefix, TODO: Remove once FH API lookup is established
      this.falNoPrefix = this.falNo.slice(0, 3);
      this.falNo = this.falNo.slice(3, 6);
    }
    else {
      this.falNoPrefix = '';
    }
    //set organization
    this.organizationId = this.viewModel.organizationId;

    //set organization name
    this.service.getOrganization(this.organizationId)
      .subscribe(data => {
        this.organizationData = data['_embedded'][0]['org'];
      }, error => {
        console.error('error retrieving organization', error);
      });

    this.falHeaderInfoForm.patchValue({
      title: title,
      alternativeNames: popularName,
      programNumber: this.falNo,
      federalAgency: this.organizationId
    }, {
      emitEvent: false
    });

    this.markAndUpdateFieldStat('title');
    this.markAndUpdateFieldStat('programNumber');
    this.markAndUpdateFieldStat('federalAgency');
  }

  public onOrganizationChange(org: any) {

    let orgVal;
    if (org) {
      orgVal = org.value;
    }
    else
      orgVal = null;

    this.organizationId = orgVal;
    this.viewModel.organizationId = orgVal;
  }

  relatedProgramTypeChange(event) {
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  relatedProglistChange() {
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(this.falHeaderInfoForm.value.rpListDisplay);
  }

  placeholderMsg(multiArray: any) {
    let PlaceholderMsg = '';
    if (multiArray.length === 1) {
      PlaceholderMsg = 'One Type Selected';
    } else if (multiArray.length > 1) {
      PlaceholderMsg = 'Multiple Types Selected';
    } else {
      PlaceholderMsg = 'None Selected';
    }
    return PlaceholderMsg;
  }

  private updateErrors() {

    this.errorService.viewModel = this.viewModel;

    this.falHeaderInfoForm.get('title').clearValidators();
    this.falHeaderInfoForm.get('title').setValidators((control) => { return control.errors });
    this.falHeaderInfoForm.get('title').setErrors(this.errorService.validateHeaderTitle().errors);
    this.markAndUpdateFieldStat('title');

    this.falHeaderInfoForm.get('programNumber').clearValidators();
    this.falHeaderInfoForm.get('programNumber').setValidators((control) => { return control.errors });
    this.falHeaderInfoForm.get('programNumber').setErrors(this.errorService.validateHeaderProgNo().errors);
    this.markAndUpdateFieldStat('programNumber');

    this.falHeaderInfoForm.get('federalAgency').clearValidators();
    this.falHeaderInfoForm.get('federalAgency').setValidators((control) => { return control.errors });
    this.falHeaderInfoForm.get('federalAgency').setErrors(this.errorService.validateFederalAgency().errors);
    this.markAndUpdateFieldStat('federalAgency');

    this.showErrors.emit(this.errorService.errors);
  }

  private markAndUpdateFieldStat(fieldName){
    setTimeout(() => {

      if(this.agencyPicker && fieldName == 'federalAgency' && this.falHeaderInfoForm.get(fieldName).value == ''){
        this.agencyPicker.touched = true;
        this.agencyPicker.checkForFocus(null);
      }

      this.falHeaderInfoForm.get(fieldName).markAsDirty();
      this.falHeaderInfoForm.get(fieldName).updateValueAndValidity({onlySelf: true, emitEvent: true});

    });

  }

}
