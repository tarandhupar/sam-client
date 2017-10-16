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

  private options = {
    authorizationConfirmation: [
      { label: 'I certify that all the information for this system account is current and correct.', name: 'certifed', value: true },
    ]
  }

  private user: User = new User({});

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
    this.api.iam.user.get(user => {
      this.user = user;
    });
  }

  get name(): string {
    return this.user.fullName;
  }

  get date(): string {
    return moment().format('MMM D, h:mm a');
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
