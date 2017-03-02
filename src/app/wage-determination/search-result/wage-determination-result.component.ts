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

    	<!--Commented out until Sprint 2 when DBA View Page is introduced-->
      	<!--<span>{{ data._type=='SCA' ? 'SCA Wage Determination #: ' : 'DBA Wage Determination #: ' }}</span><a>{{ data.fullReferenceNumber }}</a>-->
      	<span *ngIf = "data._type=='wdSCA'">SCA Wage Determination #: </span><a *ngIf = "data._type=='wdSCA'" [routerLink]="['/wage-determination', data.fullReferenceNumber, data.revisionNumber]" [queryParams]="qParams">{{ data.fullReferenceNumber }}</a>
      	<span *ngIf = "data._type=='wdDBRA'">DBA Wage Determination #: </span><a *ngIf = "data._type=='wdDBRA'" >{{ data.fullReferenceNumber }}</a>


    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul *ngFor="let location of data.locations; let i=index" class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li><strong>State: </strong>
        	  <span>{{ location.state?.name }}</span>
        	</li>
        	<li class="break-word"><strong>County/ies: </strong>
            <ng-container *ngFor="let county of location.counties; let isLast=last">
              {{county}}{{ isLast ? '' : ', '}}
            </ng-container>
        	</li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
      	  <li>
            <strong>Revision #</strong><br>
      	    {{ data.revisionNumber }}
          </li>
          <li *ngIf="data._type=='wdSCA'">
            <strong>Service</strong><br>
            <span *ngFor="let service of data.services; let isLast=last">
              {{ service.value }}{{ isLast ? '' : ', ' }}
            </span>
          </li>
          <li *ngIf="data._type=='wdDBRA'">
            <strong>Construction Type</strong><br>
            {{ data.constructionTypes }}
          </li>
          <li>
            <ng-container *ngIf="data._type=='wdDBRA'">
              <strong>{{ data.revisionNumber>0 ? 'Last Revised Date' : 'Publish Date' }}</strong>
            </ng-container>
            <ng-container *ngIf="data._type=='wdSCA'">
              <strong>{{ data.revisionNumber>1 ? 'Last Revised Date' : 'Publish Date' }}</strong>
            </ng-container>
            <br>{{ data.publishDate }}
          </li>
        </ul>
      </div>
      `
})
export class WageDeterminationResult implements OnInit {
  @Input() data: any={};
  @Input() qParams: any={};
  constructor() { }

  ngOnInit(){
    if(this.data.publishDate!==null) {
    this.data.publishDate = moment(this.data.publishDate).format("MMM D, Y");
    }
    if(this.data.locations!==null) {
      for(var i=0; i<this.data.locations.length; i++) {
        if(this.data.locations[i].counties != null) {
          this.data.locations[i].counties = this.data.locations[i].counties.sort();
        }
      }
    }
  }

}
