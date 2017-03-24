import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import * as Cookies from 'js-cookie';

@Component({
  providers: [ ProgramService ],
  templateUrl: 'overview.template.html',
})
export class FALOverviewComponent implements OnInit, OnDestroy{

  cookieValue: string;
  programId: string;
  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falOverviewForm: FormGroup;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.programId = this.route.snapshot.parent.params['id'];
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    this.createForm();

    if (this.programId) {
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

    this.getProgSub = this.programService.getProgramById(this.programId, this.cookieValue)
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

    this.saveProgSub = this.programService.saveProgram(this.programId, data, this.cookieValue)
      .subscribe(api => {
          this.programId = api._body;
          console.log('AJAX Completed Overview', api);

          if(this.redirectToWksp)
            this.router.navigate(['falworkspace']);

          //this.router.navigate(['/programs/' + this.programId + '/edit/overview']);

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

  onPreviousClick(event){
    this.router.navigate(['/programs/' + this.programId + '/edit/header-information']);
  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }
}
