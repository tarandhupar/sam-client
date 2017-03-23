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
  falHeaderInfoForm: FormGroup;
  getProgSub: any;
  saveProgSub: any;
  data: any;
  redirectToWksp: boolean = false;
  redirectToEdit: boolean = false;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    this.programId = this.route.snapshot.parent.params['id'];
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.programId) {
      this.getData();
    }

    this.createForm();
  }

  ngOnDestroy() {
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }

  createForm() {

    this.falHeaderInfoForm = this.fb.group({
      'title': ''
    });
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.programId, this.cookieValue)
      .subscribe(api => {
        let title = api.data.title;

        this.falHeaderInfoForm.patchValue({
          title: title
        });

      });//end of subscribe

  }

  saveData() {
    let data = {
      "title": this.falHeaderInfoForm.controls['title'].value
    };

    this.saveProgSub = this.programService.saveProgram(this.programId, data, this.cookieValue).subscribe(api => {
      this.programId = api._body;
      console.log('AJAX Completed', api);

      if(this.redirectToWksp)
        this.router.navigate(['falworkspace']);

      this.router.navigate(['/programs/' + this.programId + '/edit/overview']);

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
