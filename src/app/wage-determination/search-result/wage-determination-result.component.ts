import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import {SortArrayOfObjects} from "../../app-pipes/sort-array-object.pipe";


@Component({
  moduleId: __filename,
  selector: 'wage-determination-result',
  template: `
  	<div class="sam-ui grid">
  	  <div class="row">
  	    <div class="eight wide column">
          <h3 class="wage-determination-number">
            <span>{{ data._type=='wdSCA' ? 'SCA Wage Determination #: ' : 'DBA Wage Determination #: ' }}</span>
            <a [routerLink]="['/wage-determination', data.fullReferenceNumber, data.revisionNumber]" [queryParams]="qParams" >
              {{ data.fullReferenceNumber }}
            </a>
          </h3>
          
          <ng-container *ngIf="data.location?.additionalInfo?.content==null && data.location?.states!=null">
            <ul *ngFor="let state of data.location?.states; let i=index" class="sam-ui small list">
              <li [attr.id]="'wd-state-' + i">
                <strong>State </strong><br>
                <span>{{ state?.name }}</span>
              </li>
              <li [attr.id]="'wd-counties-' + i" *ngIf="state.isStateWide==false">
                <strong>County/ies </strong><br>
                <ng-container *ngFor="let county of state.counties?.include; let isLast=last">
                  {{county?.value}}{{ isLast ? '' : ', '}}
                </ng-container>
              </li>
              <li [attr.id]="'wd-counties-' + i" *ngIf="state.isStateWide==true">
                <strong>County/ies </strong><br>
                Statewide {{state.counties?.exclude?.length>0 ? 'Except' : ''}}
                <ng-container *ngFor="let county of state.counties?.exclude; let isLast=last">
                  {{county?.value}}{{ isLast ? '' : ', '}}
                </ng-container>
              </li>
            </ul>
          </ng-container>
          
          <ul *ngIf="data.location?.additionalInfo?.content!=null" class="sam-ui small list">
            <li [attr.id]="'wd-description-' + i">
              <strong>Location Description </strong><br>
              <span>{{ data.location?.additionalInfo?.content }}</span>
            </li>
          </ul>

          <ul *ngIf="data.location?.state!=null" class="sam-ui small list" >
            <li class="wd-state-0">
              <strong>State </strong><br>
              <span>{{ data.location?.state?.name }}</span>
            </li>
            <li class="wd-counties-0 break-word">
              <strong>County/ies </strong><br>
              <ng-container *ngFor="let county of data.location?.state?.counties; let isLast=last">
                <span>{{county?.value}}{{ isLast ? '' : ', '}}</span>
              </ng-container>
            </li>
          </ul>
  	    </div>
  	    <div class="four wide column">
          <ul class="sam-ui small list">
            <li>
              <span *ngIf="data.isActive==false" class="sam-ui mini label">
                Inactive
              </span>
            </li>
            <li>
              <span class="sam-ui mini label">
                {{ data._type=='wdSCA' ? 'SCA Wage Determination' : 'DBA Wage Determination' }}
              </span>
            </li>
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
  	  </div>
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
            this.data.location.states[i].counties.include = new SortArrayOfObjects().transform(this.data.location.states[i].counties.include, 'value');
          }
          if (this.data.location.states[i].counties && this.data.location.states[i].counties.exclude !== null) {
            this.data.location.states[i].counties.exclude = new SortArrayOfObjects().transform(this.data.location.states[i].counties.exclude, 'value');
          }
        }
      }
      if (this.data.location.state && this.data.location.state.counties && this.data.location.state.counties !== null) {
        this.data.location.state.counties = new SortArrayOfObjects().transform(this.data.location.state.counties, 'value');
      }
    }
    }
}
