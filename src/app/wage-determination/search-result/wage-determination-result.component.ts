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
      	<span>Wage Determination #: </span><a>{{ data.fullReferenceNumber }}</a>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.locations!==null"><strong>State: </strong>
        	  <span *ngFor="let location of data.locations; let i=index">{{ location.state?.name }}{{ location.state!==null && i!==data.locations.length-1 ? ',' : '' }}</span>
        	</li>
        	<li *ngIf="data.locations!==null"><strong>County: </strong>
        	  <span *ngFor="let location of data.locations; let i=index">{{ location.counties }}{{ location.counties!==null && i!==data.locations.length-1 ? ',' : '' }}</span>
        	</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
      	  <li><strong>Revision #</strong>
      	    <ul class="usa-unstyled-list">
      	     <span>{{ data.revisionNumber }}</span>
            </ul>
          </li>
          <li *ngIf="data._type=='wdSCA'"><strong>Services</strong>
            <ul class="usa-unstyled-list">
              <span>{{ data.services }}</span>
            </ul>
          </li>
          <li *ngIf="data._type=='wdDBRA'"><strong>Construction Types</strong>
            <ul class="usa-unstyled-list">
              <span>{{ data.constructionTypes }}</span>
            </ul>
          </li>
          <li><strong>Published Date</strong>
            <ul class="usa-unstyled-list">
              <span>{{ data.publishDate }}</span>
            </ul>
          </li>
        </ul>
      </div>
  `,
  styleUrls: []
})
export class WageDeterminationResult implements OnInit {
  @Input() data: any={};
  constructor() { }

  ngOnInit(){
    if(this.data.publishDate!==null) {
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
    }
  }

}
