import { Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OrganizationComponent } from './sections';

import { User } from 'api-kit/iam/interfaces';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  @ViewChild(OrganizationComponent) organization: OrganizationComponent;

  @Input() user: User;
  @Input() submitted: boolean = false;
  @Input('group') form: FormGroup;

  @Output() onChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  private _section: string = 'system-information';

  constructor(private zone: NgZone) {}

  get section() {
    return this._section;
  }

  @Input()
  set section(section: string) {
    const resolve = (() => {
      this.onChange.emit([this._section, section]);
      this._section = section;
    });

    // We need to wait for all changes to finish before processing the ng-switch directive
    if(this._section == 'organization') {
      this.zone.runOutsideAngular(() => {
        this.flush(resolve);
      });
    } else {
      resolve();
    }
  }

  flush(cb: () => any) {
    this.organization.agencyPicker.setOrganizationFromBrowse();
    setTimeout(() => {
      this.zone.run(cb);
    }, 600);
  }
}
