/**
 * Created by prashant.pillai on 4/19/17.
 */
import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  moduleId: __filename,
  selector: 'regional-office-listing-result',
  template: `
      <div class="sam-ui grid">
  	    <div class="row">
  	      <div class="eight wide column">
            <h3 class="regional-office-listing-title">
              <span>{{data.title}}</span>
            </h3>
          
            <ul class="sam-ui small list">
              <li class="region-name">
                <strong>State/Region</strong><br>
                <span>{{data.region}}</span>
              </li> 
              <li class="address-regional-office-listing">  
                <strong>Address</strong><br>
                <span>{{data.address?.streetAddress }}<ng-container *ngIf="data.address?.streetAddress2 && data.address?.streetAddress">, </ng-container>{{data.address?.streetAddress2}}<ng-container *ngIf="data.address?.city && data.address?.streetAddress">,</ng-container> {{ data.address.city }}<ng-container *ngIf="data.address?.state && data.address?.city">,</ng-container> {{ data.address.state}} {{data.address.zip}}</span>
              </li>
              <li class="phone-info">  
                <strong>Phone</strong><br>
                <span>{{data.phone}}</span>
              </li>
            </ul>
          </div>
      
          <div class="four wide column">
            <ul class="sam-ui small list">
               <li>
                 <span class="sam-ui mini label">Regional Agency Location</span>
               </li>
               <br>
               <li class="subbranch-name">  
                 <strong>Sub-Branch</strong><br>
                 <span>{{data.subbranch}}</span>
               </li>
               <li class="division-name">  
                 <strong>Division</strong><br>
                 <span>{{data.division}}</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
  `
})

export class RegionalOfficeListingResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};

  constructor() { }

  ngOnInit(){ }

}
