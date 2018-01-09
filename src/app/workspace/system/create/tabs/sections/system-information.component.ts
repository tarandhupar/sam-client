import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SamPasswordComponent } from 'app-components';

import { Section } from './section';

@Component({
  selector: 'system-information',
  templateUrl: './system-information.component.html',
})
export class SystemInformationComponent extends Section implements OnChanges {
  @ViewChild(SamPasswordComponent) $password;

  @Input('group') form: FormGroup;
  @Input() submitted: boolean = false;

  private password = null as FormControl;

  constructor() {
    super();
    this.labels = {
      systemAccountName: {
        label: 'System Account Name',
        hint: 'Provide a unique name for your new system account.',
      },

      interfacingSystemVersion: {
        label: 'Interfacing System Name and Version',
        hint: 'Provide the name and version of the system that will be connecting to SAM.gov.',
      },

      systemDescriptionAndFunction: {
        label: 'System Description ond Function',
        hint: '<strong>Example</strong>: <em>The IRS stated in a current MOU that their system tracks all incoming commitment requests and captures the information necessary to make awards</em>',
      }
    }
  }

  ngOnInit() {
    const control = this.form.get('password');

    if(control.enabled && control.value.length > 0) {
      this.password = new FormControl(control.value);
      control.patchValue('');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    let $submitted = changes['submitted']

    if($submitted.currentValue === true && this.$password) {
      this.$password.setSubmitted();
    }
  }

  errors(key: string = ''): string {
    return this.getError(this.form, key, this.submitted);
  }
}
