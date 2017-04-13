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
            <a [routerLink]="['/opportunities', data._id]" [queryParams]="qParams">{{ data.title }}</a>
          </h3>
          
          <p *ngIf="data.description!=null && data.description.length>150">
            <span [innerHTML]="data.description | slice:0:150"></span>...
          </p>
          
          <p *ngIf="data.description!=null && data.description.length<150">
            <span [innerHTML]="data.description"></span>
          </p>
          
          <ul class="sam-ui small list">
            <li *ngIf="data.organizationHierarchy!=null">
              <strong>Department/Ind. Agency</strong><br>
              <a *ngIf="data.isActive==true && data.organizationHierarchy[0].organizationId.length < 12" [routerLink]="['/organization', data.organizationHierarchy[0].organizationId]" [queryParams]="qParams">
                {{data.organizationHierarchy[0].name}}
              </a>
              <span *ngIf="data.organizationHierarchy[0].organizationId.length >= 12">
                {{data.organizationHierarchy[0].name}}
              </span>
            </li>
            <li *ngIf="data.organizationHierarchy!=null">
              <strong>Sub-tier</strong><br>
              {{ data.organizationHierarchy[1].name }}
            </li>
            <li *ngIf="data.organizationHierarchy!=null">
              <strong>Office</strong><br>
              {{ data.organizationHierarchy[2].name }}
            </li>
          </ul>  
        </div>
        <div class="four wide column">    
          <ul class="sam-ui small list">
            <li *ngIf="data.isActive==false" >
              <span class="sam-ui mini label">Archived</span>
            </li>
            <li>
              <span class="sam-ui mini label">Opportunity</span>
            </li>
            <li>
              <strong>Solicitation Number</strong><br>
              {{ data.solicitationNumber }}
            </li>
            <li>
              <strong>Posted Date</strong><br>
              {{ data.publishDate  }}
            </li>
            <li>
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
  constructor() {}

  ngOnInit(){
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
  }
}
