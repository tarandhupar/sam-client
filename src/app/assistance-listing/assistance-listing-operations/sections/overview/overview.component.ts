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
  public fundedProjectsConfig: any = {
    name: 'funded-projects',
    label: 'Examples of Funded Projects',
    hint: 'Provide examples that demonstrate how funding might be used. Describe the subject area without using program names or locations.',
    required: false,
    itemName: 'Examples',

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'funded-projects-checkbox-na' }
      ]
    },

    textarea: {
      hint: 'Please describe funded projects:',
      showWhenCheckbox: 'unchecked'
    }
  };

  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falOverviewForm: FormGroup;
  programId : any;
  title: string;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService) {

    this.sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
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
      'falDesc':'',
      'fundedProjects': null
    });
  }


  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        this.title = api.data.title;
        let objective = (api.data.objective ? api.data.objective : '');
        let desc = (api.data.description ? api.data.description : '');

        this.falOverviewForm.patchValue({
            objective:objective,
            falDesc:desc,
            fundedProjects: this.loadProjects(api.data.projects)
          });
      },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  saveData() {
    let data = {
      "objective": this.falOverviewForm.value.objective,
      "description": this.falOverviewForm.value.falDesc,
      "projects": this.saveProjects()
    };

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

  private saveProjects() {
    let projects: any = {};
    let projectsForm = this.falOverviewForm.value.fundedProjects;

    if(projectsForm && projectsForm.checkbox) {
      projects.isApplicable = projectsForm.checkbox.indexOf('na') === -1;
    } else {
      projects.isApplicable = true;
    }

    projects.list = [];
    if(projectsForm) {
      for (let entry of projectsForm.entries) {
        projects.list.push({
          fiscalYear: entry.year ? Number(entry.year) : null,
          description: entry.text
        });
      }
    }

    return projects;
  }


  private loadProjects(projects: any) {
    let projectsForm = {
      checkbox: [],
      entries: []
    };

    if(projects) {
      if (!projects.isApplicable) {
        projectsForm.checkbox.push('na');
      }

      for (let project of projects.list) {
        projectsForm.entries.push({
          year: project.fiscalYear ? project.fiscalYear.toString() : '',
          text: project.description
        });
      }
    }

    return projectsForm;
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
