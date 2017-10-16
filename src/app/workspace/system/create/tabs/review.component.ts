import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FHService } from 'api-kit';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
})
export class ReviewComponent {
  @Input() form: FormGroup;
  @Input() active: boolean = false;
  @Output() onEdit: EventEmitter<string> = new EventEmitter();

  private api = { fh: null };
  private subscriptions = {};
  private organization: string = '';

  constructor(private _fh: FHService) {
    this.api.fh = _fh;
  }

  ngOnInit() {
    let form = this.form.get('organization').value,
        key = form['officeOrgId'] || form['agencyOrgId'] || form['departmentOrgId'];

    this.api.fh
     .getOrganizationById(key)
     .subscribe(data => {
       const organization = data['_embedded'][0]['org'];
       this.organization = organization.name || '';
     });
  }

  ngOnDestroy

  field(key: Array<string|number>|string = '') {
    if(this.form.get(key)) {
      return this.form.get(key).value;
    }

    return '';
  }

  edit(section: string) {
    if(section) {
      this.onEdit.emit(section);
    }
  }
}
