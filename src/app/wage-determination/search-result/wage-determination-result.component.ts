import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';


@Component({
  moduleId: __filename,
  selector: 'wage-determination-result',
  template: `
      <p>
    	  <span class="usa-label">Wage Determination</span>
    	  <span *ngIf="data.isActive==false" class="usa-label">Inactive</span>
    	</p>
    	<h3 class="wage-determination-number">
      	<span>{{ data._type=='wdSCA' ? 'Service Contract Act WD #: ' : 'Davis-Bacon Act WD #: ' }}</span><a>{{ data.fullReferenceNumber }}</a>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.locations!==null"><strong>State: </strong>
        	  <span *ngIf="data.locations[0].state!==null">{{ data.locations[0].state.name }}</span>
        	  <span *ngIf="data.locations[0].state===null && data.locations[1] && data.locations[1].state!==null">{{ data.locations[1].state.name }}</span>
        	</li>
        	<li *ngIf="data.locations!==null"><strong>Area: </strong>
        	  <span *ngIf="data.locations[0].counties!==null">{{ data.locations[0].counties }}</span>
        	  <span *ngIf="data.locations[0].counties===null && data.locations[1] && data.locations[1].counties!==null">{{ data.locations[1].counties }}</span>
        	</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
          <li *ngIf="data.services"><strong>Services</strong>
            <ul class="usa-unstyled-list">
              <span>{{ data.services }}</span>
            </ul>
          </li>
          <li *ngIf="data.constructionTypes"><strong>Construction Types</strong>
            <ul class="usa-unstyled-list">
              <span>{{ data.constructionTypes }}</span>
            </ul>
          </li>
          <li><strong>Publish Date</strong>
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
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
  }

}
