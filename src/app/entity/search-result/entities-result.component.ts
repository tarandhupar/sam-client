import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'entities-result',
  template: `
      <p>
    	  <span class="usa-label">Entity</span>
    	  <span *ngIf="data.isActive==false" class="usa-label">INACTIVE</span>
    	</p>
    	<h3 class="entity-title">
      	<a *ngIf="data.isActive==true" href="/">{{ data.name }}</a>
      	<span *ngIf="data.isActive==false">{{ data.name }}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li><strong>DUNS: </strong><span>{{ data.dunsNumber }}</span></li>
          <li><strong>NCAGE Code: </strong><span>{{ data.cageCode }}</span></li>
          <li *ngIf="data.aac && data.aac!==null"><strong>DODAAC: </strong><span>{{ data.aac }}</span></li>
          <li><strong>Entity Address: </strong><span>{{ data.address.streetAddress }}<br/>{{ data.address.city }}, {{ data.address.state}}, {{data.address.zip}}</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
        	<!--<li><strong>Status: </strong><span>Submitted/Pending</span></li>-->
          <li><strong>Expiration Date: </strong><span>{{ data.registrationExpirationDate }}</span></li>
          <li><strong>Purpose of Registration: </strong><span>{{ data.registrationPurpose }}</span></li>
          <li><strong>Active Exclusions: </strong><span>{{ data.hasExclusions==true ? 'Yes' : 'No' }}</span></li>
          <li><strong>Delinquent federal debt: </strong><span>{{ data.hasDelinquentDebt==true ? 'Yes' : 'No' }}</span></li>
        </ul>
      </div>
  `,
  styleUrls: []
})
export class EntitiesResult implements OnInit {
  @Input() data: any={};
  constructor() { }

  ngOnInit(){
    this.data.registrationExpirationDate = moment(this.data.registrationExpirationDate).format("MMM D, Y");
  }
}
