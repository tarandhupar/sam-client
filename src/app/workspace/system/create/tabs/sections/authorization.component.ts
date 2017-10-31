import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IAMService } from 'api-kit';
import { User } from 'api-kit/iam/api/core/user';

import { Section } from './section';
import * as moment from 'moment';

@Component({
  selector: 'authorization',
  templateUrl: './authorization.component.html',
})
export class AuthorizationComponent extends Section {
  @Input('group') form: FormGroup;
  @Input() submitted: boolean = false;

  private options = {
    authorizationConfirmation: {
      label: 'I certify that all the information for this system account is current and correct.',
      name: 'authorization-confirmation',
      value: true
    },
  }

  private user: User = new User({});
  private subscriptions = {};

  constructor(private api: IAMService) {
    super();
    this.labels = {
      uploadAto: {
        label: 'Authority to Operate',
        hint: 'Upload the current ATO (Authority to Operate) for the interfacing system in PDF format.',
      },
    }
  };

  ngOnInit() {
    const form = this.form,
          control = form.get('authorizationConfirmation');

    this.api.iam.user.get(user => {
      this.user = user;
    });

    this.subscriptions['confirmation'] = control.valueChanges.subscribe(confirmation => {
      if(!confirmation) {
        form.get('authorizationDate').patchValue('');
        form.get('authorizingOfficialName').patchValue('');
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.subscriptions).map(key => {
      if(this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    });
  }

  errors(key: string = ''): string {
    return this.getError(this.form, key, this.submitted);
  }

  get name(): string {
    const form = this.form,
          control = this.form.get('authorizingOfficialName');
    let name = '';

    if(form.get('authorizationConfirmation').value) {
      if(!control.value) {
        control.patchValue(this.user.fullName);
      }

      name = control.value;
    }

    return name;
  }

  get date(): string {
    const form = this.form,
          control = this.form.get('authorizationDate');
    let date = '';

    if(form.get('authorizationConfirmation').value) {
      if(!control.value) {
        control.patchValue(moment());
      }

      date = moment(control.value).format('MMM D, h:mm a');
    }

    return date;
  }

  get filename(): string {
    const control = this.form.get('uploadAto');
    let filename = '';

    if(control && control.value) {
      filename = control.value.replace(/\\/g, '/');
      filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
    }

    return filename;
  }

  upload(event: Event) {
    //TODO
  }
}
