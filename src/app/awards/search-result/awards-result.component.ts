
import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import Moment = moment.Moment;

@Component({
  moduleId: __filename,
  selector: 'awards-result',
  template: `
      <p>
    	  <span class="usa-label">Award</span>
    	</p>
    	<h3 class="award-title">
    	<a *ngIf="data.isActive==true" [routerLink]="['/awards', data._id]" [queryParams]="qParams">{{ data.identifiers[0]?.piid }}</a>
    	</h3>
    	<ul class="usa-unstyled-list">
    	<li class="modification-number"><strong>Modification: </strong><span>{{ data.identifiers[0]?.modificationNumber }}</span></li>
      </ul>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
      	  <li class="vendor-name"><strong>{{ data.vendor?.name }}</strong></li>
      	  <li class="vendor-address"><span>{{ data.vendor?.address?.city }}, {{ data.vendor?.address?.state?.code }} {{ data.vendor?.address?.zip }}</span></li>
        	<li>&nbsp;</li>
        	<li class="duns-number"><strong>DUNS: </strong><span>{{ data.vendor?.dunsNumber }}</span></li>
          <li class="global-vendor-name"><strong>Global Vendor: </strong><span>{{ data.vendor?.globalName }}</span></li>
          <li class="global-duns-number"><strong>Global DUNS: </strong><span>{{ data.vendor?.globalDunsNumber }}</span></li>
          <li>&nbsp;</li>
          <li class="department-agency-name"><strong>Department/Ind. Agency: </strong><span>{{ data.purchaser?.contractingOrganizationHierarchy[0]?.name }}</span></li>
          <li class="office-name"><strong>Office: </strong><span>{{ data.purchaser?.contractingOrganizationHierarchy[1]?.name }}</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
          <li class="action-obligation"><strong>Action Obligation </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.contract?.obligatedAmount | currency:'USD':true }}</span></li>
            </ul>
          </li>    
          <li class="award-or-idv-type"><strong>{{ data.type=='AWARD' ? 'Award Type' : 'IDV Type' }} </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.awardType?.value }}</span></li>
            </ul>
          </li>      
          <li class="referenced-idv"><strong>Referenced IDV </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.identifiers[0]?.referencePiid }}</span></li>
            </ul>
          </li>
          <li class="date-signed"><strong>Date Signed </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.contract?.signedDate }}</span></li>
            </ul>
          </li>
          <li class="naics-code"><strong>NAICS Code </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.productOrService?.naics?.value }} {{ data.productOrService?.naics?.code ? '('+data.productOrService?.naics?.code+')' : "" }}</span></li>
            </ul>
          </li>
          <li class="psc-code"><strong>PSC Code </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.productOrService?.psc[0]?.value }} {{ data.productOrService?.psc[0]?.code ? '('+data.productOrService?.psc[0]?.code+')' : "" }}</span></li>
            </ul>
          </li>   
        </ul>
      </div>
  `
})
export class AwardsResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  constructor() { }

  ngOnInit(){

    if(this.data.contract!==null && this.data.contract.signedDate!==null) {
      let exp = moment(this.data.contract.signedDate);
      this.data.contract.signedDate = exp.format("MMM D, Y");
    }

  }
}
