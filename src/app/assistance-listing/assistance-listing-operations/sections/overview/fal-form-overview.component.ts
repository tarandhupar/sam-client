import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FALFormService } from "../../fal-form.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FALFormViewModel } from "../../fal-form.model";
import { AutocompleteConfig } from "sam-ui-elements/src/ui-kit/types";
import {
  FiscalYearTableConfig
} from "../../../components/fiscal-year-table/fiscal-year-table.component";
import { FALFormErrorService, FalFieldErrorList } from '../../fal-form-error.service';
import { FALFieldNames, FALSectionNames } from '../../fal-form.constants';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-overview',
  templateUrl: 'fal-form-overview.template.html'
})

export class FALFormOverviewComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();

  falOverviewForm: FormGroup;
  public fpErrors: FalFieldErrorList;

  objectiveHint:string = `<p>Provide a plain text description highlighting program goals. Use specific terms that will help public users find this listing.</p>
                          This section should be a brief, accurate statement of what the program is intended to accomplish or the goals toward which the program is directed. 
                          This should be a statement of purpose and not merely a description of the program. 
                          Goals as set forth in the authorizing legislation must be included.`;

  public fundedProjectsConfig: FiscalYearTableConfig = {
    name: FALFieldNames.FUNDED_PROJECTS,
    label: 'Examples of Funded Projects',
    hint: 'Provide examples that demonstrate how funding might be used. Describe the subject area without using program names or locations.',
    required: false,
    itemName: 'Examples',

    entry: {
      hint: 'Please describe funded projects:'
    },

    textarea: {
      required: true
    },

    select: {
      required: true
    },

    deleteModal: {
      title: 'Delete Examples of Funded Projects',
      description: '',
      flag: 'ov'
    }
  };

  //Functional Codes Multiselect
  fcTypeOptions = [];
  fcKeyValue = [];
  fcAutocompleteConfig: any = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name', categoryProperty: 'category'},
  };


  //Subject Terms Multiselect
  stAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    serviceOptions: {index: 'D'}
  };

  constructor(private fb: FormBuilder, private service: FALFormService, private errorService: FALFormErrorService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createForm();
    this.service.getFunctionalCodesDict().subscribe(
      data => this.parseFunctionalCodes(data),
      error => {
        console.error('error retrieving dictionary data', error);
      });

    this.errorService.viewModel = this.viewModel;

    if (!this.viewModel.isNew) {
      this.updateForm();
    }

    this.cdr.detectChanges();
    this.updateErrors();
  }
  parseFunctionalCodes(data: any) {
    let functionalTypesArr = [];
    if(data && data['functional_codes']) {
      for (let fcData of data['functional_codes']) {
        for (let data of fcData.elements) {
          let value = data.code + ' - ' + data.value;
          this.fcTypeOptions.push({code: data.element_id, name: value, category: fcData.value});
          this.fcKeyValue[data.element_id] = value;
        }
      }
    }
    this.populateMultiSelect(this.viewModel.functionalCodes, this.fcAutocompleteConfig, functionalTypesArr, this.fcKeyValue,this.fcTypeOptions);
    this.falOverviewForm.patchValue({
      functionalTypes: functionalTypesArr.length > 0 ? functionalTypesArr : []
    }, {
      emitEvent: false
    });

    this.falOverviewForm.controls['functionalTypes'].updateValueAndValidity();

    this.falOverviewForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
      this.cdr.detectChanges();
      this.updateErrors();
    });

    if(this.viewModel.subjectTerms && this.viewModel.subjectTerms.length > 0){
      this.parseSubjectTerms(this.viewModel.subjectTerms);
    }

  }

  populateMultiSelect(multiTypeData: any, autoCompleteConfig: any, listDisplay: any, keyValueArray: any, fcTypeOptions) {
    if (multiTypeData && multiTypeData.length > 0) {
      for (let id of multiTypeData) {
        let item = fcTypeOptions.find((item)=>{
          return item.code == id;
        });
        listDisplay.push({code: id, name: keyValueArray[id],category: item['category']});
      }
    }
  }

  createForm() {
    this.falOverviewForm = this.fb.group({
      'objective': '',
      'description': '',
      'functionalTypes': '',
      'subjectTermsTypes': [''],
      'fundedProjects': null
    });

    if (this.viewModel.getSectionStatus(FALSectionNames.OVERVIEW) === 'updated') {
      this.falOverviewForm.get('fundedProjects').markAsDirty();
      this.falOverviewForm.get('fundedProjects').updateValueAndValidity();
      this.falOverviewForm.markAsPristine({onlySelf: true});
      this.falOverviewForm.get('objective').markAsDirty({onlySelf: true});
      this.falOverviewForm.get('objective').updateValueAndValidity();
      this.falOverviewForm.get('description').markAsDirty({onlySelf: true});
      this.falOverviewForm.get('description').updateValueAndValidity();
      this.falOverviewForm.get('functionalTypes').markAsDirty({onlySelf: true});
      this.falOverviewForm.get('functionalTypes').updateValueAndValidity();
      this.falOverviewForm.get('subjectTermsTypes').markAsDirty({onlySelf: true});
      this.falOverviewForm.get('subjectTermsTypes').updateValueAndValidity();
    }
  }

  updateViewModel(data) {
    let subjectTerms = [];
    for (let st of data.subjectTermsTypes) {
      subjectTerms.push(st.code);
    }
    this.viewModel.objective = data['objective'];
    this.viewModel.description = data['description'];
    this.viewModel.functionalCodes = data['functionalTypes'].map((obj)=>{
      return obj['code'];
    });
    this.viewModel.subjectTerms = subjectTerms.length > 0 ? subjectTerms : null;
    this.viewModel.projects = this.saveProjects(data.fundedProjects);
  }

  // todo: public for testing purposes
  public updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.updateControlError(this.falOverviewForm.get('objective'), this.errorService.validateObjective().errors);
    this.updateControlError(this.falOverviewForm.get('functionalTypes'), this.errorService.validateFunctionalCodes().errors);
    this.updateControlError(this.falOverviewForm.get('subjectTermsTypes'), this.errorService.validateSubjectTerms().errors);
    this.fpErrors = this.errorService.validateFundedProjects();
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private updateControlError(control, errors){
    control.clearValidators();
    control.setValidators((control) => { return control.errors });
    control.setErrors(errors);
    this.cdr.detectChanges();
    control.updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  updateForm() {
    let objective = this.viewModel.objective;
    let description = this.viewModel.description;
    this.falOverviewForm.patchValue({
      objective: objective,
      description: description,
      fundedProjects: this.loadProjects(this.viewModel.projects)
    }, {
      emitEvent: false
    });

    this.cdr.detectChanges();
    this.updateErrors();
  }

  parseSubjectTerms(subjectTerms: any) {
    this.service.getSubjectTermsDict(subjectTerms).subscribe(data => {
      let arr= [];
      if(data && data['program_subject_terms']) {
        for (let dataItem of data['program_subject_terms']) {
          let value = dataItem.code + ' - ' + dataItem.value;
          arr.push({code: dataItem.element_id, name: value});
        }
      }

      this.falOverviewForm.patchValue({
        subjectTermsTypes: arr.length > 0 ? arr : []
      }, {
        emitEvent: false
      });

      this.falOverviewForm.controls['subjectTermsTypes'].updateValueAndValidity();

      this.falOverviewForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
        this.cdr.detectChanges();
        this.updateErrors();
      });
    }, error => {
      console.error('Error Retrieving Subject Terms!!', error);
    });
  }

  // todo: public for testing purposes
  public saveProjects(fundedProjects) {
    let projects: any = {};
    let projectsForm = fundedProjects;

    projects.list = [];
    if (projectsForm) {
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

  // todo: public for testing purposes
  public loadProjects(projects: any) {
    let projectsForm: any = {
      entries: []
    };

    if (projects) {
      projectsForm.isApplicable = projects.isApplicable;
      if (projects.list) {
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
