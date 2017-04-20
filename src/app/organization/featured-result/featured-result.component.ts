import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import {FHService} from "../../../api-kit/fh/fh.service";
import { ReplaySubject } from 'rxjs';

@Component({
  moduleId: __filename,
  selector: 'fh-featured-result',
  template: `
    <div class="featured-result">
      <div class="card">
        <div class="card-header-secure">
          <h3>
            <a [routerLink]="['/organization', data._id]" [queryParams]="qParams">{{ data.name }}</a>
          </h3>
          <ng-container *ngIf="data.alternativeNames && data.alternativeNames !== null">
              Also known as <strong><em>{{ data.alternativeNames }}</em></strong>
          </ng-container>
        </div>
        <div class="card-secure-content clearfix">
          <div *ngIf="errorOrganization || logoUrl===null" class="logo-small"  style="float: left; margin-right: 10px;">
            <img src="src/assets/img/logo-not-available.png" alt="Logo Not Available">
          </div>
          <div *ngIf="logoUrl && !errorOrganization" class="logo-small"  style="float: left; margin-right: 10px;">
            <img [src]="logoUrl" [alt]="logoInfo" [title]="logoInfo">
          </div>
          <div>
            <ul class="usa-unstyled-list">
              <li>
                {{ data.type=="Agency" ? 'Sub-Tier' : '' }}{{ data.type=="Department" ? 'Department/Ind. Agency' : '' }}{{ data.type!=="Agency"&&data.type!=="Department" ? data.type : '' }}
              </li>
              <li>
                <strong>CGAC: </strong> {{ data.cgac }}
              </li>
              <li *ngIf="department">
                Department/Ind. Agency: {{ department.name }}
              </li>
              <li>
                <a href="/search?keyword={{qParams.keyword}}&index=fpds&page=1&organizationId={{data._id}}" target="_blank">View Awards contracted by this federal organization</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-extra-content">
          <i class="fa fa-star" aria-hidden="true" style="color:#fdb81e;"></i> <strong>Featured Result</strong>
        </div>
      </div>
    </div>
  `
})
export class FHFeaturedResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  public logoUrl: string;
  public logoInfo: any;
  errorOrganization: any;
  department: {};

  constructor(private fhService: FHService) { }

  ngOnInit() {
    if (this.data.organizationHierarchy && this.data.organizationHierarchy.length > 1) {
      for (let o of this.data.organizationHierarchy) {
        if (o.level == 1) {
          this.department = o;
          break;
        }
      }
    }
  }

  ngOnChanges(changes) {
    if(this.data['_id']) {
    this.callOrganizationById(this.data['_id']);
    }
  }

  private callOrganizationById(orgId: string) {
    let organizationSubject = new ReplaySubject(1);
    this.fhService.getOrganizationById(orgId, true).subscribe(organizationSubject);
    this.fhService.getOrganizationLogo(organizationSubject,
    (logoData) => {
      if (logoData != null) {
        this.logoUrl = logoData.logo;
        this.logoInfo = logoData.info;
      } else {
        this.errorOrganization = true;
      }
    }, (err) => {
      this.errorOrganization = true;
    });
  }

  isEmptyObject(obj) {
    return (Object.keys(obj).length === 0);
  }

}
