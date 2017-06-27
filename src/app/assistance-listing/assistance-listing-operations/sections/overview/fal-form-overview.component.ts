import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FALFormService } from "../../fal-form.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FALFormViewModel } from "../../fal-form.model";
import { AutocompleteConfig } from "sam-ui-kit/types";
import {
  FiscalYearTableConfig,
  FALFiscalYearTableComponent
} from "../../../components/fiscal-year-table/fiscal-year-table.component";
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALFieldNames, FALSectionNames } from '../../fal-form.constants';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-overview',
  templateUrl: 'fal-form-overview.template.html'
})

export class FALFormOverviewComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();
  @ViewChild('fundedProjects') fundedProjectsComponent: FALFiscalYearTableComponent;

  falOverviewForm: FormGroup;
  formErrorArr = [];
  review:boolean = false;

  objectiveHint:string = `<p>Provide a plain text description highlighting program goals. Use specific terms that will help public users find this listing.</p>
                          This section should be a brief, accurate statement of what the program is intended to accomplish or the goals toward which the program is directed. 
                          This should be a statement of purpose and not merely a description of the program. 
                          Goals as set forth in the authorizing legislation must be included.`;

  public fundedProjectsConfig: FiscalYearTableConfig = {
    name: 'funded-projects',
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

  constructor(private fb: FormBuilder, private service: FALFormService, private errorService: FALFormErrorService) {
  }

  ngOnInit() {
    this.service.getFunctionalCodesDict().subscribe(
      data => this.parseFunctionalCodes(data),
      error => {
        console.error('error retrieving dictionary data', error);
      });

    this.errorService.viewModel = this.viewModel;

    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }

    setTimeout(() => { // horrible hack to trigger angular change detection
      this.updateErrors();
    });
  }

  parseFunctionalCodes(data: any) {
    for (let fcData of data['functional_codes']) {
      for (let data of fcData.elements) {
        let value = data.code + ' - ' + data.value;
        this.fcTypeOptions.push({code: data.element_id, name: value});
        this.fcKeyValue[data.element_id] = value;
      }
    }
    this.populateMultiSelect(this.viewModel.functionalCodes, this.fcAutocompleteConfig, this.fcListDisplay, this.fcKeyValue);
    this.falOverviewForm.patchValue({
      fcListDisplay: this.fcListDisplay.length > 0 ? this.fcListDisplay : []
    }, {
      emitEvent: false
    });

    this.falOverviewForm.controls['fcListDisplay'].updateValueAndValidity();

    this.falOverviewForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
      setTimeout(() => { // horrible hack to trigger angular change detection
        this.updateErrors();
      });
    });

    if(this.viewModel.subjectTerms && this.viewModel.subjectTerms.length > 0){
      this.parseSubjectTerms(this.viewModel.subjectTerms);
    }

  }

  populateMultiSelect(multiTypeData: any, autoCompleteConfig: any, listDisplay: any, keyValueArray: any) {
    if (multiTypeData && multiTypeData.length > 0) {
      for (let id of multiTypeData) {
        listDisplay.push({code: id, name: keyValueArray[id]});
      }
      autoCompleteConfig.placeholder = this.placeholderMsg(multiTypeData);
    }
  }

  createForm() {
    this.falOverviewForm = this.fb.group({
      'objective': '',
      'description': '',
      'functionalTypes': '',
      'fcListDisplay': ['', (control) => { return control.errors; }],
      'subjectTermsTypes': '',
      'stListDisplay': ['', (control) => { return control.errors; }],
      'fundedProjects': null
    });
  }

  updateViewModel(data) {
    let functionaCodes = [];
    let subjectTerms = [];
    for (let fc of data.fcListDisplay) {
      functionaCodes.push(fc.code);
    }
    for (let st of data.stListDisplay) {
      subjectTerms.push(st.code);
    }
    this.viewModel.objective = data['objective'];
    this.viewModel.description = data['description'];
    this.viewModel.functionalCodes = functionaCodes.length > 0 ? functionaCodes : null;
    this.viewModel.subjectTerms = subjectTerms.length > 0 ? subjectTerms : null;
    this.viewModel.projects = this.saveProjects(data.fundedProjects);
  }

  private updateErrors() {
    this.errorService.viewModel = this.viewModel;

    this.falOverviewForm.get('objective').clearValidators();
    this.falOverviewForm.get('objective').setValidators((control) => { return control.errors });
    this.falOverviewForm.get('objective').setErrors(this.errorService.validateObjective().errors);
    this.markAndUpdateFieldStat('objective');

    this.falOverviewForm.get('fcListDisplay').setErrors(this.errorService.validateFunctionalCodes().errors);
    this.markAndUpdateFieldStat('fcListDisplay');

    this.falOverviewForm.get('stListDisplay').setErrors(this.errorService.validateSubjectTerms().errors);
    this.markAndUpdateFieldStat('stListDisplay');

    this.errorService.validate(FALSectionNames.OVERVIEW, FALFieldNames.FUNDED_PROJECTS);

    this.showErrors.emit(this.errorService.errors);
  }

  private markAndUpdateFieldStat(fieldName){
    setTimeout(() => {
      this.falOverviewForm.get(fieldName).markAsDirty();
      this.falOverviewForm.get(fieldName).updateValueAndValidity({onlySelf: true, emitEvent: true});
    });
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

    setTimeout(() => { // horrible hack to trigger angular change detection
      this.updateErrors();
    });
  }

  parseSubjectTerms(subjectTerms: any) {
    this.service.getSubjectTermsDict(subjectTerms).subscribe(data => {

      for (let dataItem of data['program_subject_terms']) {
        let value = dataItem.code + ' - ' + dataItem.value;
        this.stListDisplay.push({code: dataItem.element_id, name: value});
      }

      this.stAutocompleteConfig.placeholder = this.placeholderMsg(this.stListDisplay);
      this.falOverviewForm.patchValue({
        stListDisplay: this.stListDisplay.length > 0 ? this.stListDisplay : []
      }, {
        emitEvent: false
      });

      this.falOverviewForm.controls['stListDisplay'].updateValueAndValidity();

      this.falOverviewForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
        setTimeout(() => { // horrible hack to trigger angular change detection
          this.updateErrors();
        });
      });
    }, error => {
      console.error('Error Retrieving Subject Terms!!', error);
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

  private loadProjects(projects: any) {
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
