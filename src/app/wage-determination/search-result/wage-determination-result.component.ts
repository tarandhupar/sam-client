import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';


@Component({
  moduleId: __filename,
  selector: 'wage-determination-result',
  template: `
      <p>
    	  <span class="usa-label">{{ data._type=='wdSCA' ? 'SCA WAGE DETERMINATION' : 'DBA WAGE DETERMINATION' }}</span>
    	  <span *ngIf="data.isActive==false" class="usa-label">Inactive</span>
    	</p>
    	<h3 class="wage-determination-number">
      	<span>{{ data._type=='wdSCA' ? 'SCA Wage Determination #: ' : 'DBA Wage Determination #: ' }}</span><a [routerLink]="['/wage-determination', data.fullReferenceNumber, data.revisionNumber]" [queryParams]="qParams" >{{ data.fullReferenceNumber }}</a>
    	</h3>
    	<div class="usa-width-two-thirds">
    	  <span *ngIf="data.location==null">&nbsp;</span>
    	  <div *ngIf="data.location?.additionalInfo?.content==null && data.location?.states!=null">
      	<ul *ngFor="let state of data.location?.states; let i=index" class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li [attr.id]="'wd-state-' + i"><strong>State: </strong>
        	  <span>{{ state?.name }}</span>
        	</li>
        	<li [attr.id]="'wd-counties-' + i" *ngIf="state.isStateWide==false" class="break-word"><strong>County/ies: </strong>
            <ng-container *ngFor="let county of state.counties?.include; let isLast=last">
              {{county?.value}}{{ isLast ? '' : ', '}}
            </ng-container>
        	</li>
        	<li [attr.id]="'wd-counties-' + i" *ngIf="state.isStateWide==true" class="break-word"><strong>County/ies: </strong>
        	  Statewide {{state.counties?.exclude?.length>0 ? 'Except' : ''}}
            <ng-container *ngFor="let county of state.counties?.exclude; let isLast=last">
              {{county?.value}}{{ isLast ? '' : ', '}}
            </ng-container>
        	</li>
        </ul>
        </div>
        <div *ngIf="data.location?.additionalInfo?.content!=null">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li [attr.id]="'wd-description-' + i"><strong>Location Description: </strong>
        	  <span>{{ data.location?.additionalInfo?.content }}</span>
        	</li>
        </ul>
        </div>
        <div *ngIf="data.location?.state!=null">
        <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li class="wd-state-0"><strong>State: </strong>
        	  <span>{{ data.location?.state?.name }}</span>
        	</li>
        	<li class="wd-counties-0 break-word"><strong>County/ies: </strong>
            <ng-container *ngFor="let county of data.location?.state?.counties; let isLast=last">
              <span>{{county?.value}}{{ isLast ? '' : ', '}}</span>
            </ng-container>
        	</li>
        </ul>
        </div>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
      	  <li class="wd-revision-number">
            <strong>Revision #</strong><br>
      	    <span>{{ data.revisionNumber }}</span>
          </li>
          <li  class="wd-services" *ngIf="data._type=='wdSCA'">
            <strong>Service</strong><br>
            <span *ngFor="let service of data.services; let isLast=last">
              {{ service.value }}{{ isLast ? '' : ', ' }}
            </span>
          </li>
          <li class="wd-construction-types" *ngIf="data._type=='wdDBRA'">
            <strong>Construction Type</strong><br>
            <span>{{ data.constructionTypes }}</span>
          </li>
          <li class="wd-date">
            <ng-container *ngIf="data._type=='wdDBRA'">
              <strong>{{ data.revisionNumber>0 ? 'Last Revised Date' : 'Published Date' }}</strong>
            </ng-container>
            <ng-container *ngIf="data._type=='wdSCA'">
              <strong>{{ data.revisionNumber>1 ? 'Last Revised Date' : 'Published Date' }}</strong>
            </ng-container>
            <br><span>{{ data.publishDate }}</span>
          </li>
        </ul>
      </div>
      `
})
export class WageDeterminationResult implements OnInit {
  @Input() data: any={};
  @Input() qParams: any={};
  constructor() { }

  ngOnInit(){
    if(this.data.publishDate!==null) {
    this.data.publishDate = moment(this.data.publishDate).format("MMM DD, YYYY");
    }
    if(this.data.location!==null) {
      if (this.data.location.states && this.data.location.states !== null) {
        for (var i = 0; i < this.data.location.states.length; i++) {
          if (this.data.location.states[i].counties && this.data.location.states[i].counties.include !== null) {
            this.data.location.states[i].counties.include = this.sortCounties(this.data.location.states[i].counties.include);
          }
          if (this.data.location.states[i].counties && this.data.location.states[i].counties.exclude !== null) {
            this.data.location.states[i].counties.exclude = this.sortCounties(this.data.location.states[i].counties.exclude);
          }
        }
      }
      if (this.data.location.state && this.data.location.state.counties && this.data.location.state.counties !== null) {
        this.data.location.state.counties = this.sortCounties(this.data.location.state.counties);
      }
    }
    }

  sortCounties(countiesArray) {
    return countiesArray.sort(function (a, b) {
      var nameA = a.value.toUpperCase(); // ignore upper and lowercase
      var nameB = b.value.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  }
}
