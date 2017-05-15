import { Component, Input, OnInit } from '@angular/core';
import { FALFormService } from "../../fal-form.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FALFormViewModel } from "../../fal-form.model";
import { AutocompleteConfig } from "sam-ui-kit/types";
import { FiscalYearTableConfig } from "../../../components/fiscal-year-table/fiscal-year-table.component";


@Component({
  providers: [FALFormService],
  selector: 'fal-form-overview',
  templateUrl: 'fal-form-overview.template.html'
})

export class FALFormOverviewComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;

  falOverviewForm: FormGroup;
  title: string;

  public fundedProjectsConfig: FiscalYearTableConfig = {
    name: 'funded-projects',
    label: 'Examples of Funded Projects',
    hint: 'Provide examples that demonstrate how funding might be used. Describe the subject area without using program names or locations.',
    required: false,
    itemName: 'Examples',

    entry: {
      hint: 'Please describe funded projects:'
    }
  };

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

  constructor(private fb: FormBuilder, private service: FALFormService) {
  }

  ngOnInit() {

    this.populateFunctionalCodes();
    this.createForm();

    this.falOverviewForm.valueChanges.subscribe(data => this.updateViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  createForm() {
    this.falOverviewForm = this.fb.group({
      'objective': '',
      'description': '',
      'functionalCodes': '',
      'fcListDisplay': '',
      'subjectTerms': [''],
      'stListDisplay': [''],
      'fundedProjects': null
    });
  }

  updateViewModel(data) {

    let functionaCodes = [];
    let subjectTerms = [];
    for(let fc of data.fcListDisplay){
      functionaCodes.push(fc.code);
    }
    for(let st of data.stListDisplay){
      subjectTerms.push(st.code);
    }

    this.viewModel.objective = data['objective'];
    this.viewModel.description = data['description'];
    this.viewModel.functionalCodes = functionaCodes.length > 0 ? functionaCodes : null;
    this.viewModel.subjectTerms = subjectTerms.length > 0 ? subjectTerms : null;
    this.viewModel.projects = this.saveProjects(data.fundedProjects);
  }

  updateForm() {

    let objective = this.viewModel.objective;
    let description = this.viewModel.description;

    if ((this.viewModel.subjectTerms) && (this.viewModel.subjectTerms.length > 0)) {
      this.populateSubjectTerms(this.viewModel.subjectTerms);
    }
    if ((this.viewModel.functionalCodes) && (this.viewModel.functionalCodes.length > 0)) {
      this.populateFunctionalCodes(this.viewModel.functionalCodes);
    }

    this.falOverviewForm.patchValue({
      objective: objective,
      description: description,
      stListDisplay: this.stListDisplay === null ? [] : this.stListDisplay,
      fcListDisplay: this.fcListDisplay === null ? [] : this.fcListDisplay,
      fundedProjects: this.loadProjects(this.viewModel.projects)
    }, {
      emitEvent: false
    });
  }

  populateSubjectTerms(subjectTerms){
    this.service.getSubjectTermsDict(subjectTerms).subscribe(data => {

      for (let dataItem of data['program_subject_terms']) {
        let value = dataItem.code + ' - ' + dataItem.value;
        this.stListDisplay.push({code: dataItem.element_id, name: value});
      }

      this.stAutocompleteConfig.placeholder = this.placeholderMsg(this.stListDisplay);
    }, error => {
      console.error('Error Retrieving Subject Terms!!', error);
    });
  }

  populateFunctionalCodes(functionalCodes = []){
    this.service.getFunctionalCodesDict().subscribe(data => {

        for (let fcData of data['functional_codes']) {
          for(let data of fcData.elements){
            let value = data.code + ' - ' + data.value;
            this.fcTypeOptions.push({code: data.element_id, name:value});
            this.fcKeyValue[data.element_id] = value;
          }
        }
        for (let id of functionalCodes) {
          this.fcListDisplay.push({code: id, name: this.fcKeyValue[id]});
        }

        this.fcAutocompleteConfig.placeholder = this.placeholderMsg(this.fcListDisplay);
      },
      error => {
        console.error('error retrieving functional code options', error);
      });
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

  private saveProjects(fundedProjects) {
    let projects: any = {};
    let projectsForm = fundedProjects;

    projects.list = [];
    if(projectsForm) {
      projects.isApplicable = projectsForm.isApplicable;
      for (let entry of projectsForm.entries) {
        projects.list.push({
          fiscalYear: entry.year ? Number(entry.year) : null,
          description: entry.description
        });
      }
    }

    return projects;
  }

  private loadProjects(projects: any) {
    let projectsForm:any = {
      entries:[]
    };

    if (projects) {
      projectsForm.isApplicable = projects.isApplicable;
      if(projects.list) {
        for (let project of projects.list) {
          projectsForm.entries.push({
            year: project.fiscalYear,
            description: project.description
          });
        }
      }
    }

    return projectsForm;
  }

}
