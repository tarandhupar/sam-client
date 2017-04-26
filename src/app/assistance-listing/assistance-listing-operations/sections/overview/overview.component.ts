import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FALOpSharedService} from '../../assistance-listing-operations.service';
import {AutocompleteConfig} from "sam-ui-kit/types";
import {DictionaryService} from "../../../../../api-kit/dictionary/dictionary.service";

@Component({
  providers: [ProgramService, DictionaryService],
  templateUrl: 'overview.template.html',
})
export class FALOverviewComponent implements OnInit, OnDestroy {

  public fundedProjectsConfig: any = {
    name: 'funded-projects',
    label: 'Examples of Funded Projects',
    hint: 'Provide examples that demonstrate how funding might be used. Describe the subject area without using program names or locations.',
    required: false,
    itemName: 'Examples',

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'funded-projects-checkbox-na'}
      ]
    },

    textarea: {
      hint: 'Please describe funded projects:',
      showWhenCheckbox: 'unchecked'
    }
  };

  getProgSub: any;
  saveProgSub: any;
  dictSTSub: any;
  dictFCSub: any;

  redirectToWksp: boolean = false;
  falOverviewForm: FormGroup;
  programId: any;
  title: string;

  //Functional Codes Multiselect
  fcTypeOptions = [];
  fcKeyValue = [];
  fcNGModel: any;
  fcListDisplay = [];
  fcAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected', clearOnSelection: true, showOnEmptyInput: true
  };


  //Subject Terms Multiselect
  stListDisplay = [];
  stNGModel: any;
  stAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
    serviceOptions: {index: 'D'},
    clearOnSelection: true, showOnEmptyInput: true
  };

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

  ngOnDestroy() {
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
      'falDesc': '',
      'functionalCodes': '',
      'fcListDisplay': '',
      'subjectTerms': [''],
      'stListDisplay': [''],
      'fundedProjects': null
    });
  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.title = api.data.title;
          let objective = (api.data.objective ? api.data.objective : '');
          let desc = (api.data.description ? api.data.description : '');
          if ((api.data.subjectTerms) && (api.data.subjectTerms.length > 0)) {
            this.populateMultiList(api.data.subjectTerms, 'ST');
          }
          if ((api.data.functionalCodes) && (api.data.functionalCodes.length > 0)) {
            this.populateMultiList(api.data.functionalCodes, 'FC');

          }
          this.falOverviewForm.patchValue({
            objective: objective,
            falDesc: desc,
            stListDisplay: this.stListDisplay === null ? [] : this.stListDisplay,
            fcListDisplay: this.fcListDisplay === null ? [] : this.fcListDisplay,
            fundedProjects: this.loadProjects(api.data.projects)
          });
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  populateMultiList(multiTypeData: any, multiType: string) {
    if (multiType === 'ST') {
      this.dictSTSub = this.dictionaryService.getDictionaryById('program_subject_terms', '100', multiTypeData.join(','))
        .subscribe(data => {
          for (let dataItem of data['program_subject_terms']) {
            this.stListDisplay.push({code: dataItem.element_id, name: dataItem.value});
          }
          this.stAutocompleteConfig.placeholder = this.placeholderMsg(multiTypeData);
        }, error => {
          console.error('Error Retrieving Related Program!!', error);
        });
    } else if (multiType === 'FC') {
      for (let id of multiTypeData) {
        this.fcListDisplay.push({code: id, name: this.fcKeyValue[id]});
      }
      this.fcAutocompleteConfig.placeholder = this.placeholderMsg(multiTypeData);
    }

  }

  stTypeChange(event) {
    this.stAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  stlistChange() {
    this.stAutocompleteConfig.placeholder = this.placeholderMsg(this.falOverviewForm.value.stListDisplay);
  }

  fcTypeChange(event) {
    this.fcAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  fclistChange() {
    this.fcAutocompleteConfig.placeholder = this.placeholderMsg(this.falOverviewForm.value.fcListDisplay);
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
    let functionaCodes = [];
    let subjectTerms = [];
    for(let data of this.falOverviewForm.value.fcListDisplay){
      functionaCodes.push(data.code);
    }
    for(let data of this.falOverviewForm.value.stListDisplay){
      subjectTerms.push(data.code);
    }
    let data = {
      "objective": this.falOverviewForm.value.objective,
      "description": this.falOverviewForm.value.falDesc,
      "functionalCodes": functionaCodes.length > 0 ? functionaCodes : null,
      "subjectTerms": subjectTerms.length > 0 ? subjectTerms : null,
      "projects": this.saveProjects()
    };

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Overview', api);

          if (this.redirectToWksp)
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

    if (projectsForm && projectsForm.checkbox) {
      projects.isApplicable = projectsForm.checkbox.indexOf('na') === -1;
    } else {
      projects.isApplicable = true;
    }

    projects.list = [];
    if (projectsForm) {
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

    if (projects) {
      if (!projects.isApplicable) {
        projectsForm.checkbox.push('na');
      }

      if (projects.list) {
        for (let project of projects.list) {
          projectsForm.entries.push({
            year: project.fiscalYear ? project.fiscalYear.toString() : '',
            text: project.description
          });
        }
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

  onPreviousClick(event) {
    if (this.sharedService.programId)
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
