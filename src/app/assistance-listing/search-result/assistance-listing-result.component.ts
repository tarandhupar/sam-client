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
    	  <span *ngIf="data.isActive==false" class="usa-label">HISTORICAL</span>
    	</p>
    	<h3 class="assistance-listing-title">
      	<a *ngIf="data.isActive==true" [routerLink]="['/programs', data._id, 'view']" [queryParams]="qParams">{{data.title}}</a>
      	<span *ngIf="data.isActive==false">{{data.title}}</span>
    	</h3>
    	<ul class="usa-unstyled-list">    
    	    <li>
    	      <strong>CFDA Number: </strong><span class="fal-program-number">{{data.programNumber}}</span>
          </li>
      </ul>
    	
    	<div class="usa-width-two-thirds">
      	<p *ngIf="data.isActive==true" class="m_T-2x">
          {{data.objective | slice:0:150}}{{data.objective && data.objective.length > 150 ? ' ...' : ''}}
        </p>
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.organizationHierarchy && data.organizationHierarchy[0]?.level==1">
        	  <strong>Department/Ind. Agency:</strong>
        	  <a *ngIf="data.isActive==true" [routerLink]="['/organization', data.organizationHierarchy[0].organizationId]" [queryParams]="qParams">{{data.organizationHierarchy[0].name}}</a>
        	  <span *ngIf="data.isActive==false">{{data.organizationHierarchy[0].name}}</span>
        	</li>
          <li *ngIf="data.organizationHierarchy && data.organizationHierarchy[2]?.level==3">
            <strong>Office:</strong>
            <span>{{data.organizationHierarchy[2].name}}</span>
          </li>
        </ul>
        <!--History section to be displayed only for historical records-->
        <div *ngIf="data.isActive==false">
          <h4 tabindex="0" (keyup.enter)="toggleHistory()" (click)="toggleHistory()" class="collapsible" [class.expanded]="toggleField"><span class="history">History</span></h4>
          <div *ngIf="toggleField">
            <history [data]="history"></history>
          </div>
        </div>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
        	<li><strong>Funded:</strong>
          	<ul class="usa-unstyled-list">
              <li *ngIf="data.isFunded">Yes</li>
              <li *ngIf="!data.isFunded">No</li>
            </ul>
          </li>
          <li><strong>Last Date Modified</strong>
            <ul class="usa-unstyled-list">
              <li>{{data.publishDate}}</li>
            </ul>
          </li>
          <li *ngIf="data.isActive==true"><strong>Type Of Assistance</strong>
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
  history: any = [];
  toggleField: boolean;
	constructor() { }

  ngOnInit(){
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
    this.history = _.map(this.data.historicalIndex, function(value){
      return {
        "id": value.historicalIndexId,
        "index": value.index,
        "date": value.fiscalYear,
        "title": value.body,
      }
    });
    this.history = _.sortBy(this.history, ['index']);
  }

  toggleHistory() {
    this.toggleField = !this.toggleField;
  }

}
