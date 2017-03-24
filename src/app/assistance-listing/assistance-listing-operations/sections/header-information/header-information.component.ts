import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import * as Cookies from 'js-cookie';

@Component({
  providers: [ ProgramService ],
  templateUrl: 'header-information.template.html',
})
export class FALHeaderInfoComponent implements OnInit, OnDestroy {
  cookieValue: string;
  programId: string;
  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falHeaderInfoForm: FormGroup;
  getRelatedProgSub: any;
  getProgramsSub: any;
  relatedPrograms = [];
  listOfPrograms: string;
  listOptions = [];

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    this.programId = this.route.snapshot.parent.params['id'];
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    this.createForm();

    if (this.programId) {
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
      Cookie: this.cookieValue,
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
      }
    );
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.programId, this.cookieValue)
      .subscribe(api => {
        let title = api.data.title;
        let popularName = (api.data.alternativeNames ? api.data.alternativeNames[0] : '');
        let falNo = (api.data.programNumber ? api.data.programNumber : '');

        if (falNo.trim().length == 6)
          falNo = falNo.slice(3, 6);

        let selections = [];
        this.relatedPrograms = api.data.relatedPrograms.relatedTo;
        for (let relatedProgram of this.relatedPrograms) {
          this.getRelatedProgSub = this.programService.getProgramById(relatedProgram, this.cookieValue)
            .subscribe(api => {
              selections.push(relatedProgram);
            });
        }

        this.falHeaderInfoForm.patchValue({
          title: title,
          alternativeNames: popularName,
          programNumber: falNo,
          relatedTo: selections
        },
          error => {
            console.error('Error Retrieving Program!!', error);
          });

      });//end of subscribe

  }

  saveData() {

    let data = {
      "title": this.falHeaderInfoForm.value.title,
      "alternativeNames": [this.falHeaderInfoForm.value.alternativeNames],
      "programNumber": this.falHeaderInfoForm.value.programNumber,
      "relatedPrograms": {
        "relatedTo": this.falHeaderInfoForm.value.relatedTo
      }
    };

    this.saveProgSub = this.programService.saveProgram(this.programId, data, this.cookieValue)
      .subscribe(api => {
        this.programId = api._body;
        console.log('AJAX Completed Header Info', api);

        if(this.redirectToWksp)
          this.router.navigate(['falworkspace']);
        else
          this.router.navigate(['/programs/' + this.programId + '/edit/overview']);

      },
        error => {
          console.error('Error saving Program!!', error);
        }); //end of subscribe
  }

  onCancelClick(event) {
    if (this.programId)
      this.router.navigate(['/falworkspace']);
    else
      this.router.navigate(['/programs', this.programId, 'view']);
  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {

    this.saveData();
  }

}
