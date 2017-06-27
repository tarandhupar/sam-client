import { Component, Input, OnInit } from '@angular/core';
import { SampleFormService } from "../../sample-form.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SampleFormViewModel } from "../../sample-form.model";
import { AutocompleteConfig } from "sam-ui-kit/types";

@Component({
  providers: [SampleFormService],
  selector: 'sample-form-page2',
  templateUrl: 'page2.template.html'
})

export class SampleFormPage2Component implements OnInit {
  @Input() viewModel: SampleFormViewModel;

  pageForm: FormGroup;
  title: string;
  test: string;

  constructor(private fb: FormBuilder, private service: SampleFormService) {
  }

  ngOnInit() {

    this.createForm();
    if (!this.viewModel.isNew) {
      //this.updateForm();
    }

  }

  createForm() {
    this.pageForm = this.fb.group({
      'objective': '',
      'description': '',
      'functionalTypes': '',
      'fcListDisplay': ['', Validators.required],
      'subjectTermsTypes': [''],
      'stListDisplay': ['', Validators.required],
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
  }

  validateSection(){

    for(let key of Object.keys(this.pageForm.controls)) {
      this.pageForm.controls[key].markAsDirty();
      this.pageForm.controls[key].updateValueAndValidity();
    }
  }
}
