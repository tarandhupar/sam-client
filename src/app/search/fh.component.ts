import { Component,Input,Output,OnInit,EventEmitter } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { FHService } from '../common/service/fh.service';
import { APIService } from '../common/service/api.service';


@Component({
	selector: 'fh-input',
	providers: [FHService,APIService],
	template:`
		<div class='organization-container'>
		    <div class='usa-alert usa-alert-error' role='alert' *ngIf='false'>
		      <div class='usa-alert-body'>
		        <h3 class='usa-alert-heading'>Agency Error</h3>
		        <p class='usa-alert-text'>{{ error }}</p>
		      </div>
		    </div>
		    <div class='no-input' *ngIf="false">
		        {{ departmentLabel }}
		    </div>
		    <div class='usa-grid-full'>
		        <div class='usa-width-one-third'>
		            <label for='jqDepartmentFH'>Department</label>
		            <select [(ngModel)]='selectedDeptId' (ngModelChange)='setOrganizationId("department")' id='jqDepartmentFH'>
		                <option value=''>Please select a Department</option>
		                <option *ngFor="let dpmt of dictionary.aDepartment" [value]="dpmt.elementId">{{dpmt.name}}</option>
		            </select>
		            <span *ngIf="false" class='department-label2'> {{ departmentLabel }} </span>
		        </div>
		        <div class='usa-width-one-third'>
		            <label for='jqAgencyFH'>Agency</label>
		            <select [(ngModel)]="selectedAgencyId" (ngModelChange)='setOrganizationId("agency")' [disabled]="lockAgency" id='jqAgencyFH'>
		                <option value=''>Please select an Agency</option>
		                <option *ngFor="let agency of dictionary.aAgency" [value]="agency.elementId">{{agency.name}}</option>
		            </select>
		        </div>
		        <div *ngIf='checkOffice()' class='usa-width-one-third'>
		            <label for='jqOfficeFH'>Office</label>
		            <select [(ngModel)]="selectedOfficeId" [disabled]="lockOffice" id='jqOfficeFH'>
		                <option value=''>Please select an Office</option>
		                <option *ngFor="let office of dictionary.aOffice" [value]="office.elementId">{{office.name}}</option>
		            </select>
		        </div>
		    </div>
		</div>
	`
})
export class FHInputComponent implements OnInit {
	@Input() hideOffice: boolean;
	@Output() organization = new EventEmitter<string>();
	lockAgency = false;
	lockOffice = false;
	selectedDeptId="";
	selectedAgencyId="";
	selectedOfficeId="";
	departmentLabel="";
	error="";
	dictionary = {
		aDepartment:[],
		aAgency: [],
		aOffice: []
	};
	organizationId = '';
	//programOrganizationId = '';
	hasDepartmentChanged = false;
	setDeptNullOnChange;
	organizationConfiguration;
	constructor(private oFHService:FHService, private oAPIService:APIService){}

	ngOnInit() {
		this.initFederalHierarchyDropdowns('');
	}

	checkOffice(){
		return !this.hideOffice;
	}

	initDictionaries(ordId, includeParent, includeChildren){
		//get Department level of user's organizationId
    return this.oFHService.getFederalHierarchyById(ordId, includeParent, includeChildren);
	}
	
	initFederalHierarchyDropdowns(userRole){
		this.initDictionaries("",true,false).subscribe( res => {
			this.dictionary.aDepartment = res._embedded.hierarchy;
		});
	}
	
	setOrganizationId(type){
		switch(type){
      case 'department':
      	
        if(typeof this.selectedDeptId !== 'undefined' && this.selectedDeptId !== ''
                && this.selectedDeptId !== null) {
            this.organizationId = this.selectedDeptId;

            //once user choose a different department, switch flag of hasDepartmentChanged
            this.hasDepartmentChanged = true;
        } else { //if department is not selected then set user's organization id
            //$scope.organizationId = $scope.programOrganizationId;
        }
      	
        //empty agency & office dropdowns
        this.dictionary.aAgency = [];
        this.selectedAgencyId = '';
        this.dictionary.aOffice = [];
        this.selectedOfficeId = '';
        
        if(typeof this.selectedDeptId !== 'undefined' && this.selectedDeptId !== ''
          	&& this.selectedDeptId !== null) {
            //get agencies of the selected department
            this.initDictionaries(this.organizationId, true, true).subscribe( oData => {
              if(oData.type === 'DEPARTMENT') {
                //initialize Department "Label" and Agency dropdown
                this.dictionary.aAgency = oData.hierarchy;
              }
            });
        }
        
        //in case we need to set organizationId to null if department has not been selected
        if(typeof this.setDeptNullOnChange !== 'undefined' && this.setDeptNullOnChange === true
                && (this.selectedDeptId === '' || typeof this.selectedDeptId === 'undefined')) {
            this.organizationId = '';
        }
        
        break;
      case 'agency':
        if(typeof this.selectedAgencyId !== 'undefined' && this.selectedAgencyId !== ''
                && this.selectedAgencyId !== null) {
            this.organizationId = this.selectedAgencyId;
        } else { //if agency is not selected then set department
            //if user is a root then set department from dropdown
            /*if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER]) || AuthorizationService.authorizeByRole([SUPPORTED_ROLES.RMO_SUPER_USER]) ||
                (typeof $scope.showAll !== 'undefined' && $scope.showAll === true)) {
                $scope.organizationId = $scope.selectedDeptId;
            } else if(AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR])) { //if user is a agency coord then set department from user's
                $scope.organizationId = $scope.programOrganizationId;
            }*/
        }

        //empty office dropdowns
        this.dictionary.aOffice = [];
        this.selectedOfficeId = "";

        //get offices of the selected agency
        this.initDictionaries(this.organizationId, false, true).subscribe( (oData) => {
            if(oData.type === 'AGENCY') {
                //initialize Department "Label" and Office dropdown
                this.dictionary.aOffice = oData.hierarchy;
            }
        });
        break;
      case 'office':
        if(typeof this.selectedOfficeId !== 'undefined' && this.selectedOfficeId !== ''
            && this.selectedOfficeId !== null) {
            this.organizationId = this.selectedOfficeId;
        } else { //if office is not selected then set agency
            this.organizationId = this.selectedAgencyId;
        }
        break;
  	}
  	this.organization.emit(this.organizationId);//pass to output
  	this.getFederalHierarchyConfiguration(this.organizationId);
	}

	getFederalHierarchyConfiguration(organizationId){
		if(organizationId) {
      var oApiParam = {
          name: 'federalHierarchyConfiguration',//not added to api service yet
          suffix: '/'+organizationId,
          oParam: {},
          oData: {},
          method: 'GET'
      };

      //todo x-auth-token header required for this call, with api umbrella does the program api service need modifications?
      /*this.oAPIService.call(oApiParam).subscribe( (data) => {
          this.organizationConfiguration = data;
      });*/
  	}
	}
}
