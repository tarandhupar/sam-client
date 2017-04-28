
import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import Moment = moment.Moment;

@Component({
  moduleId: __filename,
  selector: 'awards-result',
  template: `
    <div class="sam-ui grid">
      <div class="row">
        <div class="eight wide column">
          <h3 class="award-title">
            <a *ngIf="data.isActive==true" [routerLink]="['/awards', uniqueIdentifier]" [queryParams]="qParams">
              {{ data.identifiers[0]?.piid }}
            </a>
          </h3>
          <ul class="sam-ui small list">
        	  <li class="modification-number">
              <strong>Modification</strong><br>
              <span>{{ data.identifiers[0]?.modificationNumber }}</span>
            </li>
        	  
        	  <li class="vendor-name">
              <strong>{{ data.vendor?.name }}</strong>
            </li>
        	  <li class="vendor-address">
              <span>{{ data.vendor?.address?.city }}, {{ data.vendor?.address?.state?.code }} {{ data.vendor?.address?.zip }}</span>
            </li>
          	
          	<li class="duns-number">
              <strong>DUNS</strong><br>
              <span>{{ data.vendor?.dunsNumber }}</span>
            </li>
            <li class="global-vendor-name">
              <strong>Global Vendor</strong><br>
              <span>{{ data.vendor?.globalName }}</span>
            </li>
            <li class="global-duns-number">
              <strong>Global DUNS</strong><br>
              <span>{{ data.vendor?.globalDunsNumber }}</span>
            </li>
            
            <li class="department-agency-name">
              <strong>Department/Ind. Agency</strong><br>
              <span>{{ data.purchaser?.contractingOrganizationHierarchy[0]?.name }}</span>
            </li>
            <li class="office-name">
              <strong>Office</strong><br>
              <span>{{ data.purchaser?.contractingOrganizationHierarchy[1]?.name }}</span>
            </li>
          </ul>
        </div>
        <div class="four wide column">
          <ul class="sam-ui small list">
            <li>
              <span class="sam-ui mini label">
                Award
              </span>
            </li>
            <li class="action-obligation">
              <strong>Action Obligation </strong><br>
              <span>{{ data.contract?.obligatedAmount | currency:'USD':true }}</span>
            </li>    
            <li class="award-or-idv-type">
              <strong>{{ data.type=='AWARD' ? 'Award Type' : 'IDV Type' }} </strong>
              <span>{{ data.awardType?.value }}</span>
            </li>      
            <li class="referenced-idv">
              <strong>Referenced IDV </strong>
              <span>{{ data.identifiers[0]?.referencePiid }}</span>
            </li>
            <li class="date-signed">
              <strong>Date Signed </strong>
              <span>{{ data.contract?.signedDate }}</span>
            </li>
            <li class="naics-code">
              <strong>NAICS Code </strong>
              <span>{{ data.productOrService?.naics?.value }} {{ data.productOrService?.naics?.code ? '('+data.productOrService?.naics?.code+')' : "" }}</span>
            </li>
            <li class="psc-code">
              <strong>PSC Code </strong>
              <span>{{ data.productOrService?.psc[0]?.value }} {{ data.productOrService?.psc[0]?.code ? '('+data.productOrService?.psc[0]?.code+')' : "" }}</span>
            </li>   
          </ul>
        </div>
      </div>
    </div>
  `
})
export class AwardsResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  idConcat:string;
  typeConcat:string;
  uniqueIdentifier:string;
  constructor() { }

  ngOnInit(){

    if(this.data.contract!==null && this.data.contract.signedDate!==null) {
      let exp = moment(this.data.contract.signedDate);
      this.data.contract.signedDate = exp.format("MMM D, Y");
    }

    if(this.data._id!=null && this.data._id.length >0){
      this.idConcat = this.data._id;
    }
    else{
      this.idConcat = 'NA';
    }

    if(this.data.type != null && this.data.type.length > 0){
      this.typeConcat = this.data.type;
    }
    else{
      this.typeConcat = 'NA';
    }

    this.uniqueIdentifier = this.idConcat + '+' + this.typeConcat;

  }
}
