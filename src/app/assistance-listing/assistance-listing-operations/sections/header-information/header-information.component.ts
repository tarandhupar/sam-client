import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';

@Component({
  providers: [ ProgramService ],
  templateUrl: 'header-information.template.html',
})
export class FALHeaderInfoComponent implements OnInit, OnDestroy {

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

    if(this.getProgramsSub)
      this.getProgramsSub.unsubscribe();

    if(this.getRelatedProgSub)
      this.getRelatedProgSub.unsubscribe();
  }

  createForm() {

    this.getPrograms();

    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames':'',
      'programNumber': '',
      'relatedTo': ''
    });
  }

  getPrograms() {
    this.getProgramsSub = this.programService.runProgram({
      status: 'published',
      includeCount : 'false',
      Cookie: this.sharedService.cookieValue,
      size:'100',
      sortBy: 'programNumber'
    }).subscribe(
      data => {
        if (data._embedded && data._embedded.program) {
          let optionData = [];
          for (let item of data._embedded.program) {
            this.listOfPrograms = item.data.programNumber + " " + item.data.title;
            optionData.push( {
              'label': this.listOfPrograms,
              'value': item.id,
              'name': 'assistanceList'
            })
          }

          this.listOptions = optionData;
        }
      },
      error => {
        console.error('Error!!', error);
      });
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        let title = api.data.title;
        let popularName = (api.data.alternativeNames.length > 0 ? api.data.alternativeNames[0] : []);
        let falNo = (api.data.programNumber ? api.data.programNumber : '');

        if (falNo.trim().length == 6)
          falNo = falNo.slice(3, 6);

        let selections = [];
        this.relatedPrograms = api.data.relatedPrograms;
        for (let relatedProgram of this.relatedPrograms) {
          this.getRelatedProgSub = this.programService.getProgramById(relatedProgram, this.sharedService.cookieValue)
            .subscribe(api => {
              selections.push(relatedProgram);
            },
              error => {
                console.error('Error!!', error);
              });
        }

        this.agency = api.data.organizationId;
        this.falHeaderInfoForm.patchValue({
          title: title,
          alternativeNames: popularName,
          programNumber: falNo,
          relatedTo: selections
        });
      },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  saveData() {

    let data = {
      "title": this.falHeaderInfoForm.value.title,
      "organizationId": this.agency,
      "alternativeNames": (this.falHeaderInfoForm.value.alternativeNames? [this.falHeaderInfoForm.value.alternativeNames] : []),
      "programNumber": this.falHeaderInfoForm.value.programNumber,
      "relatedPrograms": this.falHeaderInfoForm.value.relatedTo
    };

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
        this.sharedService.programId = api._body;
        console.log('AJAX Completed Header Info', api);

        if(this.redirectToWksp)
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
