import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'opportunities-result',
  template: `
    <p>
      <span class="usa-label">Opportunity</span>
      <span *ngIf="data.isActive==false" class="usa-label">ARCHIVED</span>
    </p>
    <h3 class="opportunity-title">
      <a [routerLink]="['/opportunities', data._id]">{{ data.title }}</a>
    </h3>
    <div class="usa-width-two-thirds">
      <p class="m_T-2x" *ngIf="data.description!=null && data.description.length>150">
        <span [innerHTML]="data.description | slice:0:150"></span>...
      </p>
      <p class="m_T-2x" *ngIf="data.description!=null && data.description.length<150">
        <span [innerHTML]="data.description"></span>
      </p>
      <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        <li *ngIf="data.organizationHierarchy!=null"><strong>Department:</strong> <a href="#">{{ data.organizationHierarchy[2].name }}</a></li>
        <li *ngIf="data.organizationHierarchy!=null"><strong>Office:</strong> <a href="#">{{ data.organizationHierarchy[1].name }}</a></li>
        <li *ngIf="data.organizationHierarchy!=null"><strong>Location:</strong> {{ data.organizationHierarchy[0].name }}</li>
      </ul>
    </div>
    <div class="usa-width-one-third">
      <ul class="usa-text-small m_B-0">
        <li>
          <strong>Solicitation Number</strong>
          <ul class="usa-unstyled-list">
            <li class='solicitation-number'>{{ data.solicitationNumber }}</li>
          </ul>
        </li>
          <li>
          <strong>Posted Date</strong>
          <ul class="usa-unstyled-list">
            <li>{{ data.publishDate  }}</li>
          </ul>
        </li>
        <li>
          <strong>Type</strong>
          <ul class="usa-unstyled-list">
            <li>{{data.type?.value}}</li>
          </ul>
        </li>
      </ul>
    </div>
  `,
})
export class OpportunitiesResult implements OnInit{
  @Input() data: any;
  constructor() {}

  ngOnInit(){
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
  }
}
