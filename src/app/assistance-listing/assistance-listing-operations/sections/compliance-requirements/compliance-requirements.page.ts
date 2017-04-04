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
  public policyRequirementsModel: Object = {};
  public reportsModel: Object = {};
  public auditsModel: Object = {};
  public recordsModel: Object = {};
  public additionalDocumentationModel: Object = {};

  public policyRequirementsConfig: Object = {
    name: 'compliance-policy-requirements',
    label: 'Policy Requirements',
    // todo: check what * is for in hint
    hint: 'Does 2 CFR 200, Uniform Administrative Requirements, Cost Principles, and Audit Requirements for Federal Awards apply to this federal assistance listing?',
    required: false,

    checkbox: {
      options: [
        { value: 'subB', label: 'Subpart B, General Provisions', name: 'policy-requirements-checkbox-subB' },
        { value: 'subC', label: 'Subpart C, Pre-Federal Award Requirements and Contents of Federal Awards', name: 'policy-requirements-checkbox-subC' },
        { value: 'subD', label: 'Subpart D, Post Federal Award Requirements', name: 'policy-requirements-checkbox-subD' },
        { value: 'subE', label: 'Subpart E, Cost Principles', name: 'policy-requirements-checkbox-subE' },
        { value: 'subF', label: 'Subpart F, Audit Requirements', name: 'policy-requirements-checkbox-subF' }
      ]
    },

    textarea: {
      showWhenCheckbox: 'checked'
    }
  };

  public reportsConfig: Object = {
    name: 'compliance-reports',
    label: 'Reports',
    hint: 'What reports does the funding agency require?',
    required: false,

    checkbox: {
      options: [
        { value: 'program', label: 'Program Reports', name: 'reports-checkbox-program' },
        { value: 'crash', label: 'Crash Reports', name: 'reports-checkbox-crash' },
        { value: 'progress', label: 'Progress Reports', name: 'reports-checkbox-progress' },
        { value: 'expenditure', label: 'Expenditure Reports', name: 'reports-checkbox-expenditure' },
        { value: 'performance', label: 'Performance Reports', name: 'reports-checkbox-performance' }
      ]
    },

    textarea: {
      showWhenCheckbox: 'checked'
    }
  };

  public auditsConfig: Object = {
    name: 'compliance-audits',
    label: 'Audits',
    hint: 'Describe audit procedures for this program. Only include requirements not already covered by 2 CFR 200.',
    required: true,

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'audits-checkbox-na' },
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public additionalDocumentationConfig: Object = {
    name: 'compliance-additional-documentation',
    label: 'Regulations, Guidelines, and Literature',
    hint: 'Please reference additional documentation specific to your program Do not include government wide guidance.',
    required: true,

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'additional-documentation-checkbox-na' },
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
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
      policyRequirements: null,
      reports: null,
      audits: null,
      records: null,
      additionalDocumentation: null
    });

    this.complianceRequirementsGroup.get('policyRequirements').valueChanges.subscribe(model => {
      this.policyRequirementsModel = model;
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
