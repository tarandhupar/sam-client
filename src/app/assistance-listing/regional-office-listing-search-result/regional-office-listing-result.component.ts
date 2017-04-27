/**
 * Created by prashant.pillai on 4/19/17.
 */
import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  moduleId: __filename,
  selector: 'regional-office-listing-result',
  template: `
      <p>
    	  <span class="usa-label">Regional Agency Location</span>
    	</p>
    	
    	<h3 class="regional-office-listing-title">
      	<span>{{data.title}}</span>
    	</h3>
    	
    	
    	<ul class="usa-unstyled-list">    
    	    <li class="region-name">
    	      <strong>State/Region: </strong>
    	      <span>{{data.region}}</span>
          </li>
      </ul>
      
      
      <div class="usa-width-two-thirds">
        <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
          <li class="address-regional-office-listing">  
            <strong>Address: </strong>
            <span>{{data.address?.streetAddress }}<ng-container *ngIf="data.address?.streetAddress2 && data.address?.streetAddress">, </ng-container>{{data.address?.streetAddress2}}<ng-container *ngIf="data.address?.city && data.address?.streetAddress">,</ng-container> {{ data.address.city }}<ng-container *ngIf="data.address?.state && data.address?.city">,</ng-container> {{ data.address.state}} {{data.address.zip}}</span>
          </li>
        
          <li class="phone-info">  
            <strong>Phone: </strong>
            <span>{{data.phone}}</span>
          </li>
        </ul>
      </div>
      
      <div class="usa-width-one-third">
      <ul class="usa-text-small m_T-3x m_B-2x"> 
          <li class="subbranch-name">  
            <strong>Sub-Branch </strong>
            <ul class="usa-unstyled-list">
            <span>{{data.subbranch}}</span>
            </ul>
          </li>
          <li class="division-name">  
            <strong>Division </strong>
            <ul class="usa-unstyled-list">
            <span>{{data.division}}</span>
            </ul>
          </li>
      </ul>
      </div>
  `
})

export class RegionalOfficeListingResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  history: any = [];
  toggleField: boolean;
  constructor() { }

  ngOnInit(){

  }



}
