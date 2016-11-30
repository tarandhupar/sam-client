import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  moduleId: __filename,
  selector: 'wage-determination-result',
  template: `
      <p>
    	  <span class="usa-label">Wage Determination</span>
    	  <span *ngIf=false class="usa-label">ARCHIVED</span>
    	</p>
    	<h3 class="wage-determination-number">
      	<a [routerLink]="[]">{{ data.fullReferenceNumber }}</a>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li>
        	  <strong>Revision: </strong>
        	  <span>{{ data.revisionNumber }}</span>
        	</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
          <li *ngIf="data.services"><strong>Services: </strong><span>{{ data.services }}</span></li>
          <li *ngIf="data.constructionTypes"><strong>Construction Types: </strong><span>{{ data.code }}</span></li>
        </ul>
      </div>
  `,
  styleUrls: []
})
export class WageDeterminationResult implements OnInit {
  @Input() data: any={};
  constructor() { }

  ngOnInit(){ }

}
