import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import {FHService} from "../../../api-kit/fh/fh.service";
import { ReplaySubject, Observable } from 'rxjs';

@Component({
  moduleId: __filename,
  selector: 'fh-featured-result',
  template: `
    	<h4 class="featured-result-title">
      	<a [routerLink]="['/organization', data._id]">{{ data.name }}</a>
    	</h4>
    	 <!--Logo-->
      <ng-container *ngIf="logoUrl">
        <img class="logo-small" [src]="logoUrl" alt="HTML5 Icon">
      </ng-container>
    	<div>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.parentOrganizationHierarchy && data.parentOrganizationHierarchy !== null">
        	  <strong>Department: </strong>
        	  <span>{{ data.name }}</span>
        	</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-unstyled-list usa-text-small m_B-0">
        	<li><strong>{{ data.type=="Agency" ? 'Sub-Tier' : data.type }}</strong></li>
          <li *ngIf="data.alternativeNames && data.alternativeNames !== null">
            <strong>Also Known As: </strong>
            <span>{{ data.alternativeNames }}</span>
          </li>
          <li>
            <strong>Code: </strong>
            <span>{{ data.code }}</span>
          </li>    
        </ul>
      </div>
      </div>
      <h4 class="featured-result-title">
      <span class="">Featured Result</span>
      </h4>
  `
})
export class FHFeaturedResult implements OnInit {
  @Input() data: any={};
  logoUrl: string;
  constructor(private fhService: FHService) { }

  ngOnInit() {}

  ngOnChanges(changes) {
    if(this.data['_id']) {
    this.callOrganizationById(this.data['_id']);
    }
  }

  private callOrganizationById(orgId: string) {
    let organizationSubject = new ReplaySubject(1);
    this.fhService.getOrganizationById(orgId).subscribe(organizationSubject);
      this.loadLogo(organizationSubject);
  }

  private loadLogo(organizationAPI: Observable<any>) {
    organizationAPI.subscribe(org => {
      if(org == null || org['_embedded'] == null || org['_embedded'][0] == null) {
        return;
      }

      if(org['_embedded'][0]['_link'] != null && org['_embedded'][0]['_link']['logo'] != null && org['_embedded'][0]['_link']['logo']['href'] != null) {
        this.logoUrl = org['_embedded'][0]['_link']['logo']['href'];
        return;
      }

      if(org['_embedded'][0]['org'] != null && org['_embedded'][0]['org']['parentOrgKey'] != null) {
        this.loadLogo(this.fhService.getOrganizationById(org['_embedded'][0]['org']['parentOrgKey']));
      }
    }, err => {
      console.log('Error loading logo: ', err);
    });
  }

}
