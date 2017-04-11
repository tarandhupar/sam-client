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
  private programId;
  private cookieValue;

  public program: any;
  public complianceRequirementsGroup: FormGroup;
  public policyRequirementsModel: any = {};
  public reportsModel: any = {};
  public auditsModel: any = {};
  public recordsModel: string = '';
  public additionalDocumentationModel: any = {};
  public formulaMatchingModel: any = {};

  public policyRequirementsConfig: any = {
    checkbox: {
      name: 'compliance-policy-requirements',
      label: 'Policy Requirements',
      // todo: check what * is for in hint
      hint: 'Does 2 CFR 200, Uniform Administrative Requirements, Cost Principles, and Audit Requirements for Federal Awards apply to this federal assistance listing?',

      options: [
        { value: 'subpartB', label: 'Subpart B, General Provisions', name: 'policy-requirements-checkbox-subB' },
        { value: 'subpartC', label: 'Subpart C, Pre-Federal Award Requirements and Contents of Federal Awards', name: 'policy-requirements-checkbox-subC' },
        { value: 'subpartD', label: 'Subpart D, Post Federal Award Requirements', name: 'policy-requirements-checkbox-subD' },
        { value: 'subpartE', label: 'Subpart E, Cost Principles', name: 'policy-requirements-checkbox-subE' },
        { value: 'subpartF', label: 'Subpart F, Audit Requirements', name: 'policy-requirements-checkbox-subF' }
      ]
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
    this.complianceRequirementsGroup = this.fb.group({
      policyRequirementsCheckbox: null,
      policyRequirementsTextarea: null,
      reports: null,
      audits: null,
      records: null,
      additionalDocumentation: null,
      formulaMatching: null
    });

    this.complianceRequirementsGroup.get('policyRequirementsCheckbox').valueChanges.subscribe(model => {
      this.policyRequirementsModel.checkbox = model;
    });

    this.complianceRequirementsGroup.get('policyRequirementsTextarea').valueChanges.subscribe(model => {
      this.policyRequirementsModel.textarea = model;
    });

    this.complianceRequirementsGroup.get('reports').valueChanges.subscribe(model => {
      this.reportsModel = model;
    });

    this.complianceRequirementsGroup.get('audits').valueChanges.subscribe(model => {
      this.auditsModel = model;
    });

    this.complianceRequirementsGroup.get('records').valueChanges.subscribe(model => {
      this.recordsModel = model;
    });

    this.complianceRequirementsGroup.get('additionalDocumentation').valueChanges.subscribe(model => {
      this.additionalDocumentationModel = model;
    });

    this.complianceRequirementsGroup.get('formulaMatching').valueChanges.subscribe(model => {
      this.formulaMatchingModel = model;
    });
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
    if(this.program.data && this.program.data.compliance) {
      let CFR200 = this.loadCFR200();
      this.complianceRequirementsGroup.get('policyRequirementsCheckbox').setValue(CFR200.checkbox);
      this.complianceRequirementsGroup.get('policyRequirementsTextarea').setValue(CFR200.description);
      this.complianceRequirementsGroup.get('reports').setValue(this.loadReports());
      this.complianceRequirementsGroup.get('audits').setValue(this.loadAudit());
      this.complianceRequirementsGroup.get('records').setValue(this.loadRecords());
      this.complianceRequirementsGroup.get('additionalDocumentation').setValue(this.loadDocuments());
      this.complianceRequirementsGroup.get('formulaMatching').setValue(this.loadFormulaMatching());
    }
  }

  private saveProgramData(): Observable<any> {
    let data: any = (this.program && this.program.data) || {};

    data.compliance = data.compliance || {};
    data.compliance.CFR200Requirements = this.saveCFR200();
    data.compliance.reports = this.saveReports();
    data.compliance.audit = this.saveAudit();
    data.compliance.records = this.saveRecords();
    data.compliance.documents = this.saveDocuments();
    data.compliance.formulaAndMatching = this.saveFormulaMatching();

    return this.programService.saveProgram(this.programId, data, this.cookieValue);
  }

  private saveCFR200() {
    let CFR200: any = {};

    if(this.policyRequirementsModel && this.policyRequirementsModel.checkbox) {
      CFR200.questions = [];
      for(let checkbox of this.policyRequirementsConfig.checkbox.options) {
        let selected = this.policyRequirementsModel.checkbox.indexOf(checkbox.value) >= 0;
        CFR200.questions.push({code: checkbox.value, isSelected: selected});
      }
    }

    if(this.policyRequirementsModel && this.policyRequirementsModel.textarea) {
      CFR200.description = this.policyRequirementsModel.textarea;
    }

    return CFR200;
  }

  private loadCFR200() {
    let model: any = {
      checkbox: [],
      description: ''
    };

    if(this.program.data.compliance.CFR200Requirements) {
      if(this.program.data.compliance.CFR200Requirements.questions) {
        for(let question of this.program.data.compliance.CFR200Requirements.questions) {
          if(question.isSelected) {
            model.checkbox.push(question.code);
          }
        }
      }

      if(this.program.data.compliance.CFR200Requirements.description) {
        model.description = this.program.data.compliance.CFR200Requirements.description;
      }
    }

    return model;
  }

  private saveReports() {
    let reports: any[] = [];

    if(this.reportsModel && this.reportsModel.checkbox && this.reportsModel.textarea) {
      for(let i = 0; i < this.reportsConfig.checkbox.options.length; i++) {
        let codeName = this.reportsConfig.checkbox.options[i].value;
        let selected = this.reportsModel.checkbox.indexOf(codeName) >= 0;
        let description = this.reportsModel.textarea[i];
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

    if (this.program.data.compliance.reports) {
      for (let report of this.program.data.compliance.reports) {
        if (report.isSelected) {
          model.checkbox.push(report.code);
        }
        model.textarea.push(report.description);
      }
    }

    return model;
  }

  private saveAudit() {
    let audit: any = {};

    if(this.auditsModel && this.auditsModel.checkbox) {
        audit.isApplicable = this.auditsModel.checkbox.indexOf('na') < 0;
    } else {
      audit.isApplicable = true;
    }

    if(this.auditsModel && this.auditsModel.textarea && this.auditsModel.textarea[0]) {
      audit.description = this.auditsModel.textarea[0];
    }

    return audit;
  }

  private loadAudit() {
    let model: any = {
      checkbox: [],
      textarea: []
    };

    if(this.program.data.compliance.audit) {
      if(!this.program.data.compliance.audit.isApplicable) {
        model.checkbox.push('na');
      }
      model.textarea.push(this.program.data.compliance.audit.description);
    }

    return model;
  }

  private saveRecords() {
    let records: any = {};

    if(this.recordsModel) {
      records.description = this.recordsModel;
    }

    return records;
  }

  private loadRecords() {
    let model: string = '';

    if(this.program.data.compliance.records && this.program.data.compliance.records.description) {
      model = this.program.data.compliance.records.description;
    }

    return model;
  }

  private saveDocuments() {
    let documents: any = {};

    if(this.additionalDocumentationModel && this.additionalDocumentationModel.checkbox) {
      documents.isApplicable = this.additionalDocumentationModel.checkbox.indexOf('na') < 0;
    } else {
      documents.isApplicable = true;
    }

    if(this.additionalDocumentationModel&& this.additionalDocumentationModel.textarea && this.additionalDocumentationModel.textarea[0]) {
      documents.description = this.additionalDocumentationModel.textarea[0];
    }

    return documents;
  }

  private loadDocuments() {
    let model: any = {
      checkbox: [],
      textarea: []
    };

    if(this.program.data.compliance.documents) {
      if(!this.program.data.compliance.documents.isApplicable) {
        model.checkbox.push('na');
      }
      model.textarea.push(this.program.data.compliance.documents.description);
    }

    return model;
  }

  private saveFormulaMatching() {
    let formulaAndMatching: any = {
      types: {},
      formula: {},
      matching: {},
      moe: {}
    };

    if(this.formulaMatchingModel) {
      if(this.formulaMatchingModel.checkbox) {
        // todo: correct typo formua -> formula after schema is udpated
        formulaAndMatching.types.formua = this.formulaMatchingModel.checkbox.indexOf('cfr') !== -1;
        formulaAndMatching.types.matching = this.formulaMatchingModel.checkbox.indexOf('matching') !== -1;
        formulaAndMatching.types.moe = this.formulaMatchingModel.checkbox.indexOf('moe') !== -1;
      } else {
        // todo: correct typo formua -> formula after schema is udpated
        formulaAndMatching.types.formua = false;
        formulaAndMatching.types.matching = false;
        formulaAndMatching.types.moe = false;
      }

      if(this.formulaMatchingModel.title) {
        formulaAndMatching.formula.title = this.formulaMatchingModel.title;
      }

      if(this.formulaMatchingModel.chapter) {
        formulaAndMatching.formula.chapter = this.formulaMatchingModel.chapter;
      }

      if(this.formulaMatchingModel.part) {
        formulaAndMatching.formula.part = this.formulaMatchingModel.part;
      }

      if(this.formulaMatchingModel.subPart) {
        formulaAndMatching.formula.subPart = this.formulaMatchingModel.subPart;
      }

      if(this.formulaMatchingModel.publicLaw) {
        formulaAndMatching.formula.publicLaw = this.formulaMatchingModel.publicLaw;
      }

      if(this.formulaMatchingModel.additionalInfo) {
        formulaAndMatching.formula.description = this.formulaMatchingModel.additionalInfo;
      }

      if(this.formulaMatchingModel.matchingRequirements) {
        formulaAndMatching.matching.requirementFlag = this.formulaMatchingModel.matchingRequirements;
      }

      if(this.formulaMatchingModel.matchingPercentage) {
        formulaAndMatching.matching.percent = this.formulaMatchingModel.matchingPercentage;
      }

      if(this.formulaMatchingModel.matchingDescription) {
        formulaAndMatching.matching.description = this.formulaMatchingModel.matchingDescription;
      }

      if(this.formulaMatchingModel.moeRequirements) {
        formulaAndMatching.moe.description = this.formulaMatchingModel.moeRequirements;
      }
    }

    return formulaAndMatching;
  }

  private loadFormulaMatching() {
    let model: any = {};
    model.checkbox = [];

    if(this.program.data.compliance.formulaAndMatching) {
      if(this.program.data.compliance.formulaAndMatching.types) {
        // todo: correct typo formua -> formula after schema is udpated
        if(this.program.data.compliance.formulaAndMatching.types.formua) {
          model.checkbox.push('cfr');
        }
        if(this.program.data.compliance.formulaAndMatching.types.matching) {
          model.checkbox.push('matching');
        }
        if(this.program.data.compliance.formulaAndMatching.types.moe) {
          model.checkbox.push('moe');
        }
      }

      if(this.program.data.compliance.formulaAndMatching.formula) {
        if(this.program.data.compliance.formulaAndMatching.formula.title) {
          model.title = this.program.data.compliance.formulaAndMatching.formula.title;
        }
        if(this.program.data.compliance.formulaAndMatching.formula.chapter) {
          model.chapter = this.program.data.compliance.formulaAndMatching.formula.chapter;
        }
        if(this.program.data.compliance.formulaAndMatching.formula.part) {
          model.part = this.program.data.compliance.formulaAndMatching.formula.part;
        }
        if(this.program.data.compliance.formulaAndMatching.formula.subPart) {
          model.subPart = this.program.data.compliance.formulaAndMatching.formula.subPart;
        }
        if(this.program.data.compliance.formulaAndMatching.formula.publicLaw) {
          model.publicLaw = this.program.data.compliance.formulaAndMatching.formula.publicLaw;
        }
        if(this.program.data.compliance.formulaAndMatching.formula.description) {
          model.additionalInfo = this.program.data.compliance.formulaAndMatching.formula.description;
        }
      }

      if(this.program.data.compliance.formulaAndMatching.matching) {
        if(this.program.data.compliance.formulaAndMatching.matching.requirementFlag) {
          model.matchingRequirements = this.program.data.compliance.formulaAndMatching.matching.requirementFlag;
        }
        if(this.program.data.compliance.formulaAndMatching.matching.percent) {
          model.matchingPercentage = this.program.data.compliance.formulaAndMatching.matching.percent;
        }
        if(this.program.data.compliance.formulaAndMatching.matching.description) {
          model.matchingDescription = this.program.data.compliance.formulaAndMatching.matching.description;
        }
      }

      if(this.program.data.compliance.formulaAndMatching.moe) {
        if(this.program.data.compliance.formulaAndMatching.moe.description) {
          model.moeRequirements = this.program.data.compliance.formulaAndMatching.moe.description;
        }
      }
    }

    return model;
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
