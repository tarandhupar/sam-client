import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import {FHService} from "../../../api-kit/fh/fh.service";
import { ReplaySubject, Observable } from 'rxjs';

@Component({
  moduleId: __filename,
  selector: 'fh-featured-result',
  template: `
    <div class="sam-ui vertically very padded grid">

      <div class="column">
        <div class="sam-ui raised segment">
          
          <div class="sam-ui top right attached mini label">
          <i class="fa fa-star" aria-hidden="true"></i>
            Featured Result
          </div>
          
          <div class="sam-ui attached grid">
            <div class="row">
              <div class="two wide column">
                <div *ngIf="errorOrganization || logoUrl===null">
                  <img class="sam-ui image" src="src/assets/img/logo-not-available.png" alt="Logo Not Available">
                </div>
                <div *ngIf="logoUrl && !errorOrganization">
                  <img class="sam-ui image" [src]="logoUrl" [alt]="logoInfo" [title]="logoInfo">
                </div>
              </div>
              <div class="ten wide column">  
                <h3 class="sam-ui sub header">
                  <a [routerLink]="['/organization', data._id]" [queryParams]="qParams">
                    {{ data.name }}
                  </a>
                </h3>
                <ng-container *ngIf="data.alternativeNames && data.alternativeNames !== null">
                    Also known as <strong><em>{{ data.alternativeNames }}</em></strong>
                </ng-container><br>
                <ul class="sam-ui horizontal divided small list">
                  <li class="item">
                    <strong>
                    {{ data.type=="Agency" ? 'Sub-Tier' : '' }}
                    {{ data.type=="Department" ? 'Department/Ind. Agency' : '' }}
                    {{ data.type!=="Agency"&&data.type!=="Department" ? data.type : '' }}
                    </strong>
                  </li>
                  <li class="item" *ngIf="data">
                    <strong>{{(data | organizationTypeCode).label}}</strong> {{(data | organizationTypeCode).value}}
                  </li>  
                </ul><br>
                <div *ngIf="data.parentOrganizationHierarchy && data.parentOrganizationHierarchy !== null">
                  Department/Ind. Agency: {{ data.parentOrganizationHierarchy.name }}
                </div>
              </div>
            </div>
          </div>
        
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
  constructor(private fhService: FHService) { }

  ngOnInit() {}

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
