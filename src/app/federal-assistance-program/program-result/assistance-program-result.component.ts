import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'assistance-program-result',
  template: `<div>
  <span class="usa-label">Federal Assistance Listing</span>
      <span class="usa-label" [ngStyle]="{display:showHideStatusText}"  [style.background-color]="randomColor">{{data.status.value}}</span>
  </div>
  
  <h3 class="assistance-program-title">
    <span>{{data.data.title}}</span>
  </h3> 
  <div class="usa-grid-full">
    <div class="usa-width-one-half">
      <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x"> 
     <li>
        <strong>Date Modified: </strong><span>{{data.modifiedDate}}</span>
      </li>
        <li>
        <strong>Office: </strong><span>{{data.data.organizationId}}</span>
      </li>
      </ul>
    </div>
    <div class="usa-width-one-half">
       <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x"> 
     
      <li>
        <div><strong>CFDA #: </strong></div>
        <span class="fal-program-number">{{data.data.programNumber}}</span>
      </li>
      <li>
        <div><strong>Date Published: </strong></div>
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
  statusCodeBgColorArray = [
    'red',
    'green',
    'blue',
    'orange',
  ];

  constructor() {
  }

  ngOnInit() {
    this.data.publishedDate = moment(this.data.publishedDate).format("MMM D, Y H:mm a");
    this.data.modifiedDate = moment(this.data.modifiedDate).format("MMM D, Y H:mm a");
    if (this.data.status.code !== 'published') {
      this.showhideStatus = true;
    }
    this.showHideStatusText = this.showhideStatus ? "inline" : "none";
    this.toggleBgColor();
  }

  toggleBgColor() {
    if (this.data.status.code == 'rejected') {
      this.randomColor = this.statusCodeBgColorArray[0];
    } else if (this.data.status.code == 'draft') {
      this.randomColor = this.statusCodeBgColorArray[1];
    } else if (this.data.status.code == 'pending') {
      this.randomColor = this.statusCodeBgColorArray[2];
    } else if (this.data.status.code == 'received') {
      this.randomColor = this.statusCodeBgColorArray[3];
    }
  }
}

