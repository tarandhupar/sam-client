import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProgramService } from "api-kit";
import { DictionaryService } from "api-kit";
import { FALFormService } from "../../fal-form.service";
import { FALFormViewModel } from "../../fal-form.model";

@Component({
  providers: [ProgramService, DictionaryService, FALFormService],
  selector: 'fal-form-compliance-requirements',
  templateUrl: 'fal-form-compliance-requirements.template.html'
})
export class FALFormComplianceRequirementsComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;

  public program: any;
  public complianceRequirementsGroup: FormGroup;

  public policyRequirementsConfig: any = {
    checkbox: {
      name: 'compliance-policy-requirements',
      label: 'Policy Requirements',
      hint: 'Does 2 CFR 200, Uniform Administrative Requirements, Cost Principles, and Audit Requirements for Federal Awards apply to this assistance listing?',

      options: []
    },

    textarea: {
      name: 'compliance-policy-additional-info',
      label: 'Additional Information'
    }
  };

  public reportsConfig: any = {
    name: 'compliance-reports',
    label: 'Reports',
    hint: 'What reports does the funding agency require?',
    required: false,
    validateComponentLevel: false,

    checkbox: {
      options: [
        { value: 'program', label: 'Program Reports', name: 'reports-checkbox-program' },
        { value: 'cash', label: 'Cash Reports', name: 'reports-checkbox-cash' },
        { value: 'progress', label: 'Progress Reports', name: 'reports-checkbox-progress' },
        { value: 'expenditure', label: 'Expenditure Reports', name: 'reports-checkbox-expenditure' },
        { value: 'performanceMonitoring', label: 'Performance Reports', name: 'reports-checkbox-performance' }
      ]
    },

    textarea: {
      showWhenCheckbox: 'checked',
      labels: ['Program Reports', 'Cash Reports', 'Progress Reports', 'Expenditure Reports', 'Performance Reports'],
      required: [true, true, true, true, true]
    }
  };

  public auditsConfig: any = {
    name: 'compliance-audits',
    label: 'Other Audit Requirements',
    hint: 'Describe audit procedures for this program. Only include requirements not already covered by 2 CFR 200.',
    required: true,
    validateComponentLevel: false,

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'audits-checkbox-na' },
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public additionalDocumentationConfig: any = {
    name: 'compliance-additional-documentation',
    label: 'Regulations, Guidelines, and Literature',
    hint: 'Please reference additional documentation specific to your program Do not include government wide guidance.',
    required: true,
    validateComponentLevel: false,

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'additional-documentation-checkbox-na' },
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public formulaMatchingConfig: any = {
    name: 'compliance-formula-matching',
    label: 'Formula Matching Requirements Maintenance of Effort',
    hint: '',
    required: false,
  };

  constructor(private fb: FormBuilder,
              private dictService: DictionaryService) {

    dictService.getDictionaryById('cfr200_requirements').subscribe(data => {
      for(let requirement of data['cfr200_requirements']) {
        this.policyRequirementsConfig.checkbox.options.push({
          value: requirement.code,
          label: requirement.value,
          name: 'policy-requirements-checkbox-' + requirement.code
        });
      }
    });
  }

  ngOnInit() {
    this.createForm();

    if (!this.viewModel.isNew) {
      this.loadForm();
    }
  }

  private createForm() {
    this.complianceRequirementsGroup = this.fb.group({
      'policyRequirementsCheckbox': null,
      'policyRequirementsTextarea': null,
      'reports': null,
      'audits': null,
      'records': null,
      'additionalDocumentation': null,
      'formulaMatching': null
    });

    this.complianceRequirementsGroup.valueChanges.subscribe(data => this.updateViewModel(data));
  }

  private loadForm() {
    let CFR200 = this.loadCFR200();

    this.complianceRequirementsGroup.patchValue({
      policyRequirementsCheckbox: CFR200.checkbox,
      policyRequirementsTextarea: CFR200.description,
      reports: this.loadReports(),
      audits: this.loadAudit(),
      records: this.loadRecords(),
      additionalDocumentation: this.loadDocuments(),
      formulaMatching: this.loadFormulaMatching()
    }, {
      emitEvent: false
    });
  }

  private updateViewModel(data: Object) {
    let CFR200Data = {
      checkbox: data['policyRequirementsCheckbox'],
      textarea: data['policyRequirementsTextarea']
    };

    this.viewModel.CFR200Requirements = this.saveCFR200(CFR200Data);
    this.viewModel.complianceReports = this.saveReports(data['reports']);
    this.viewModel.audit = this.saveAudit(data['audits']);
    this.viewModel.records = this.saveRecords(data['records']);
    this.viewModel.documents = this.saveDocuments(data['additionalDocumentation']);
    this.viewModel.formulaAndMatching = this.saveFormulaMatching(data['formulaMatching']);
  }

  private saveCFR200(CFR200Model: any) {
    let CFR200: any = {};
    CFR200.questions = [];

    for(let checkbox of this.policyRequirementsConfig.checkbox.options) {
      let selected = false;
      if(CFR200Model && CFR200Model.checkbox) {
        selected = CFR200Model.checkbox.indexOf(checkbox.value) >= 0;
      }
      CFR200.questions.push({code: checkbox.value, isSelected: selected});
    }

    if(CFR200Model && CFR200Model.textarea) {
      CFR200.description = CFR200Model.textarea;
    } else {
      CFR200.description = '';
    }

    return CFR200;
  }

  private loadCFR200() {
    let model: any = {
      checkbox: [],
      description: ''
    };

    if(this.viewModel.CFR200Requirements) {
      if(this.viewModel.CFR200Requirements.questions) {
        for(let question of this.viewModel.CFR200Requirements.questions) {
          if(question.isSelected) {
            model.checkbox.push(question.code);
          }
        }
      }

      if(this.viewModel.CFR200Requirements.description) {
        model.description = this.viewModel.CFR200Requirements.description;
      }
    }

    return model;
  }

  private saveReports(reportsModel) {
    let reports: any[] = [];

    if(reportsModel && reportsModel.checkbox && reportsModel.textarea) {
      for(let i = 0; i < this.reportsConfig.checkbox.options.length; i++) {
        let codeName = this.reportsConfig.checkbox.options[i].value;
        let selected = reportsModel.checkbox.indexOf(codeName) >= 0;
        let description = reportsModel.textarea[i];
        reports.push({code: codeName, isSelected: selected, description: description});
      }
    }

    return reports;
  }

  private loadReports() {
    let model: any = {
      checkbox: [],
      textarea: []
    };

    if (this.viewModel.complianceReports) {
      for (let report of this.viewModel.complianceReports) {
        if (report.isSelected) {
          model.checkbox.push(report.code);
        }
        model.textarea.push(report.description);
      }
    }

    return model;
  }

  private saveAudit(auditModel) {
    let audit: any = {};

    if(auditModel && auditModel.checkbox) {
        audit.isApplicable = auditModel.checkbox.indexOf('na') < 0;
    } else {
      audit.isApplicable = true;
    }

    if(auditModel && auditModel.textarea && auditModel.textarea[0]) {
      audit.description = auditModel.textarea[0];
    } else {
      audit.description = '';
    }

    return audit;
  }

  private loadAudit() {
    let model: any = {
      checkbox: [],
      textarea: []
    };

    if(this.viewModel.audit) {
      if(!this.viewModel.audit.isApplicable) {
        model.checkbox.push('na');
      }
      model.textarea.push(this.viewModel.audit.description);
    }

    return model;
  }

  private saveRecords(recordsModel) {
    let records: any = {};

    if(recordsModel) {
      records.description = recordsModel;
    } else {
      records.description = '';
    }

    return records;
  }

  private loadRecords() {
    let model: string = '';

    if(this.viewModel.records && this.viewModel.records.description) {
      model = this.viewModel.records.description;
    }

    return model;
  }

  private saveDocuments(additionalDocumentationModel) {
    let documents: any = {};

    if(additionalDocumentationModel && additionalDocumentationModel.checkbox) {
      documents.isApplicable = additionalDocumentationModel.checkbox.indexOf('na') < 0;
    } else {
      documents.isApplicable = true;
    }

    if(additionalDocumentationModel && additionalDocumentationModel.textarea && additionalDocumentationModel.textarea[0]) {
      documents.description = additionalDocumentationModel.textarea[0];
    } else {
      documents.description = '';
    }

    return documents;
  }

  private loadDocuments() {
    let model: any = {
      checkbox: [],
      textarea: []
    };

    if(this.viewModel.documents) {
      if(!this.viewModel.documents.isApplicable) {
        model.checkbox.push('na');
      }
      model.textarea.push(this.viewModel.documents.description);
    }

    return model;
  }

  private saveFormulaMatching(formulaMatchingModel) {
    let formulaAndMatching: any = {
      types: {},
      formula: {},
      matching: {},
      moe: {}
    };

    if(formulaMatchingModel) {
      if(formulaMatchingModel.checkbox) {
        // todo: correct typo formua -> formula after schema is udpated
        formulaAndMatching.types.formua = formulaMatchingModel.checkbox.indexOf('cfr') !== -1;
        formulaAndMatching.types.matching = formulaMatchingModel.checkbox.indexOf('matching') !== -1;
        formulaAndMatching.types.moe = formulaMatchingModel.checkbox.indexOf('moe') !== -1;
      } else {
        // todo: correct typo formua -> formula after schema is udpated
        formulaAndMatching.types.formua = false;
        formulaAndMatching.types.matching = false;
        formulaAndMatching.types.moe = false;
      }

      if(formulaMatchingModel.title) {
        formulaAndMatching.formula.title = formulaMatchingModel.title;
      } else {
        formulaAndMatching.formula.title = '';
      }

      if(formulaMatchingModel.chapter) {
        formulaAndMatching.formula.chapter = formulaMatchingModel.chapter;
      } else {
        formulaAndMatching.formula.chapter = '';
      }

      if(formulaMatchingModel.part) {
        formulaAndMatching.formula.part = formulaMatchingModel.part;
      } else {
        formulaAndMatching.formula.part = '';
      }

      if(formulaMatchingModel.subPart) {
        formulaAndMatching.formula.subPart = formulaMatchingModel.subPart;
      } else {
        formulaAndMatching.formula.subPart = '';
      }

      if(formulaMatchingModel.publicLaw) {
        formulaAndMatching.formula.publicLaw = formulaMatchingModel.publicLaw;
      } else {
        formulaAndMatching.formula.publicLaw = '';
      }

      if(formulaMatchingModel.additionalInfo) {
        formulaAndMatching.formula.description = formulaMatchingModel.additionalInfo;
      } else {
        formulaAndMatching.formula.description = '';
      }

      if(formulaMatchingModel.matchingRequirements) {
        formulaAndMatching.matching.requirementFlag = formulaMatchingModel.matchingRequirements;
      }

      if(formulaMatchingModel.matchingPercentage) {
        formulaAndMatching.matching.percent = formulaMatchingModel.matchingPercentage;
      }

      if(formulaMatchingModel.matchingDescription) {
        formulaAndMatching.matching.description = formulaMatchingModel.matchingDescription;
      } else {
        formulaAndMatching.matching.description = '';
      }

      if(formulaMatchingModel.moeRequirements) {
        formulaAndMatching.moe.description = formulaMatchingModel.moeRequirements;
      } else {
        formulaAndMatching.moe.description = '';
      }
    }

    return formulaAndMatching;
  }

  private loadFormulaMatching() {
    let model: any = {};
    model.checkbox = [];

    if(this.viewModel.formulaAndMatching) {
      if(this.viewModel.formulaAndMatching.types) {
        // todo: correct typo formua -> formula after schema is udpated
        if(this.viewModel.formulaAndMatching.types.formua) {
          model.checkbox.push('cfr');
        }
        if(this.viewModel.formulaAndMatching.types.matching) {
          model.checkbox.push('matching');
        }
        if(this.viewModel.formulaAndMatching.types.moe) {
          model.checkbox.push('moe');
        }
      }

      if(this.viewModel.formulaAndMatching.formula) {
        if(this.viewModel.formulaAndMatching.formula.title) {
          model.title = this.viewModel.formulaAndMatching.formula.title;
        }
        if(this.viewModel.formulaAndMatching.formula.chapter) {
          model.chapter = this.viewModel.formulaAndMatching.formula.chapter;
        }
        if(this.viewModel.formulaAndMatching.formula.part) {
          model.part = this.viewModel.formulaAndMatching.formula.part;
        }
        if(this.viewModel.formulaAndMatching.formula.subPart) {
          model.subPart = this.viewModel.formulaAndMatching.formula.subPart;
        }
        if(this.viewModel.formulaAndMatching.formula.publicLaw) {
          model.publicLaw = this.viewModel.formulaAndMatching.formula.publicLaw;
        }
        if(this.viewModel.formulaAndMatching.formula.description) {
          model.additionalInfo = this.viewModel.formulaAndMatching.formula.description;
        }
      }

      if(this.viewModel.formulaAndMatching.matching) {
        if(this.viewModel.formulaAndMatching.matching.requirementFlag) {
          model.matchingRequirements = this.viewModel.formulaAndMatching.matching.requirementFlag;
        }
        if(this.viewModel.formulaAndMatching.matching.percent) {
          model.matchingPercentage = this.viewModel.formulaAndMatching.matching.percent;
        }
        if(this.viewModel.formulaAndMatching.matching.description) {
          model.matchingDescription = this.viewModel.formulaAndMatching.matching.description;
        }
      }

      if(this.viewModel.formulaAndMatching.moe) {
        if(this.viewModel.formulaAndMatching.moe.description) {
          model.moeRequirements = this.viewModel.formulaAndMatching.moe.description;
        }
      }
    }

    return model;
  }
}
