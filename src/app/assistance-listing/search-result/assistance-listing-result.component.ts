import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'assistance-listing-result',
  template: `
  	<div class="sam-ui grid">
  	  <div class="row">
  	    <div class="eight wide column">
        
          <h3 class="assistance-listing-title">
            <a *ngIf="data.isActive==true" [routerLink]="['/programs', data._id, 'view']" [queryParams]="qParams">
              {{data.title}}
            </a>
            <span *ngIf="data.isActive==false">
              {{data.title}}
            </span>
          </h3>
          
          <p *ngIf="data.isActive==true">
            {{data.objective | slice:0:150}}{{data.objective && data.objective.length > 150 ? '...' : ''}}
          </p>
          
          <ul class="sam-ui small list">
            <li *ngIf="data.organizationHierarchy && data.organizationHierarchy[0]?.level==1">
              <strong>Department/Ind. Agency</strong><br>
              <a *ngIf="data.isActive==true" [routerLink]="['/organization', data.organizationHierarchy[0].organizationId]" [queryParams]="qParams">
                {{data.organizationHierarchy[0].name}}
              </a>
              <span *ngIf="data.isActive==false">
                {{data.organizationHierarchy[0].name}}
              </span>
            </li>
            <li *ngIf="data.organizationHierarchy && data.organizationHierarchy[2]?.level==3">
              <strong>Office</strong><br>
              <span>{{data.organizationHierarchy[2].name}}</span>
            </li>
          </ul>
          
          <!--History section to be displayed only for historical records-->
          <div *ngIf="data.isActive==false">
            <h4 tabindex="0" (keyup.enter)="toggleHistory()" (click)="toggleHistory()" class="collapsible" [class.expanded]="toggleField"><span class="history">History</span></h4>
            <div *ngIf="toggleField">
              <sam-history [data]="history"></sam-history>
            </div>
          </div>
  	            
  	    </div>
  	    <div class="four wide column">
        
          <ul class="sam-ui small list">
            <li *ngIf="data.isActive==false" class="item">
              <span class="sam-ui mini label">
                Historical
              </span>
            </li>
            <li class="item">
              <span class="sam-ui mini label">
                Federal Assistance Listing
              </span>
            </li>
            <li class="item">
              <strong>CFDA Number</strong><br>
              <span class="fal-program-number">
                {{data.programNumber}}
              </span>
            </li>
            <li class="item">
              <strong>Funded</strong><br>
              <ng-container *ngIf="data.isFunded">Yes</ng-container>
              <ng-container *ngIf="!data.isFunded">No</ng-container>
            </li>
            <li class="item">
              <strong>Last Date Modified</strong><br>
              {{data.publishDate}}
            </li>
            <li class="item" *ngIf="data.isActive==true">
              <strong>Type Of Assistance</strong><br>
              <ng-container *ngFor="let assistanceTypes of data.assistanceTypes; let i=index">
                <strong>{{ assistanceTypes.code }}</strong> {{ assistanceTypes.code!==null ? '-' : '' }} {{ assistanceTypes.value }}{{ assistanceTypes.value!==null && i!==data.assistanceTypes.length-1 ? ',' : '' }}
              </ng-container>
            </li>
          </ul>
          
        </div>
  	  </div>
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