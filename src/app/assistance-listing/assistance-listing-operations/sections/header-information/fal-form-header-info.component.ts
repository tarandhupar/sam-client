import {Component, Input, Output, OnInit, ViewChild, EventEmitter} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";
import {AutocompleteConfig} from "sam-ui-kit/types";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-header-information',
  templateUrl: 'fal-form-header-info.template.html'
})

export class FALFormHeaderInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public onError = new EventEmitter();
  @ViewChild('agencyPicker') agencyPicker;
  falHeaderInfoForm: FormGroup;

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

  constructor(private fb: FormBuilder, private service: FALFormService) {
  }

  ngOnInit() {
    this.createForm();
    this.populateMultiList();
    if (!this.viewModel.isNew) {
      this.updateForm();
      this.collectErrors();
    }
  }

  createForm() {
    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames': [''],
      'programNumber': null,
      'relatedPrograms': '',
      'rpListDisplay': ['']
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
      this.falHeaderInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));
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

    this.falHeaderInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));
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

    this.collectErrors();
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
    }, {
      emitEvent: false
    });

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
    this.checkAgencyPickerforErrors();

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

  validateSection() {

    this.review = true;
    setTimeout(() => {
      if(this.agencyPicker){
        this.agencyPicker.touched = true;
        this.agencyPicker.checkForFocus(null);
        this.checkAgencyPickerforErrors();
      }
    }, 10);

    for (let key of Object.keys(this.falHeaderInfoForm.controls)) {
      this.falHeaderInfoForm.controls[key].markAsDirty();
      this.falHeaderInfoForm.controls[key].updateValueAndValidity();
    }

    if(this.formErrorArr.length > 0)
      this.emitEvent();
  }

  collectErrors(){
    for(let key of Object.keys(this.falHeaderInfoForm.controls)) {
      this.checkControlforErrors(key);
    }
  }

  checkControlforErrors(key){

    let len = this.formErrorArr.length;
    let index = this.formErrorArr.indexOf(key);

    if(this.falHeaderInfoForm.controls[key].errors){
      if(index == -1) {
        this.formErrorArr.push(key);
      }
    }
    else {
      if(index > -1) {
        this.formErrorArr.splice(index, 1);
      }
    }

    if(len !== this.formErrorArr.length && this.review){
      this.emitEvent();
    }
  }

  checkAgencyPickerforErrors(){
    let len = this.formErrorArr.length;
    if(this.agencyPicker.searchMessage !== ''){
      this.formErrorArr.push('agencyPicker');
    }
    else {
      let index = this.formErrorArr.indexOf('agencyPicker');
      if(index > -1)
        this.formErrorArr.splice(index, 1);
    }

    if(len !== this.formErrorArr.length && this.review){
      this.emitEvent();
    }

  }

  emitEvent(){
    this.onError.emit({
      formErrorArr: this.formErrorArr,
      section: 'header-information'
    });
  }

}
