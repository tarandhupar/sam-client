import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FALOpSharedService} from '../../assistance-listing-operations.service';
import {AutocompleteConfig} from "sam-ui-kit/types";
import {ReplaySubject, Subscription} from "rxjs";


@Component({
  providers: [ProgramService],
  templateUrl: 'header-information.template.html',
})
export class FALHeaderInfoComponent implements OnInit, OnDestroy {
  data: any;
  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falHeaderInfoForm: FormGroup;
  getRelatedProgSub: any;
  getProgramsSub: any;
  relatedPrograms = [];
  listOfPrograms: string;
  listOptions = [];
  public agency: string;

  // Related Program multi-select
  private relatedProgSub: Subscription;
  realtedProgramsData = [];
  relatedProgInitialSelection = [];
  relatedProgKeyValue = [];
  realtedProgMultiArrayValues = [];
  relatedProgSelectedOption: any;
  @ViewChild('relatedProgListDisplay') relatedProgListDisplay;
  listConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}};
  relatedProgModel: any = '';
  relatedProgramConfig = {
    config: {
      keyValueConfig: {
        keyProperty: 'code',
        valueProperty: 'name'
      }
    },
    placeholder: 'None Selected',
    name: 'test'
  };
  relProAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected'
  };


  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService) {
    this.sharedService.setSideNavFocus();
  }

  ngOnInit() {

    this.createForm();

    if (this.sharedService.programId) {
      this.getData();
    }
  }

  ngOnDestroy() {
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();

    if (this.getProgramsSub)
      this.getProgramsSub.unsubscribe();

    if (this.getRelatedProgSub)
      this.getRelatedProgSub.unsubscribe();

    if (this.relatedProgSub)
      this.relatedProgSub.unsubscribe();
  }

  createForm() {

    //this.getPrograms();

    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames': '',
      'programNumber': '',
      'relatedTo': '',
      relatedProgInitialSelection: ['']
    });
  }

  /**
   * @return Observable of Related Program API
   */
  private populateRelatedProgramMultiList(relatedPrograms: any) {
    this.relatedProgSub = this.programService.falautosearch('', relatedPrograms.join(','))
      .subscribe(data => {
        this.data = data;
        for (let dataItem of data) {
          this.relatedProgInitialSelection.push({code: dataItem.id, name: dataItem.value});
          this.realtedProgMultiArrayValues.push(dataItem.id);
        }
        this.relProAutocompleteConfig.placeholder = this.placeholderMsg(this.realtedProgMultiArrayValues);
      }, error => {
        console.error('Error Retrieving Related Program!!', error);
      });
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          let title = api.data.title;
          let popularName = (api.data.alternativeNames.length > 0 ? api.data.alternativeNames[0] : '');
          let falNo = (api.data.programNumber ? api.data.programNumber : '');

          if (falNo.trim().length == 6)
            falNo = falNo.slice(3, 6);
          if (api.data.relatedPrograms.length > 0) {
            this.populateRelatedProgramMultiList(api.data.relatedPrograms);

          }
          this.agency = api.data.organizationId;
          this.falHeaderInfoForm.patchValue({
            title: title,
            alternativeNames: popularName,
            programNumber: falNo,
            relatedProgInitialSelection: this.relatedProgInitialSelection === null ? [] : this.relatedProgInitialSelection,
          });
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  relatedProgramTypeChange(event) {
    let isDuplicate: boolean;
    const control = this.falHeaderInfoForm.controls['relatedTo'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      isDuplicate = this.removeDuplicates(control.value, this.relatedProgListDisplay.selectedItems);
      if (!isDuplicate) {
        this.relatedProgSelectedOption = control.value;
        this.realtedProgMultiArrayValues.push(control.value.code);
        this.removeListDuplicates(this.realtedProgMultiArrayValues);
        this.relProAutocompleteConfig.placeholder = this.placeholderMsg(this.realtedProgMultiArrayValues);
      }
    }
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

  relatedProglistChange(event) {
    this.realtedProgMultiArrayValues = [];
    for (let selItem of this.relatedProgListDisplay.selectedItems) {
      this.realtedProgMultiArrayValues.push(selItem.code);
    }
    this.relProAutocompleteConfig.placeholder = this.placeholderMsg(this.realtedProgMultiArrayValues);
  }


  saveData() {

    let data = {
      "title": this.falHeaderInfoForm.value.title,
      "organizationId": this.agency,
      "alternativeNames": (this.falHeaderInfoForm.value.alternativeNames ? [this.falHeaderInfoForm.value.alternativeNames] : []),
      "programNumber": this.falHeaderInfoForm.value.programNumber,
      "relatedPrograms": this.realtedProgMultiArrayValues.length > 0 ? this.realtedProgMultiArrayValues : null
    };
    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Header Info', api);

          if (this.redirectToWksp)
            this.router.navigate(['falworkspace']);
          else
            this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/overview']);

        },
        error => {
          console.error('Error saving Program!!', error);
        }); //end of subscribe
  }

  public onOrganizationChange(org: any) {
    this.agency = org.value;
  }

  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
    else
      this.router.navigate(['/falworkspace']);

  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {

    this.saveData();
  }

}
