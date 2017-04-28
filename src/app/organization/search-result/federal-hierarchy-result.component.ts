import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  moduleId: __filename,
  selector: 'federal-hierarchy-result',
  template: `    	
  	<div class="sam-ui grid">
  	  <div class="row">
  	    <div class="eight wide column">
          <h3 class="federal-hierarchy-title">
            <a [routerLink]="['/organization', data._id]" [queryParams]="qParams">
              {{ data.name }}
            </a>
          </h3>
          <p *ngIf="data.description !== null && data.description.length>150" >
            <span [innerHTML]="data.description | slice:0:150"></span>...
          </p>
          <p *ngIf="data.description!=null && data.description.length<150">
            <span [innerHTML]="data.description"></span>
          </p>
          <ul class="sam-ui small list">
            <li *ngIf="data.type=='Agency'">
              <strong>Department </strong><br>
              <span>{{ data.organizationHierarchy[0].name }}</span>
            </li>
          </ul>
  	    </div>
  	    <div class="four wide column">
          <ul class="sam-ui small list">
            <li>
              <span *ngIf=false class="sam-ui mini label">Archived</span>
            </li>
            <li>
              <span class="sam-ui mini label">Federal Hierarchy</span>
            </li>
            <li>
              <strong>{{ data.type=="Agency" ? 'Sub-Tier' : data.type }}</strong>
            </li>
            <li *ngIf="data.alternativeNames && data.alternativeNames !== null">
              <strong>Also Known As</strong><br>
              {{ data.alternativeNames }}
            </li>
            <li>
              <strong>CGAC</strong><br>
              {{ data.cgac }}
            </li>    
          </ul>
        </div>
  	  </div>
  	</div>
  `
})
export class FederalHierarchyResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  constructor() { }

  ngOnInit(){}

}
