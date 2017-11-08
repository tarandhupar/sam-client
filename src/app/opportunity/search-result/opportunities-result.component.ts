import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'opportunities-result',
  template: `
    <div class="sam-ui grid">
      <div class="row">
        <div class="eight wide column">
          <h3 class="opportunity-title">
            <a [routerLink]="['/opportunities', data._id]" [queryParams]="qParams">
              {{ data.title }}
            </a>
          </h3>
          <p *ngIf="latestDescription!=null">
            <span [innerHTML]="latestDescription.content | slice:0:150"></span>...
          </p>
          <ul class="sam-ui small list">
            <li *ngIf="data.type?.value == 'Award Notice'">
            <strong>Awardee</strong><br>
            <span>{{data.award?.awardee?.name}} <span *ngIf="data.award?.awardee?.duns!=null && data.award?.awardee?.duns?.length > 0">({{data.award?.awardee?.duns}})</span></span>
            </li>
            <li *ngIf="data.organizationHierarchy!=null">
              <strong>Department/Ind. Agency</strong><br>
              <a *ngIf="data.isActive==true && data.organizationHierarchy[0]?.organizationId?.length < 12" [routerLink]="['/organization', data.organizationHierarchy[0].organizationId]" [queryParams]="qParams">
                {{data.organizationHierarchy[0]?.name}}
              </a>
              <span *ngIf="data.organizationHierarchy[0]?.organizationId?.length >= 12">
                {{data.organizationHierarchy[0]?.name}}
              </span>
            </li>
            <li *ngIf="data.organizationHierarchy!=null">
              <strong>Sub-tier</strong><br>
              <a *ngIf="data.isActive==true && data.organizationHierarchy[1]?.organizationId?.length < 12" [routerLink]="['/organization', data.organizationHierarchy[1].organizationId]" [queryParams]="qParams">
                {{data.organizationHierarchy[1]?.name}}
              </a>
              <span *ngIf="data.organizationHierarchy[1]?.organizationId?.length >= 12">
                {{data.organizationHierarchy[1]?.name}}
              </span>
            </li>
            <li *ngIf="data.organizationHierarchy!=null">
              <strong>Office</strong><br>
              {{ data.organizationHierarchy[2]?.name }}
            </li>
          </ul>
        </div>
        <div class="four wide column">
          <ul class="sam-ui small list">
            <li *ngIf="data.isActive==false" class="item">
              <span class="sam-ui mini label">
                Archived
              </span>
            </li>
            <li class="item">
              <span class="sam-ui mini label">
                Contract Opportunities
              </span>
            </li>
            <li class="item">
              <strong *ngIf="data.originalType?.code === 'k' || data.type?.code === 'k'">Solicitation Number</strong>
              <strong *ngIf="data.originalType?.code !== 'k' && data.type?.code !== 'k'">Notice Number</strong>
              <br>
              {{ data.solicitationNumber }}
            </li>
            <li *ngIf="data.responseDate" class="item current-response-date">
              <strong>Current Response Date</strong><br>
              {{ data.responseDate | date }}
            </li>
            <li *ngIf="data.modifiedDate" class="item last-modified-date">
              <strong>Last Modified Date</strong><br>
              {{ data.modifiedDate | date }} <a *ngIf="data.modifications?.count > 0" [routerLink]="['/opportunities', data._id]" [queryParams]="qParams" fragment="{{oppHistoryFragment}}">({{ data.modifications?.count}})</a>
            </li>
            <li *ngIf="data.publishDate" class="item last-published-date">
              <strong>Last Published Date</strong><br>
              {{ data.publishDate | date }}
            </li>
            <li class="item opportunity-type">
              <strong>Type</strong><br>
              <ng-container *ngIf="data.type?.code !== 'm'">Original {{data.type?.value}}</ng-container>
              <ng-container *ngIf="data.type?.code === 'm'">
                <ng-container *ngIf="data.isCanceled">Canceled </ng-container>
                <ng-container *ngIf="!data.isCanceled">Updated </ng-container>
                {{data.originalType?.value}}
              </ng-container>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class OpportunitiesResult implements OnInit{
  @Input() data: any;
  @Input() qParams:any = {};
  latestDescription: string;
  oppHistoryFragment: string = 'opportunity-history';
  constructor() {}

  ngOnInit(){
    if(this.data.publishDate){
      this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
    }
    if(this.data.responseDate){
      this.data.responseDate = moment(this.data.responseDate).format("MMM D, Y");
    }
    if(this.data.modifiedDate){
      this.data.modifiedDate = moment(this.data.modifiedDate).format("MMM D, Y");
    }

    if (this.data.descriptions) {
      let sorted = this.data.descriptions.sort((d1, d2) => {
        if (d1['lastModifiedDate'] > d2['lastModifiedDate']) {
          return -1;
        }

        if (d1['lastModifiedDate'] < d2['lastModifiedDate']) {
          return 1;
        }

        return 0
      });

      this.latestDescription = sorted[0];
    }
  }
}
