import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'assistance-program-result',
  template: `<p>
  <span class="usa-label">Federal Assistance Listing</span>
      <span class="usa-label toggleStatusCode" [ngStyle]="{display:showHideStatusText}"  [style.background-color]="randomColor">{{data.status.value}}</span>
  </p>
  
  <h3 class="assistance-program-title">
    <a [routerLink]="['/programs', data.id, 'edit']">{{data.data.title}}</a>
  </h3> 
  <div class="usa-grid-full">
    <div class="usa-width-two-thirds">
      <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x"> 
     <li>
        <strong>Date Modified: </strong><span>{{data.modifiedDate}}</span>
      </li>
        <li>
        <strong>Office: </strong><span>{{data.data.organizationId}}</span>
      </li>
      </ul>
    </div>
    <div class="usa-width-one-third">
       <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x"> 
     
      <li>
        <strong>CFDA #: </strong>
        <span class="fal-program-number">{{data.data.programNumber}}</span>
      </li>
      <li>
        <strong>Date Published: </strong>
        <span>{{data.publishedDate}}</span>
      </li>
  </ul>
    </div>
  </div>

`
})
export class AssistanceProgramResult implements OnInit {
  @Input() data: any = {};
  @Input() qParams: any = {};
  showhideStatus: boolean;
  showHideStatusText: string;
  randomColor: string;
  statusCodeBgColor = [
    '#2e8540',
    '#cd2026',
    '#aeb0b5'
  ];

  constructor() {

  }

  ngOnInit() {
    if (this.data.publishedDate !== null) {
      this.data.publishedDate = moment(this.data.publishedDate).format("MMM D, Y H:mm a");
    }
    if (this.data.modifiedDate !== null) {
      this.data.modifiedDate = moment(this.data.modifiedDate).format("MMM D, Y H:mm a");
    }
    if (this.data.status.code !== 'published') {
      this.showhideStatus = true;
    }
    this.showHideStatusText = this.showhideStatus ? "inline" : "none";
    this.toggleBgColor();
  }

  toggleBgColor() {
    if (this.data.status !== null && (typeof this.data.status.code !== 'undefined' && this.data.status.code !== null)) {
      if (this.data.status.code === 'draft' || this.data.status.code === 'revised') {
        this.randomColor = this.statusCodeBgColor[0];
      } else if (this.data.status.code === 'rejected') {
        this.randomColor = this.statusCodeBgColor[1];
      } else if (this.data.status.code === 'pending') {
        this.randomColor = this.statusCodeBgColor[2];
      }
    }
  }
}

