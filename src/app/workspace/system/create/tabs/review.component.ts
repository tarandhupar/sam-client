import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FHService } from 'api-kit';

import { isArray, isString } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
})
export class ReviewComponent {
  @Input() form: FormGroup;
  @Input() editable: boolean = true;
  @Output() onEdit: EventEmitter<string> = new EventEmitter();

  private subscriptions = {};
  private key: string = '';
  private organization: string = '';

  constructor(private api: FHService) {}

  ngOnInit() {
    const form = this.form;

    if(form && form.get('organization')) {
      this.subscriptions['organization'] = form.get('organization').valueChanges.subscribe(item => {
        this.updateCache();
      });
    }

    this.updateCache();
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.subscriptions).map(key => {
      if(this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    });
  }

  updateCache() {
    let form = this.form.get('organization').value,
        key = form['officeOrgId'] || form['agencyOrgId'] || form['departmentOrgId'];

    if(key !== this.key) {
      // Cache the key to prevent uneccessary calls later if we need to update
      this.key = key;
      // Get organization name from FH API
      this.fetch();
    }
  }

  fetch() {
    const key = this.key;

    if(key) {
      if(this.subscriptions['fh']) {
        this.subscriptions['fh'].unsubscribe();
      }

      this.subscriptions['fh'] = this.api
        .getOrganizationById(key, true)
        .subscribe(data => {
          const organization = data['_embedded'][0]['org'];
          this.organization = organization.name || '';
        });
    }
  }

  titleize(value: string) {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.replace(word[0], word[0].toUpperCase()))
      .join(' ');
  }

  unslugify(value: string) {
    return value.replace(/-/g, ' ');
  }

  field(key: Array<string|number>|string = '') {
    let field = null,
        pattern = /(contractOpportunities|contractData|entityInformation|fips199Categorization)/,
        control;

    if(this.form.get(key)) {
      control = this.form.get(key);

      if(control.value) {
        field = control.value;

        if(typeof key == 'string' && key.match(/authorizationDate/i)) {
          if(moment(field).isValid()) {
            field = moment(field).format('MMM D, h:mm a')
          }
        } else if(typeof key == 'string' && key.match(pattern)) {
          if(isArray(field)) {
            field = field.map(value => this.titleize(this.unslugify(value)));
          } else {
            field = this.titleize(field);
          }
        }
      }

      field = field || '';
    }

    return field;
  }

  edit(section: string) {
    if(section) {
      this.onEdit.emit(section);
    }
  }
}
