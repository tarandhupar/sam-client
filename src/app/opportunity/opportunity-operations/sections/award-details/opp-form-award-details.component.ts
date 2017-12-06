import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFieldNames } from '../../framework/data-model/opportunity-form-constants';
import { OppNoticeTypeFieldService } from '../../framework/service/notice-type-field-map/notice-type-field-map.service';

@Component({
  selector: 'opp-form-award-details',
  templateUrl: 'opp-form-award-details.template.html'
})

export class OpportunityAwardDetailsComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  public oppAwardDetailsViewModel: any;
  public oppAwardDetailsForm: FormGroup;
  public noticeType: any;

  public readonly awardNumberConfig = {
    id: OpportunityFieldNames.AWARD_NUMBER,
    label: 'Contract Award Number',
    name: OpportunityFieldNames.AWARD_NUMBER + '-input',
    required: true,
    hint: 'Agency assigned number for control tracking and identification. Please use ONLY alphanumeric and - _ ( ) { } characters [no spaces].',
  };

  public readonly amountConfig = {
    id: OpportunityFieldNames.AMOUNT,
    label: 'Total Estimate Contract Dollar Value',
    name: OpportunityFieldNames.AMOUNT + '-input',
    required: true,
    hint: 'The dollar value of this contract plus options, and qualifying text (e.g. not to exceed $250,000). Note: This information will be displayed exactly as entered, format text and dollar amounts appropriately.',
  };

  public readonly lineItemNumberConfig = {
    id: OpportunityFieldNames.LINE_ITEM_NUMBER,
    label: 'Contract Award Line Item Number',
    name: OpportunityFieldNames.LINE_ITEM_NUMBER + '-input',
    required: true,
    hint: 'When appropriate, list the contractor’s appropriate line item number. Please use ONLY alphanumeric and - _ ( ) characters [no spaces].',
  };

  public readonly deliveryOrderNumberConfig = {
    id: OpportunityFieldNames.DELIVERY_ORDER_NUMBER,
    label: 'Task/Delivery Order Number',
    name: OpportunityFieldNames.DELIVERY_ORDER_NUMBER + '-input',
    required: true,
    hint: 'Please use ONLY alphanumeric and - _ ( ) characters [no spaces].',
  };

  public readonly awardeeDunsConfig = {
    id: OpportunityFieldNames.AWARDEE_DUNS,
    label: 'Unique Entity Identifier',
    name: OpportunityFieldNames.AWARDEE_DUNS + '-input',
    required: true,
    hint: 'If provided, must be all numeric, 9 digits with optional plus 4.',
  };

  public readonly awardeeNameConfig = {
    id: OpportunityFieldNames.AWARDEE_NAME,
    label: 'Contractor Awarded Name',
    name: OpportunityFieldNames.AWARDEE_NAME + '-input',
    required: true,
    hint: '',
  };

  constructor(private formBuilder: FormBuilder, private noticeTypeFieldService: OppNoticeTypeFieldService) {
    Object.freeze(this.awardNumberConfig);
    Object.freeze(this.amountConfig);
    Object.freeze(this.lineItemNumberConfig);
    Object.freeze(this.deliveryOrderNumberConfig);
    Object.freeze(this.awardeeDunsConfig);
    Object.freeze(this.awardeeNameConfig);
  }

  ngOnInit() {
    this.oppAwardDetailsViewModel = this.viewModel.oppAwardDetailsViewModel;
    this.noticeType = this.viewModel.oppHeaderInfoViewModel.opportunityType;
    this.createForm();
    if(!this.viewModel.isNew) {
      this.updateForm();
    }
    this.subscribeToChanges();
  }

  private createForm(): void {
    this.oppAwardDetailsForm = this.formBuilder.group({
      awardNumber: '',
      amount: '',
      lineItemNumber: '',
      deliveryOrderNumber: '',
      awardeeDuns: '',
      awardeeName: ''
    });
  }

  private updateForm(): void {
    this.oppAwardDetailsForm.patchValue({
      awardNumber: this.oppAwardDetailsViewModel.awardNumber,
      amount: this.oppAwardDetailsViewModel.amount,
      lineItemNumber: this.oppAwardDetailsViewModel.lineItemNumber,
      deliveryOrderNumber: this.oppAwardDetailsViewModel.deliveryOrderNumber,
      awardeeDuns: this.oppAwardDetailsViewModel.awardeeDuns,
      awardeeName: this.oppAwardDetailsViewModel.awardeeName
    }, {
      emitEvent: false,
    });
  }

  private subscribeToChanges(): void {
    this.linkControlTo(this.oppAwardDetailsForm.get('awardNumber'), this.saveAwardNumber);
    this.linkControlTo(this.oppAwardDetailsForm.get('amount'), this.saveAmount);
    this.linkControlTo(this.oppAwardDetailsForm.get('lineItemNumber'), this.saveLineItemNumber);
    this.linkControlTo(this.oppAwardDetailsForm.get('deliveryOrderNumber'), this.saveDeliveryOrderNumber);
    this.linkControlTo(this.oppAwardDetailsForm.get('awardeeDuns'), this.saveAwardeeDuns);
    this.linkControlTo(this.oppAwardDetailsForm.get('awardeeName'), this.saveAwardeeName);
  }

  private linkControlTo(control: AbstractControl, callback: (value: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges
      .debounceTime(10)
      .distinctUntilChanged()
      .subscribe(value => {
        boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveAwardNumber(number) {
    this.oppAwardDetailsViewModel.awardNumber = number;
  }

  private saveAmount(value) {
    this.oppAwardDetailsViewModel.amount = value;
  }

  private saveLineItemNumber(value) {
    this.oppAwardDetailsViewModel.lineItemNumber = value;
  }

  private saveAwardeeDuns(dunsNo) {
    this.oppAwardDetailsViewModel.awardeeDuns = dunsNo;
  }

  private saveAwardeeName(name) {
    this.oppAwardDetailsViewModel.awardeeName = name;
  }

  private saveDeliveryOrderNumber(value) {
    this.oppAwardDetailsViewModel.deliveryOrderNumber = value;
  }

  private checkFieldDisplayOption(field) {
    return this.noticeTypeFieldService.checkFieldVisibility(this.noticeType, field);
  }

  private checkFieldRequired(field) {
    return this.noticeTypeFieldService.checkFieldRequired(this.noticeType, field);
  }
}
