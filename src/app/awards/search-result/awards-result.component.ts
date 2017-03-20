
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
      	<span>{{ data.identifiers[0]?.piid }}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
      	  <li><strong>{{ data.vendor?.name }}</strong></li>
      	  <li><span>{{ data.vendor?.address?.city }}, {{ data.vendor?.address?.state?.code }} {{ data.vendor?.address?.zip }}</span></li>
        	<li>&nbsp;</li>
        	<li><strong>DUNS: </strong><span>{{ data.vendor?.dunsNumber }}</span></li>
          <li><strong>Global Vendor: </strong><span>{{ data.vendor?.globalName }}</span></li>
          <li><strong>Global DUNS: </strong><span>{{ data.vendor?.globalDunsNumber }}</span></li>
          <li>&nbsp;</li>
          <li><strong>Department/Ind. Agency: </strong><span>{{ data.purchaser?.contractingOrganizationHierarchy[0]?.name }}</span></li>
          <li><strong>Office: </strong><span>{{ data.purchaser?.contractingOrganizationHierarchy[1]?.name }}</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">
          <li><strong>Action Obligation </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.contract?.obligatedAmount | currency:'USD':true }}</span></li>
            </ul>
          </li>    
          <li><strong>Award Type </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.type }}</span></li>
            </ul>
          </li>      
          <li><strong>Referenced IDV </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.identifiers[0]?.referencePiid }}</span></li>
            </ul>
          </li>
          <li><strong>Date Signed </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.contract?.signedDate }}</span></li>
            </ul>
          </li>
          <li><strong>NAICS Code </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.productOrService?.naics?.value }} ({{ data.productOrService?.naics?.code }})</span></li>
            </ul>
          </li>
          <li><strong>PSC Code </strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.productOrService?.psc?.value }} ({{ data.productOrService?.psc?.code }})</span></li>
            </ul>
          </li>   
        </ul>
      </div>
  `
})
export class AwardsResult implements OnInit {
  @Input() data: any={};

  constructor() { }

  ngOnInit(){
    if(this.data.contract!==null && this.data.contract.signedDate!==null) {
      let exp = moment(this.data.contract.signedDate);
      this.data.contract.signedDate = exp.format("MMM D, Y");
    }
  }
}
