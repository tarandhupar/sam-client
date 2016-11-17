import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  moduleId: __filename,
  selector: 'federal-hierarchy-result',
  template: `
      <p>
    	  <span class="usa-label">Federal Hierarchy</span>
    	  <span *ngIf=false class="usa-label">ARCHIVED</span>
    	</p>
    	<h3 class="federal-hierarchy-title">
      	<a *ngIf=true>{{ data.name }}</a>
      	<span *ngIf=false>{{ data.name }}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<p class="m_T-2x">
          {{ data.description && data.description !== null ? 'data.description' : '' }}
        </p>
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li><strong>Department:</strong><span>Department Field.</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
        	<li><strong>Location Level</strong></li>
          <li><strong>Also Known As: </strong><span>{{ data.shortName && data.shortName !== null ? 'data.shortName' : '' }}</span></li>
          <li><strong>Code: </strong><span>{{ data.code }}</span></li>
        </ul>
      </div>
  `,
  styleUrls: []
})
export class FederalHierarchyResult implements OnInit {
  @Input() data: any={};
  constructor() { }

  ngOnInit(){ }

  // printFALLink(){
  //   return this.data.hasOwnProperty('_links') ? _.get(this.data, ['_links','self','href']):'';
  // }
}
