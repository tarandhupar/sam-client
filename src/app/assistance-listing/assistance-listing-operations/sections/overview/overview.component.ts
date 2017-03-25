import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';

@Component({
  providers: [ ProgramService ],
  templateUrl: 'overview.template.html',
})
export class FALOverviewComponent implements OnInit, OnDestroy{

  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falOverviewForm: FormGroup;

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

  ngOnDestroy(){

    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }

  createForm() {

    this.falOverviewForm = this.fb.group({
      'objective': '',
      'falDesc':''
    });
  }


  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        let objective = (api.data.objective ? api.data.objective : '');

        this.falOverviewForm.patchValue({
            objective:objective
          },
          error => {
            console.error('Error Retrieving Program!!', error);
          });

      });//end of subscribe

  }

  saveData() {

    let data = {
      "objective": this.falOverviewForm.value.objective
    };

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Overview', api);

          if(this.redirectToWksp)
            this.router.navigate(['falworkspace']);

          this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/financial-information']);

        },
        error => {
          console.error('Error saving Program!!', error);
        }); //end of subscribe
  }

  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/falworkspace']);
    else
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
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
    //this.redirectToWksp = true;
    this.saveData();
  }
}
