import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAMService } from 'api-kit';

@Component({
  templateUrl: './system-details.component.html',
  providers: [
    IAMService
  ]
})
export class SystemDetailsComponent {
  private store = {
    title: 'System Account Details',
  };

  public detailsForm: FormGroup;

  constructor(private router: Router, private builder: FormBuilder, private _iam: IAMService) {}

  ngOnInit() {
    this.detailsForm = this.builder.group({
      //TODO
    });
  }

  save() {
    //TODO
  }
}
