import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { OpportunityFormService } from '../../opportunity-operations/framework/service/opportunity-form/opportunity-form.service';
import { OpportunityTypeLabelPipe } from '../../pipes/opportunity-type-label.pipe';

@Component({
  selector: 'opp-related-notice',
  templateUrl: 'related-notice.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RelatedNoticeComponent),
      multi: true
    },
  ]
})
export class RelatedNoticeComponent implements ControlValueAccessor{
  @Input() baseType: string;
  @Output() public onChange: EventEmitter<any> = new EventEmitter();

  public readonly autocompleteId = 'opp-related-notice';
  public readonly autocompleteAllowAny = false;
  public readonly autocompleteHint = '';
  public readonly autocompleteLabel = 'Related Notice';
  public readonly autocompleteName = 'relatedNoticeSearch';
  public readonly autocompleteRequired = false;

  private model: any;
  public relatedNoticeForm: FormGroup;
  public relatedNoticeControl: FormControl;

  private subscriptions: Subscription = new Subscription();

  public readonly autocompleteKeyValueConfig = {
    keyProperty: 'key',
    valueProperty: 'value',
  };

  constructor(private oppFormService: OpportunityFormService,
              private noticeTypePipe: OpportunityTypeLabelPipe) {
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.relatedNoticeControl = new FormControl();

    this.relatedNoticeForm = new FormGroup({
      autocomplete: this.relatedNoticeControl,
    });

    this.relatedNoticeControl.valueChanges.subscribe(value => {
      this.model = value;

      if(this.model && this.model.key) {
        this.onChangeCallback(this.model.key);
      } else {
        this.onChangeCallback(this.model);
      }
      this.onChange.emit(value);
    });
  }

  private writeModel(key, value) {
    this.model = {};
    this.model[this.autocompleteKeyValueConfig.keyProperty] = key;
    this.model[this.autocompleteKeyValueConfig.valueProperty] = value;
    this.relatedNoticeControl.setValue(this.model);
  }


  /** Implement ControlValueAccessor interface **/

  private onChangeCallback: any = (_: any) => {};
  private onTouchedCallback: any = () => {};

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public writeValue(value: string): void {
    this.model = null;

    // todo: check if this is necessary?
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();

    if (!value) {
      return;
    }

    this.subscriptions.add(
      this.oppFormService.getOpportunity(value).subscribe(res => {
        let uuid = value;
        let noticeType = this.noticeTypePipe.transform(res.data.type);
        let title = [res.data.solicitationNumber, res.data.title, noticeType].join(' - ');

        this.writeModel(uuid, title);
      }, error => {
        console.error('Error getting related notice ', value, ': ', error);
      })
    );
  }

  public setDisabledState(isDisabled: boolean): void {
    // todo...
  }
}
