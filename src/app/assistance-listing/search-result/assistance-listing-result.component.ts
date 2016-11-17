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
    	  <span *ngIf="data.archive==true" class="usa-label">ARCHIVED</span>
    	</p>
    	<h3 class="assistance-listing-title">
      	<a *ngIf="data.archive==false" [routerLink]="[printFALLink()]">{{data.title}}</a>
      	<span *ngIf="data.archive==true">{{data.title}}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<p class="m_T-2x">
          {{data.objective | slice:0:150}}{{data.objective && data.objective.length > 150 ? ' ...' : ''}}
        </p>
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.fhNames && data.fhNames[0]"><strong>Department:</strong><a href=""><span>{{data.fhNames[0]}}</span></a></li>
          <li *ngIf="data.fhNames && data.fhNames[1]"><strong>Agency:</strong><a href=""><span>{{data.fhNames[1]}}</span></a></li>
          <li *ngIf="data.fhNames && data.fhNames[2]"><strong>Office:</strong><a href=""><span>{{data.fhNames[2]}}</span></a></li>
          <li *ngIf="data.contacts!=null"><strong>Headquarters Office:</strong> {{data.contacts[0].fullName}}<br>{{data.contacts[0].address}}&nbsp;{{data.contacts[0].city}}</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
        	<li><strong>FAL Number</strong>
          	<ul class="usa-unstyled-list">
              <li class="fal-program-number">{{data.programNumber}}</li>
            </ul>
          </li>
          <li><strong>Date Published</strong>
            <ul class="usa-unstyled-list">
              <li>{{data.publishedDate}}</li>
            </ul>
          </li>
          <li><strong>Type</strong>
            <ul class="usa-unstyled-list">
              <li>{{data.assistanceTypes}}</li>
            </ul>
          </li>
        </ul>
      </div>
  `,
  styles: [ require('../assistance-listing.style.css') ]
})
export class AssistanceListingResult implements OnInit {
	@Input() data: any={};
	constructor() { }

  ngOnInit(){
    this.data.publishedDate = moment(this.data.publishedDate).format("MMM D, Y");
  }

  printFALLink(){
    return this.data.hasOwnProperty('_links') ? _.get(this.data, ['_links','self','href']):'';
  }
}
