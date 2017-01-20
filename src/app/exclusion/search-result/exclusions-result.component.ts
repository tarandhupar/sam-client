import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'exclusions-result',
  template: `
      <p>
    	  <span class="usa-label">Exclusion</span>
    	  <span *ngIf="data.isActive<0" class="usa-label">INACTIVE</span>
    	</p>
    	<h3 class="exclusion-title">
    	<a *ngIf="data.isActive>=0" [routerLink]="['/exclusion', data.samNumber]">{{ data.name }}</a>
      	<span *ngIf="data.isActive<0">{{ data.name }}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.dunsNumber!==''"><strong>DUNS: </strong><span>{{ data.dunsNumber }}</span></li>
          <li *ngIf="data.cageCode!==''"><strong>CAGE Code: </strong><span>{{ data.cageCode }}</span></li>
          <li><strong>Address: </strong><span>{{ data.address.streetAddress }}{{data.address.city=="" || data.address.streetAddress=="" ? '' : ','}} {{ data.address.city }}{{data.address.state=="" || data.address.city=="" ? '' : ','}} {{ data.address.state}} {{data.address.zip}}</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">   
          <li *ngIf="data.classification.code!==null || data.classification.code!==''"><strong>Classification</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.classification.code }}</span></li>
            </ul>
          </li> 
          <li *ngIf="data.activationDate!==null"><strong>Activation Date</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.activationDate }}</span></li>
            </ul>
          </li>    
          <li *ngIf="data.terminationDate!==null"><strong>Termination Date</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.terminationDate }}</span></li>
            </ul>
          </li>      
        </ul>
      </div>
  `
})
export class ExclusionsResult implements OnInit {
  @Input() data: any={};
  constructor() { }

  ngOnInit(){
    if(this.data.activationDate!==null) {
      this.data.activationDate = moment(this.data.activationDate).format("MMM D, Y");
    }
    if(this.data.terminationDate!==null) {
      this.data.terminationDate = moment(this.data.terminationDate).format("MMM D, Y");
      this.data["isActive"] = moment(this.data.terminationDate).diff(moment(new Date()));
    } else {
      this.data["isActive"] = 0;
    }
  }
}
