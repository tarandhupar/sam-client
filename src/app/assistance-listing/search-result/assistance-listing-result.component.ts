import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'assistance-listing-result',
  template: `
      <p>
    	  <span class="usa-label">Federal Assistance Listing</span>
    	  <span *ngIf="data.isActive==false" class="usa-label">ARCHIVED</span>
    	</p>
    	<h3 class="assistance-listing-title">
      	<a *ngIf="data.isActive==true" [routerLink]="[printFALLink()]" [queryParams]="qParams">{{data.title}}</a>
      	<span *ngIf="data.isActive==false">{{data.title}}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<p class="m_T-2x">
          {{data.objective | slice:0:150}}{{data.objective && data.objective.length > 150 ? ' ...' : ''}}
        </p>
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.organizationHierarchy && data.organizationHierarchy[0]?.level==1"><strong>Department:</strong><a href=""><span>{{data.organizationHierarchy[0].name}}</span></a></li>
          <li *ngIf="data.organizationHierarchy && data.organizationHierarchy[1]?.level==2"><strong>Agency:</strong><a href=""><span>{{data.organizationHierarchy[1].name}}</span></a></li>
          <li *ngIf="data.organizationHierarchy && data.organizationHierarchy[2]?.level==3"><strong>Office:</strong><a href=""><span>{{data.organizationHierarchy[2].name}}</span></a></li>
          <li *ngIf="data.contacts!=null"><strong>Headquarters Office:</strong> {{data.contacts[0].name}}<br>{{data.contacts[0].address?.streetAddress}}, {{data.contacts[0].address?.city}}, {{data.contacts[0].address?.state}} {{data.contacts[0].address?.zip}} {{data.contacts[0].address?.country}}</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
        	<li><strong>Funded:</strong>
          	<ul class="usa-unstyled-list">
              <li *ngIf="data.isFunded">Yes</li>
              <li *ngIf="!data.isFunded">No</li>
            </ul>
          </li>
        	<li><strong>CFDA Number</strong>
          	<ul class="usa-unstyled-list">
              <li class="fal-program-number">{{data.programNumber}}</li>
            </ul>
          </li>
          <li><strong>Date Published</strong>
            <ul class="usa-unstyled-list">
              <li>{{data.publishDate}}</li>
            </ul>
          </li>
          <li><strong>Type</strong>
            <ul class="usa-unstyled-list">
              <li><span *ngFor="let assistanceTypes of data.assistanceTypes; let i=index">{{ assistanceTypes.code }} {{ assistanceTypes.code!==null ? '-' : '' }} {{ assistanceTypes.value }}{{ assistanceTypes.value!==null && i!==data.assistanceTypes.length-1 ? ',' : '' }}</span></li>
            </ul>
          </li>
        </ul>
      </div>
  `
})
export class AssistanceListingResult implements OnInit {
	@Input() data: any={};
  @Input() qParams:any = {};
	constructor() { }

  ngOnInit(){
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
  }

  printFALLink(){
    return this.data.hasOwnProperty('_links') ? _.get(this.data, ['_links','self','href']):'';
  }
}
