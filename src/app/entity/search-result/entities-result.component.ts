import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import Moment = moment.Moment;

@Component({
  moduleId: __filename,
  selector: 'entities-result',
  template: `
  	<div class="sam-ui grid">
  	  <div class="row">
  	    <div class="eight wide column">
          <h3 class="entity-title">
            <a *ngIf="data.isActive==true" [routerLink]="['/entity', data.dunsNumber]" [queryParams]="qParams">
              {{ data.name }}
            </a>
            <span *ngIf="data.isActive==false">
              {{ data.name }}
            </span>
          </h3>
          <ul class="sam-ui small list">
            <li>
              <strong>DUNS</strong><br>
              {{ data.dunsNumber }}
            </li>
            <li>
              <strong>NCAGE Code</strong><br>
              {{ data.cageCode }}
            </li>
            <li *ngIf="data.aac && data.aac!==null">
              <strong>DODAAC</strong><br>
              {{ data.aac }}
            </li>
            <li>
              <strong>Entity Address</strong><br>
              {{ data.address.streetAddress }}, {{ data.address.city }}, 
              {{ data.address.state}} {{data.address.zip}}
              </li>
          </ul>
  	    </div>
  	    <div class="four wide column">
          <ul class="sam-ui small list">
            <li *ngIf="data.isActive==false">
              <span  class="sam-ui mini label">Inactive</span>
            </li>
            <li>
              <span class="sam-ui mini label">Entity</span>
            </li>
            <li>
              <strong>Expiration Date</strong><br>
              {{ data.registrationExpirationDate }}
            </li>    
            <li>
            <strong>Purpose of Registration</strong><br>
              {{ data.registrationPurpose }}
            </li>      
            <li>
              <strong>Delinquent Federal Debt: </strong><br>
              {{ data.hasDelinquentDebt==true ? 'Yes' : 'No' }}
            </li>    
          </ul>
        </div>
  	  </div>
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
    }
  }
}
