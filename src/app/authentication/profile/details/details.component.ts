import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../shared/validators';

@Component({
  templateUrl: './details.component.html',
  providers: [IAMService]
})
export class DetailsComponent {
  public details: FormGroup;

  ngOnInit() {
    console.log(this);
  }
};
