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
    	<div class="usa-width-two-thirds">
      	<p class="m_T-2x">
          {{data.objective | slice:0:150}}{{data.objective && data.objective.length > 150 ? ' ...' : ''}}
        </p>
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.organizationHierarchy && data.organizationHierarchy[0]?.level==1"><strong>Department/Ind. Agency:</strong><a href=""><span>{{data.organizationHierarchy[0].name}}</span></a></li>
          <li *ngIf="data.organizationHierarchy && data.organizationHierarchy[2]?.level==3"><strong>Office:</strong><a href=""><span>{{data.organizationHierarchy[2].name}}</span></a></li>
        </ul>
        <!--History section to be displayed only for historical records-->
        <div *ngIf="data.isActive==false">
        <strong class=usa-external_link (click)="toggleHistory()">History</strong>
        <div *ngIf="toggleField">
        <ul>
          <li *ngFor="let item of history" class="current">
            <span>  
            <strong>{{item.createdDate | date:"yyyy"}}</strong>: <span>{{item.body}}</span>
            </span>
          </li>
        </ul>
        </div>
        </div>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
          <li><strong>Date Published</strong>
            <ul class="usa-unstyled-list">
              <li>{{data.publishDate}}</li>
            </ul>
          </li>
          <li *ngIf="data.isActive==true"><strong>Type</strong>
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
    this.history = this.data.historicalIndex;
  }

  toggleHistory() {
    this.toggleField = !this.toggleField;
  }

}
