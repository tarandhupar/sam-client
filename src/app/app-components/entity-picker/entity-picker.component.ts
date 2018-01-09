import {
  Component,
  ChangeDetectorRef,
  forwardRef,
  Directive,
  Input,
  ElementRef,
  Renderer,
  Output,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl
} from '@angular/forms';
import { UserAccessService } from '../../../api-kit/access/access.service';
import { Observable } from 'rxjs';
import { isArray } from 'lodash';

@Component({
  selector: 'sam-entity-picker',
  templateUrl: 'entity-picker.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntityPickerComponent),
      multi: true
    }
  ]
})
export class EntityPickerComponent implements OnInit, ControlValueAccessor {
  /**
   * Sets the required text in the label wrapper
   */
  @Input() required: boolean;
  /**
   * Sets the label wrapper text
   */
  @Input() label: string;
  /**
   * Sets the name/id properties with form elements + labels
   */
  @Input() name: string = 'default';
  /**
   * Sets the hint text
   */
  @Input() hint: string;
  /**
   * Sets the placeholder text
   */
  @Input() placeholder: string = '';
  /**
   * Sets the label wrapper error message manually
   */
  @Input() searchMessage: string = '';
  /**
   * Sets whether to show a multi autocomplete entity picker or single autocomplete entity picker
   */
  @Input() isMultiple: boolean = true;
  /**
   * Sets whether to limit to the default org that the user belongs to
   */
  @Input() isDefaultOrg: boolean = false;
  /**
   * Sets whether to pre-populate the default org at entity picker
   */
  @Input() isDefaultOrgPrePopulated: boolean = false;
  /**
   * Sets whether to show the entity/orgs that the user can assign based on the user's role
   */
  @Input() isAssignableOrg: boolean = false;
  /**
   * Sets the form control for checking validations and updating label messages
   */
  @Input() control: AbstractControl;
  /**
   * Sets the user id to get related entity autocomplete suggestions
   */
  @Input() userId: string = '';

  private _disabled: boolean = false;

  innerSet: boolean = false;
  selections = [];
  serviceOptions = {};
  multipleACConfig = {
    keyProperty: 'key',
    valueProperty: 'name',
    categoryProperty: 'detail'
  };
  singleACConfig = {
    keyValueConfig: { keyProperty: 'key', valueProperty: 'name' }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private accessService: UserAccessService
  ) {}

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit() {
    this.selections = [];
    if (this.isDefaultOrg && this.isDefaultOrgPrePopulated) {
      this.setDefaultEntity();
    }
  }

  setDefaultEntity() {
    this.accessService
      .getEntityAutoComplete(
        'default',
        false,
        1,
        AUTOCOMPLETE_RECORD_PER_PAGE,
        this.isDefaultOrg,
        false
      )
      .subscribe(res => {
        if (res != null && res.length === 1) {
          let obj = res[0];
          obj['key'] = obj['cageCode'];
          obj['name'] = obj['legalBusinessName'];
          obj['detail'] =
            'CAGE: ' + obj['cageCode'] + ' | DUNS: ' + obj['duns'];
          obj['address'] = this.formatAddressStr(obj['address']);
          if (this.isMultiple) {
            this.selections.push(obj);
          } else {
            this.selections = obj;
          }
          if (this.control) {
            this.innerSet = true;
            this.control.setValue(this.selections);
          }
        }
      });
  }

  onSelection(val, emit: boolean = true) {
    this.selections = val;
    if (emit) {
      this.emitSelections();
    }
  }

  emitSelections() {
    this.onChange(this.selections);
  }

  formatAddressStr(address) {
    let addrParts = address.split(',');
    let cityName = addrParts[0];
    let cityParts = cityName.split(' ');
    let formatedParts = cityParts.map(part => {
      return part.charAt(0) + part.substring(1).toLowerCase();
    });
    addrParts[0] = formatedParts.join(' ');
    return addrParts.join(',');
  }

  // Access control methods
  setDisabledState(disabled) {
    this._disabled = disabled;
  }

  // Allow write entity keys to value
  writeValue(value) {
    if (this.innerSet) {
      this.innerSet = false;
      return;
    }
    if (this.isMultiple && !value) {
      value = [];
    }
    let entityKeys = [];
    if (value) {
      if (!isArray(value)) {
        // convert to array, remove empty elements
        value = [value].filter(o => o);
      }
      entityKeys = value;
    }
    if (entityKeys.length > 0) {
      let entityObservable = entityKeys.map(e => {
        return this.accessService.getEntityById(e);
      });
      let selections = [];
      Observable.forkJoin(entityObservable).subscribe(res => {
        if (res && res.length > 0) {
          try {
            res.forEach(entity => {
              let obj = entity[0];
              obj['key'] = obj['cageCode'];
              obj['name'] = obj['legalBusinessName'];
              obj['detail'] =
                'CAGE: ' + obj['cageCode'] + ' | DUNS: ' + obj['duns'];
              obj['address'] = this.formatAddressStr(obj['address']);
              if (!this.isMultiple && entityKeys.length === 1) {
                selections = obj;
              } else {
                selections.push(obj);
              }
            });
            this.selections = selections;
            if (this.control) {
              this.innerSet = true;
              this.control.setValue(this.selections);
            }
          } catch (error) {
            console.error('Cannot Parse Entity Reponse:');
            console.error(error);
          }
        }
      });
    } else {
      this.selections = value;
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
