import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import Moment = moment.Moment;

@Component({
  moduleId: __filename,
  selector: 'entities-result',
  template: `
      <p>
    	  <span class="usa-label">Entity</span>
    	  <span *ngIf="data.isActive<0" class="usa-label">INACTIVE</span>
    	</p>
    	<h3 class="entity-title">
      	<a *ngIf="data.isActive>=0" [routerLink]="['/entity', data.dunsNumber]" [queryParams]="qParams">{{ data.name }}</a>
      	<span *ngIf="data.isActive<0">{{ data.name }}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li><strong>DUNS: </strong><span>{{ data.dunsNumber }}</span></li>
          <li><strong>NCAGE Code: </strong><span>{{ data.cageCode }}</span></li>
          <li *ngIf="data.aac && data.aac!==null"><strong>DODAAC: </strong><span>{{ data.aac }}</span></li>
          <li><strong>Entity Address: </strong><span>{{ data.address.streetAddress }}, {{ data.address.city }}, {{ data.address.state}} {{data.address.zip}}</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
          <li><strong>Expiration Date: </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.registrationExpirationDate }}</span></li>
            </ul>
          </li>    
          <li><strong>Purpose of Registration: </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.registrationPurpose }}</span></li>
            </ul>
          </li>      
          <li><strong>Delinquent Federal Debt: </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.hasDelinquentDebt==true ? 'Yes' : 'No' }}</span></li>
            </ul>
          </li>    
        </ul>
      </div>
  `
})
export class EntitiesResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  constructor() { }

  ngOnInit(){
    if(this.data.registrationExpirationDate!==null) {
      let exp = moment(this.data.registrationExpirationDate);
      this.data.registrationExpirationDate = exp.format("MMM D, Y");
      this.data["isActive"] = exp.diff(moment());
    } else {
      this.data["isActive"] = 0;
    }
  }
}
