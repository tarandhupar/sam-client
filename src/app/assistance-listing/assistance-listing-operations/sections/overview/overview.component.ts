import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';
import {AutocompleteConfig} from "sam-ui-kit/types";
import {DictionaryService} from "../../../../../api-kit/dictionary/dictionary.service";

@Component({
  providers: [ ProgramService, DictionaryService ],
  templateUrl: 'overview.template.html',
})
export class FALOverviewComponent implements OnInit, OnDestroy{

  getProgSub: any;
  saveProgSub: any;
  dictSTSub: any;
  dictFCSub: any;

  redirectToWksp: boolean = false;
  falOverviewForm: FormGroup;
  programId : any;
  title: string;

  //Functional Codes Multiselect
  @ViewChild('fcListDisplay') fcListDisplay;
  fcTypeOptions = [];
  fcKeyValue = [];
  fcInitialSelection = [];
  fcMultiArrayValues = [];
  fcSelectedOption: any;
  fcAutocompleteConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}, placeholder: 'None Selected'};

  //Subject Terms Multiselect
  stMultiArrayValues = [];
  @ViewChild('stListDisplay') stListDisplay;
  stInitialSelection = [];
  stSelectedOption: any;
  stAutocompleteConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}, placeholder: 'None Selected',serviceOptions:{index:'D'}};
  listConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}};

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService,
              private dictionaryService: DictionaryService) {

    this.sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
    this.dictFCSub = dictionaryService.getDictionaryById('functional_codes')
      .subscribe(data => {
        for (let fcData of data['functional_codes']) {
          this.fcTypeOptions.push({code: fcData.element_id, name: fcData.value});
          this.fcKeyValue[fcData.element_id] = fcData.value;
        }
      });
  }

  ngOnInit() {
    this.createForm();
    if (this.sharedService.programId) {
      this.getData();
    }
  }

  ngOnDestroy(){
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();
    if (this.getProgSub)
      this.getProgSub.unsubscribe();
    if (this.dictSTSub)
      this.dictSTSub.unsubscribe();
    if (this.dictFCSub)
      this.dictFCSub.unsubscribe();
  }

  createForm() {
    this.falOverviewForm = this.fb.group({
      'objective': '',
      'falDesc':'',
      'functionalCodes': '',
      'fcInitialSelection': '',
      'subjectTerms' :[''],
      'stInitialSelection':['']
    });
  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        this.title = api.data.title;
        let objective = (api.data.objective ? api.data.objective : '');
        let desc = (api.data.description ? api.data.description : '');
          if ((api.data.subjectTerms) && (api.data.subjectTerms.length > 0)) {
            this.populateMultiList(api.data.subjectTerms,'ST');
          }
          if ((api.data.functionalCodes) && (api.data.functionalCodes.length > 0)) {
            this.populateMultiList(api.data.functionalCodes,'FC');

          }
        this.falOverviewForm.patchValue({
            objective:objective,
            falDesc:desc,
            stInitialSelection: this.stInitialSelection === null ? [] : this.stInitialSelection,
            fcInitialSelection: this.fcInitialSelection === null ? [] : this.fcInitialSelection,
          });
      },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }
  populateMultiList(multiTypeData: any, multiType: string) {
    if(multiType === 'ST') {
      this.dictSTSub = this.dictionaryService.getDictionaryById('program_subject_terms', '100',multiTypeData.join(','))
        .subscribe(data => {
          for (let dataItem of data['program_subject_terms']) {
            this.stInitialSelection.push({code: dataItem.element_id, name: dataItem.value});
            this.stMultiArrayValues.push(dataItem.element_id);
          }
          this.stAutocompleteConfig.placeholder = this.placeholderMsg(this.stMultiArrayValues);
        }, error => {
          console.error('Error Retrieving Related Program!!', error);
        });
    } else if(multiType === 'FC') {
      for (let id of multiTypeData) {
        this.fcInitialSelection.push({code:id, name:this.fcKeyValue[id]});
        this.fcMultiArrayValues.push(id);
      }
      this.fcAutocompleteConfig.placeholder = this.placeholderMsg(this.fcMultiArrayValues);
    }

  }

  stTypeChange(event) {
    let isDuplicate: boolean;
    const control = this.falOverviewForm.controls['subjectTerms'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      isDuplicate = this.removeDuplicates(control.value, this.stListDisplay.selectedItems);
      if (!isDuplicate) {
        this.stSelectedOption = control.value;
        this.stMultiArrayValues.push(control.value.code);
        this.removeListDuplicates(this.stMultiArrayValues);
        this.stAutocompleteConfig.placeholder = this.placeholderMsg(this.stMultiArrayValues);
      }
    }
  }
  stlistChange(event) {
    this.stMultiArrayValues = [];
    for (let selItem of this.stListDisplay.selectedItems) {
      this.stMultiArrayValues.push(selItem.code);
    }
    this.stAutocompleteConfig.placeholder = this.placeholderMsg(this.stMultiArrayValues);
  }

  fcTypeChange(event) {
    let isDuplicate: boolean;
    const control = this.falOverviewForm.controls['functionalCodes'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      isDuplicate = this.removeDuplicates(control.value, this.fcListDisplay.selectedItems);
      if (!isDuplicate) {
        this.fcSelectedOption = control.value;
        this.fcMultiArrayValues.push(control.value.code);
        this.removeListDuplicates(this.fcMultiArrayValues);
        this.fcAutocompleteConfig.placeholder = this.placeholderMsg(this.fcMultiArrayValues);
      }
    }
  }
  fclistChange(event) {
    this.fcMultiArrayValues = [];
    for (let selItem of this.fcListDisplay.selectedItems) {
      this.fcMultiArrayValues.push(selItem.code);
    }
    this.fcAutocompleteConfig.placeholder = this.placeholderMsg(this.fcMultiArrayValues);
  }

  removeListDuplicates(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j])
          arr.splice(j, 1);
      }
    }
    return arr;
  }

  removeDuplicates(obj: any, list: any) {
    let unique: boolean = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].code === obj.code) {
        unique = true;
      }
    }
    return unique;
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

  saveData() {

    let data = {
      "objective": this.falOverviewForm.value.objective,
      "description": this.falOverviewForm.value.falDesc,
      "functionalCodes": this.fcMultiArrayValues.length > 0 ? this.fcMultiArrayValues : null,
      "subjectTerms": this.stMultiArrayValues.length > 0 ? this.stMultiArrayValues : null
    };
    console.log(data, 'final save');

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Overview', api);

          if(this.redirectToWksp)
            this.router.navigate(['falworkspace']);
          else
            this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/authorization']);

        },
        error => {
          console.error('Error saving Program!!', error);
        }); //end of subscribe
  }

  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
    else
      this.router.navigate(['/falworkspace']);
  }

  onPreviousClick(event){
    if(this.sharedService.programId)
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/header-information']);
    else
      this.router.navigate(['programs/add/header-information']);

  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {
    this.saveData();
  }
}
