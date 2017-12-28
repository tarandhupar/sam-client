import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import {OppNoticeTypeMapService} from "../../framework/service/notice-type-map/notice-type-map.service";
import {OpportunitySectionNames} from '../../framework/data-model/opportunity-form-constants';
import {OpportunityFormErrorService} from "../../opportunity-form-error.service";

@Component({
  selector: 'opp-form-description',
  templateUrl: 'description.template.html'
})

export class OpportunityDescriptionComponent implements OnInit {

  @Input() viewModel: OpportunityFormViewModel;
  @Output() showErrors: EventEmitter<any> = new EventEmitter<any>();

  oppDescForm: FormGroup;
  public noticeType: any;
  descriptionLabel: string;

  constructor(private fb: FormBuilder, private noticeTypeMapService: OppNoticeTypeMapService, private errorService: OpportunityFormErrorService) {
  }

  ngOnInit() {
    this.noticeType = this.viewModel.oppHeaderInfoViewModel.opportunityType;
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.oppDescForm.valueChanges.debounceTime(10)
      .distinctUntilChanged().subscribe(data => {
        this.updateViewModel(data);
        this.updateDescriptionError();
      }
    );
  }

  createForm(){
    if (this.noticeType === 'i') {
      this.descriptionLabel = 'Description of Benefits';
    } else {
      this.descriptionLabel = 'Description';
    }
    this.oppDescForm = this.fb.group({
      description: null
    });
    if (this.viewModel.getSectionStatus(OpportunitySectionNames.DESCRIPTION) === 'updated') {
      this.oppDescForm.markAsPristine({onlySelf: true});
      this.oppDescForm.get('description').markAsDirty({onlySelf: true});
      this.oppDescForm.get('description').updateValueAndValidity();
    }
  }

  updateForm(){
    let description = null;
    if(this.viewModel.description && this.viewModel.description.length > 0) {
      for (let item of this.viewModel.description) {
        description = item.body;
      }
    } else {
      description = '';
    }

    this.oppDescForm.patchValue({
      description: description
    }, {
      emitEvent: false
    });

    this.updateErrors();
  }

  updateViewModel(data) {
    let desc = [];
    if(data['description'])  {
      desc.push({
        "body": data['description']
      })
    }
    this.viewModel.description = desc.length > 0 ? desc : null;
  }
  private checkFieldRequired(field) {
    return this.noticeTypeMapService.checkFieldRequired(this.noticeType, field);
  }

  public updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.updateDescriptionError();
  }

  private updateDescriptionError() {
    this.oppDescForm.get('description').clearValidators();
    this.oppDescForm.get('description').setValidators((control) => {
      return control.errors
    });
    this.oppDescForm.get('description').setErrors(this.errorService.validateDesc().errors);
    this.markAndUpdateFieldStat('description');
    this.emitErrorEvent();
  }

  private markAndUpdateFieldStat(fieldName) {
    this.oppDescForm.get(fieldName).updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  private emitErrorEvent() {
    this.showErrors.emit(this.errorService.applicableErrors);
  }
}
