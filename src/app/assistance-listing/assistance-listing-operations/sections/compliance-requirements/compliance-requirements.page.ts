import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramService } from "api-kit";
import { Observable } from "rxjs";
import { FALOpSharedService } from "../../assistance-listing-operations.service";

@Component({
  providers: [ProgramService],
  templateUrl: 'compliance-requirements.page.html'
})
export class ComplianceRequirementsPage implements OnInit {
  public program: any;

  private programId;
  private cookieValue;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private route: ActivatedRoute,
              private router: Router,
              private sharedService: FALOpSharedService) {
    this.sharedService.setSideNavFocus();
    this.programId = this.sharedService.programId;
    this.cookieValue = this.sharedService.cookieValue;
  }

  ngOnInit() {
    this.createForm();

    if(this.programId) {
      this.loadProgramData();
    }
  }

  private createForm() {
  }

  private loadProgramData() {
    let programAPI$ = this.programService.getProgramById(this.programId, this.cookieValue).share();

    programAPI$.subscribe(programData => {
      this.program = programData;
      this.populateForm();
    }, error => {
      // todo: handle error
      console.log('Error loading program', error);
    });
  }

  private populateForm() {
  }

  private saveProgramData(): Observable<any> {
    let data: any = (this.program && this.program.data) || {};
    return this.programService.saveProgram(this.programId, data, this.cookieValue);
  }

  public onCancelClick(event) {
    if(this.programId) {
      this.router.navigate(['programs', this.programId, 'view']);
    } else {
      this.router.navigate(['falworkspace']);
    }
  }

  public onPreviousClick(event){
    if(this.programId) {
      this.router.navigate(['programs', this.programId, 'edit', 'financial-information', 'other-financial-info']);
    } else {
      this.router.navigate(['programs', 'add', 'financial-information', 'other-financial-info']);
    }
  }

  public onSaveExitClick(event) {
    this.saveProgramData().subscribe(res => {
      let id = res._body;
      this.router.navigate(['falworkspace']);
    }, err => {
      console.log("Error saving program ", err);
    });
  }

  public onSaveContinueClick(event) {
    this.saveProgramData().subscribe(res => {
      let id = res._body;
      this.router.navigate(['programs', id, 'edit', 'contact-information']);
    }, err => {
      console.log("Error saving program ", err);
    });
  }
}
