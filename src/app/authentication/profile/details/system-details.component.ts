import { Component, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAMService, FHService } from 'api-kit';

@Component({
  templateUrl: './system-details.component.html',
  providers: [
    IAMService,
    FHService
  ]
})
export class SystemDetailsComponent {
  private api = {
    iam: null,
    fh: null
  };

  private store = {
    title: 'System Account Details',
    search: {
      duns: '',
      users: ''
    }
  };

  private states = {
    gov: true,
    system: false,
    submitted: false,
    loading: false
  };

  private detailsForm: FormGroup;
  private user = {
    _id: '',
    email: '',

    title: '',
    suffix: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',

    department: '',
    orgID: '',

    workPhone: '',

    kbaAnswerList: [],
    system: {
      id: '',
      email: '',
      name: '',
      comments: '',

      department: '',
      orgID: '',
      businessName: '',
      businessAddress: '',

      ipAddress: '',
      primaryOwner: '',
      primaryEmail: '',

      pocs: []
    },

    accountClaimed: true
  };

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private _fh: FHService,
    private _iam: IAMService) {
      this.api.iam = _iam.iam;
      this.api.fh = _fh;
    }

  ngOnInit() {
    this.api.iam.checkSession((user) => {
      this.zone.run(() => {
        this.states.system = false; // Check Admin Role
        this.user = user;
        this.states.system ? this.initForm() : this.router.navigate(['/details']);
      });
    }, ()=> {
      this.zone.run(() => {
        if(!this.api.iam.isDebug()) {
          this.router.navigate(['/signin']);
        } else {
          this.user.system.pocs = [
            { firstName: 'Tester', lastName: '#1', email: 'test.user@yahoo.com',   phone: '12223334444' },
            { firstName: 'Tester', lastName: '#2', email: 'test.user@gmail.com',   phone: '15556667777' },
            { firstName: 'Tester', lastName: '#3', email: 'test.user@hotmail.com', phone: '16667778888' }
          ];

          this.initForm()
        }
      });
    });
  }

  initForm() {
    const system = this.user.system;

    this.detailsForm = this.builder.group({
      id:              [system.id, Validators.required],
      email:           [system.email, Validators.required],
      name:            [system.name, Validators.required],
      comments:        [system.comments],

      department:      [system.department, Validators.required],
      orgID:           [system.orgID, Validators.required],

      businessName:    [system.businessName],
      businessAddress: [system.businessAddress],

      ipAddress:       [system.ipAddress],
      primaryOwner:    [system.primaryOwner, Validators.required],
      primaryEmail:    [system.primaryEmail, Validators.required],

      pocs: this.builder.array(system.pocs)
    });
  }

  $errors(controlName) {
    const controls = this.detailsForm.controls,
          errors = controls[controlName].errors || {},
          mappings = Object.keys(errors),
          isError = (this.states.submitted && mappings.length);
    return isError ? errors[mappings[0]] : '';
  }

  setDepartment() {
    console.log('setDepartment()');
    //TODO
  }

  setOrganization() {
    console.log('setOrganization()');
    //TODO
  }

  save() {
    this.states.submitted = true;
    //TODO
  }
}
