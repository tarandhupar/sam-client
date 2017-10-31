import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DictionaryService } from "api-kit";

import { FALFormErrorService, FieldError } from '../../fal-form-error.service';
import { FALFieldNames, FALSectionNames } from '../../fal-form.constants';
import { FALFormViewModel } from "../../fal-form.model";
import { FALFormService } from "../../fal-form.service";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-compliance-requirements',
  templateUrl: 'fal-form-compliance-requirements.template.html'
})
export class FALFormComplianceRequirementsComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;

  @ViewChild('reportsComp') reportsComp;
  @ViewChild('auditsComp') auditsComp;
  @ViewChild('additionalDocumentationComp') additionalDocumentationComp;

  @Output() public showErrors = new EventEmitter();

  public program: any;
  public complianceRequirementsGroup: FormGroup;

  regulationHint:string = `<p>List the reference to all official published information pertinent to the program in the order indicated below.</p> 
                  <p>If there are no materials of this nature available, enter "None." … A citation to the Code of Federal Regulations (CFR) including the title, part, and sections where appropriate. … The title, number, and price of guidelines, handbooks, or manuals. 
                  Specify where these documents may be obtained if different from the Federal level offices described in the Information Contacts section of the program description. … The title, number and price of additional literature such as reports and brochures that are available. 
                  Specify where these materials may be obtained if different from the Federal level offices described in the Information Contacts section of the program description.</p>`;

  formulaMatchingHint:string =`<p>See the reference guide or online help for instructions when Yes is selected.</p>
                               <p>Cite the statutory and/or administrative rule reference in the Code of Federal Regulations (CFR) to include the title, chapter, part and subpart or the public law citation. If the program has no statutory formula, indicate: "This program has no statutory formula."</p>
                                <p>Specify by name each formula factor and its weight (percentage). Briefly describe the mathematical calculation performed. Provide the statistical source, agency and the date of that source used in computation of the formula identified above. If the source is unpublished, this should be indicated along with the identification of the office maintaining the data. Specify the current cost-sharing arrangement for the program. Include the minimum and/or maximum constraints by percentage.</p>
                                <p>Specify the range of financial or other matching required from nonfederal sources, e.g., State and local governments or other organizations and individuals. Identify the available bonuses or incentives. Identify the amount of the nonfederal share as it increases/decreases from the past fiscal year to the budget fiscal year. If the program has no matching requirements, indicate: "This program has no matching requirements."</p>
                                <p>Maintenance of Effort (MOE) requirements are provisions intended to ensure that Federal funds are used to supplement, not supplant, existing State and local resources. In most cases, these requirements are intended to prevent State and local governments from reducing their spending in federally funded areas as a condition for receiving Federal grants.</p>
                                <p>If MOE programs have total allocations of $100 million or over in the current fiscal year, the following statement should be placed in the Formula and Matching Requirements section: "This program has MOE requirements; see funding agency for further details."</p>`;

  public policyRequirementsConfig: any = {
    checkbox: {
      name: 'compliance-policy-requirements',
      label: 'Does 2 CFR 200, Uniform Administrative Requirements, Cost Principles, and Audit Requirements for Federal Awards apply to this assistance listing?',

      options: []
    },

    textarea: {
      name: 'compliance-policy-additional-info',
      label: 'Additional Information'
    }
  };

  public reportsConfig: any = {
    name: FALFieldNames.COMPLIANCE_REPORTS,
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
      hint: ['Describe required program reports', 'Describe required cash reports', 'Describe required progress reports', 'Describe required expenditure reports', 'Describe required performance reports'],
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
    hint: this.regulationHint,
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
    hint: this.formulaMatchingHint,
    required: false,
  };

  constructor(private fb: FormBuilder,
              private dictService: DictionaryService,
              private errorService: FALFormErrorService) {

    let filteredDictionaries = this.dictService.filterDictionariesToRetrieve('cfr200_requirements');
    if (filteredDictionaries===''){
      this.addRequirements(dictService.dictionaries);
    } else {
      dictService.getProgramDictionaryById('cfr200_requirements').subscribe(data => {
        this.addRequirements(data);
      });
    }
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

    setTimeout(() => { // horrible hack to trigger angular change detection
      if (this.viewModel.getSectionStatus(FALSectionNames.COMPLIANCE_REQUIREMENTS) === 'updated') {
        this.complianceRequirementsGroup.markAsPristine({onlySelf: true});
        this.complianceRequirementsGroup.get('policyRequirementsCheckbox').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('policyRequirementsCheckbox').updateValueAndValidity();
        this.complianceRequirementsGroup.get('policyRequirementsTextarea').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('policyRequirementsTextarea').updateValueAndValidity();
        this.complianceRequirementsGroup.get('reports').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('reports').updateValueAndValidity();
        this.complianceRequirementsGroup.get('audits').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('audits').updateValueAndValidity();
        this.complianceRequirementsGroup.get('records').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('records').updateValueAndValidity();
        this.complianceRequirementsGroup.get('additionalDocumentation').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('additionalDocumentation').updateValueAndValidity();
        this.complianceRequirementsGroup.get('formulaMatching').markAsDirty({onlySelf: true});
        this.complianceRequirementsGroup.get('formulaMatching').updateValueAndValidity();

        for (let id in this.reportsComp.validationGroup.controls) {
          let fcontrol =  this.reportsComp.validationGroup.get(id);
          fcontrol.markAsDirty();
          // fcontrol.updateValueAndValidity({onlySelf: true});
        }

        for (let id in this.auditsComp.validationGroup.controls) {
          let fcontrol =  this.auditsComp.validationGroup.get(id);
          fcontrol.markAsDirty();
          // fcontrol.updateValueAndValidity({onlySelf: true});
        }

        for (let id in this.additionalDocumentationComp.validationGroup.controls) {
          let fcontrol =  this.additionalDocumentationComp.validationGroup.get(id);
          fcontrol.markAsDirty();
          // fcontrol.updateValueAndValidity({onlySelf: true});
        }
      }
    });

    this.complianceRequirementsGroup.valueChanges.subscribe(data => {
      this.updateViewModel(data);
    });
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

    setTimeout(() => {
      this.updateErrors();
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

    setTimeout(() => {
      this.updateErrors();
    });
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
        model.textarea.push(report.description || '');
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
        formulaAndMatching.types.formula = formulaMatchingModel.checkbox.indexOf('cfr') !== -1;
        formulaAndMatching.types.matching = formulaMatchingModel.checkbox.indexOf('matching') !== -1;
        formulaAndMatching.types.moe = formulaMatchingModel.checkbox.indexOf('moe') !== -1;
      } else {
        formulaAndMatching.types.formula = false;
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
        if(this.viewModel.formulaAndMatching.types.formula) {
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

  private updateErrors() {

    this.errorService.viewModel = this.viewModel;

    this.updateReportErrors(this.errorService.validateComplianceReports());
    this.updateAuditErrors(this.errorService.validateComplianceAudits());
    this.updateAddDocumentationErrors(this.errorService.validateAdditionDocumentation());

    this.showErrors.emit(this.errorService.applicableErrors);
  }

  updateReportErrors(reportErrors){
    for (let id in this.reportsComp.validationGroup.controls) {
      let fcontrol =  this.reportsComp.validationGroup.get(id);
      let wrapperControl = this.reportsComp.compTextarea._results[id.substr(id.length - 1)];
      if(reportErrors) {
        let currentErrors = FALFormErrorService.findErrorById(reportErrors, FALFieldNames.COMPLIANCE_REPORTS + '-' + id) as FieldError;
        if(currentErrors){
          this.setControlErrors(fcontrol, currentErrors);
          if (this.viewModel.getSectionStatus(FALSectionNames.COMPLIANCE_REQUIREMENTS) === 'updated') {
            fcontrol.markAsDirty();
          }
          wrapperControl.wrapper.formatErrors(fcontrol);
        } //end of if
        else {
          this.resetControlErrors(fcontrol);
          wrapperControl.wrapper.formatErrors(fcontrol);
        }
      }
      else {
        this.resetControlErrors(fcontrol);
        wrapperControl.wrapper.formatErrors(fcontrol);
      }
    } //end of for
  }

  updateAuditErrors(auditErrors) {
    if(auditErrors) {
      for (let id in this.auditsComp.validationGroup.controls) {
        let fcontrol =  this.auditsComp.validationGroup.get(id);
        this.setControlErrors(fcontrol, auditErrors);
      }
    }
  }

  updateAddDocumentationErrors(addDocErrors){
    if(addDocErrors){
      for (let id in this.additionalDocumentationComp.validationGroup.controls) {
        let fcontrol =  this.additionalDocumentationComp.validationGroup.get(id);
        this.setControlErrors(fcontrol, addDocErrors);
      }
    }
  }

  setControlErrors(fcontrol, ferrors){
    fcontrol.clearValidators();
    fcontrol.setValidators((control) => { return control.errors });
    fcontrol.setErrors(ferrors.errors);
  }

  resetControlErrors(fcontrol){
    fcontrol.clearValidators();
    fcontrol.markAsPristine();
    fcontrol.setErrors(null);
  }

  addRequirements(data){
    for(let requirement of data['cfr200_requirements']) {
      this.policyRequirementsConfig.checkbox.options.push({
        value: requirement.code,
        label: requirement.value,
        name: 'policy-requirements-checkbox-' + requirement.code
      });
    }
  }
}
