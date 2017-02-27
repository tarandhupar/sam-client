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
      	<a [routerLink]="['/organization', data._id]" [queryParams]="qParams">{{ data.name }}</a>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<p class="m_T-2x" *ngIf="data.description !== null && data.description.length>150" >
          <span [innerHTML]="data.description | slice:0:150"></span>...
        </p>
        <p class="m_T-2x" *ngIf="data.description!=null && data.description.length<150">
          <span [innerHTML]="data.description"></span>
        </p>
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.parentOrganizationHierarchy && data.parentOrganizationHierarchy !== null">
        	  <strong>Department: </strong>
        	  <span>{{ data.parentOrganizationHierarchy.name }}</span>
        	</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
        	<li>
        	  <span><strong>{{ data.type=="Agency" ? 'Sub-Tier' : data.type }}</strong></span>
          </li>
          <li *ngIf="data.alternativeNames && data.alternativeNames !== null"><strong>Also Known As</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.alternativeNames }}</span></li>
            </ul>  
          </li>
          <li>
            <strong>{{(data | organizationTypeCode).label}}</strong> {{(data | organizationTypeCode).value}}
          </li>    
        </ul>
      </div>
  `
})
export class FederalHierarchyResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  constructor() { }

  ngOnInit(){}

}
