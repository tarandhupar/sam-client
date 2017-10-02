import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IAMService } from 'api-kit';

import { Validators as $Validators } from 'authentication/shared/validators';
import { System, POC } from '../system.interface';

@Component({
  templateUrl: './system-create.component.html',
  providers: [
    IAMService,
  ],
})
export class SystemCreateComponent {
  private store = {
    section: 'Workspace',
    title: 'New System Account',
    messages: {
      requester: 'Complete and submit this form to request a new system account All fields are required for security review to establish your account, unless morked as optional.',
      reviewer:  'Review the follow details ond select opprove or reject.',
    },

    nav: {
      label: ' ',
      children: [
        { route: 'system-information', iconClass: 'pending', label: 'System Information'},
        { route: 'organization',       iconClass: 'pending', label: 'Organization'},
        { route: 'permissions',        iconClass: 'pending', label: 'Permissions'},
        { route: 'security',           iconClass: 'pending', label: 'Security'},
        { route: 'authorization',      iconClass: 'pending', label: 'Authorization'},
      ],
    },
  };

  public states = {
    tab: 0,
    section: 0,
  };

  public system: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.initForm({
      _id: '',
      email: '',
      systemType: 'gov',
      systemName: '',
      systemVersion: '',
      systemDescription: '',
      department: '',
      permissions: [],
      fjps: '',
      ipAddress: '',
      connection: '',
      location: '',
      securityOfficerName: '',
      securityOfficerEmail: '',
      certified: false,
    });
  }

  initForm(system: System) {
    this.system = this.builder.group({
      _id: [system._id],
      email: [system.email],
      systemName: [system.systemName, [Validators.required]],
      systemType: [system.systemType],
      systemVersion: [system.systemVersion, [Validators.required]],
      systemDescription: [system.systemDescription, [Validators.required]],
      department: [system.department, [Validators.required]],
      permissions: this.builder.array([]),
      fjps: [system.fjps, [Validators.required]],
      ipAddress: [system.ipAddress, [Validators.required]],
      connection: [system.connection, [Validators.required]],
      location: [system.location, [Validators.required]],
      securityOfficerName: [system.securityOfficerName, [Validators.required]],
      securityOfficerEmail: [system.securityOfficerEmail, [Validators.required, $Validators.email]],
      certified: [system.certified, [Validators.required]],
    });

    this.updateStatus();
  }

  updateStatus() {
    this.store.nav.children[this.seed].iconClass = 'completed';
    this.store.nav.children[this.seed].iconClass = 'error';
  }

  get seed(): number {
    return Math.floor(Math.random() * 5);
  }

  get title(): string {
    return this.store.title;
  }

  get message(): string {
    return this.store.messages.requester;
  }

  get status(): string {
    return 'Draft';
  }

  get active(): string {
    return this.store.nav[this.states.section];
  }

  onNavigate(route) {
    let item,
        index;

    for(index = 0; index < this.store.nav.children.length; index++) {
      item = this.store.nav.children[index];
      if(item.route == route) {
        this.states.section = index;
        return;
      }
    }

    this.states.tab = 0;
  }

  edit(route: string) {
    this.onNavigate(route);
  }

  cancel() {
    //TODO
  }

  review() {
    //TODO
  }

  next() {
    //TODO
  }
}
