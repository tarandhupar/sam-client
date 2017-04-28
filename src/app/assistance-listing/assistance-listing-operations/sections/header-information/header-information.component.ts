import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FALOpSharedService} from '../../assistance-listing-operations.service';
import {AutocompleteConfig} from "sam-ui-kit/types";
import {Subscription} from "rxjs";


@Component({
  providers: [ProgramService],
  templateUrl: 'header-information.template.html',
})
export class FALHeaderInfoComponent implements OnInit, OnDestroy {
  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falHeaderInfoForm: FormGroup;
  public agency: string;

  // Related Program multi-select
  private relatedProgSub: Subscription;
  rpNGModel: any;
  rpListDisplay = [];
  relProAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
    serviceOptions:{index:'RP'},
 clearOnSelection: true, showOnEmptyInput: false  };


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
      rpListDisplay: ['']
    });
  }

  /**
   * @return Observable of Related Program API
   */
  private populateRelatedProgramMultiList(relatedPrograms: any) {
    this.relatedProgSub = this.programService.falautosearch('', relatedPrograms.join(','))
      .subscribe(data => {
        for (let dataItem of data) {
          this.rpListDisplay.push({code: dataItem.id, name: dataItem.value});
        }
        this.relProAutocompleteConfig.placeholder = this.placeholderMsg(relatedPrograms);
      }, error => {
        console.error('Error Retrieving Related Program!!', error);
      });
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        if(api.data) {
          let title = api.data.title;
          let popularName = (api.data.alternativeNames && api.data.alternativeNames.length > 0 ? api.data.alternativeNames[0] : '');
          let falNo = (api.data.programNumber ? api.data.programNumber : '');

          if (falNo.trim().length == 6)
            falNo = falNo.slice(3, 6);
          if ((api.data.relatedPrograms) && (api.data.relatedPrograms.length > 0)) {
            this.populateRelatedProgramMultiList(api.data.relatedPrograms);

          }
          this.agency = api.data.organizationId;
          this.falHeaderInfoForm.patchValue({
            title: title,
            alternativeNames: popularName,
            programNumber: falNo,
            rpListDisplay: this.rpListDisplay === null ? [] : this.rpListDisplay,
          });
        }
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

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



  saveData() {
    let relatedPrograms= [];
    for(let rp of this.falHeaderInfoForm.value.rpListDisplay) {
      relatedPrograms.push(rp.code);
    }

    let data = {
      "title": this.falHeaderInfoForm.value.title,
      "organizationId": this.agency,
      "alternativeNames": (this.falHeaderInfoForm.value.alternativeNames ? [this.falHeaderInfoForm.value.alternativeNames] : []),
      "programNumber": this.falHeaderInfoForm.value.programNumber,
      "relatedPrograms": relatedPrograms.length > 0 ? relatedPrograms : null
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
