import { Component,OnInit,Input } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  moduleId: __filename,
  selector: 'opportunities-result',
  directives: [],
  providers: [],
  template: `
    <span class="usa-label">Opportunity</span>
    <h3>
      <a href="#title">{{ data.procurementTitle }}</a>
    </h3>
    <div class="usa-width-two-thirds">
      <p class="m_T-2x" *ngIf="data.procurementDescription!=null && data.procurementDescription.length>150">
        <span [innerHTML]="data.procurementDescription | slice:0:150"></span>...
      </p>
      <p class="m_T-2x" *ngIf="data.procurementDescription!=null && data.procurementDescription.length<150">
        <span [innerHTML]="data.procurementDescription"></span>
      </p>
      <ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        <li><strong>Department:</strong> <a href="#">{{ data.parentAgencyName }}</a></li>
        <li><strong>Office:</strong> <a href="#">{{ data.officeName }}</a></li>
        <li><strong>Location:</strong>{{ data.location }}</li>
      </ul>
    </div>
    <div class="usa-width-one-third">
      <ul class="usa-text-small m_B-0">
        <li>
          <strong>Solicitation Number</strong>
          <ul class="usa-unstyled-list">
            <li>{{ data.solicitationNumber }}</li>
          </ul>
        </li>
          <li>
          <strong>Posted Date</strong>
          <ul class="usa-unstyled-list">
            <li>{{ data.procurementPostedDate | date }}</li>
          </ul>
        </li>
        <li>
          <strong>Type</strong>
          <ul class="usa-unstyled-list">
            <li>{{data.procurementTypeValue}}</li>
          </ul>
        </li>
      </ul>
    </div>
  `
})
export class OpportunitiesResult implements OnInit{
	@Input() data: any;
	constructor() { }
	ngOnInit() {


	}
}
