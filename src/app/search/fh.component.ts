import { Component,Input,Output,OnInit,EventEmitter } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FHService } from '../common/service/api/fh.service';
import { APIService } from '../common/service/api/api.service';


@Component({
	selector: 'fh-input',
	providers: [FHService,APIService],
	templateUrl:'fh.template.html'
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
  defaultDpmtOption = {value:'', label: 'Please select an Department', name: ''};
  dpmtSelectConfig = {
    options: [
      this.defaultDpmtOption
    ],
    label: 'Department',
    name: 'Department'
  };
  defaultAgencyOption = {value:'', label: 'Please select an Agency', name: ''};
  agencySelectConfig = {
    options: [
      this.defaultAgencyOption
    ],
    label: 'Agency',
    name: 'Agency'
  };
  defaultOfficeOption = {value:'', label: 'Please select an Office', name: ''};
  officeSelectConfig = {
    options: [
      this.defaultOfficeOption
    ],
    label: 'Office',
    name: 'Office'
  };

	constructor(private activatedRoute:ActivatedRoute, private oFHService:FHService, private oAPIService:APIService){}

	ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.initFederalHierarchyDropdowns('');
      });
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
            var formattedData = this.formatHierarchy("department",res._embedded.hierarchy);
            this.dpmtSelectConfig.options = formattedData;
      if(this.organizationId.length > 0) {
        this.oFHService.getFederalHierarchyById(this.organizationId, true, true).subscribe(res => {
          //inferring department match
          if(res.elementId === this.organizationId) {
            this.selectedDeptId = res.elementId;
            this.setOrganizationId("department");
          }
            //inferring agency match
          else {
            this.selectedDeptId = res.elementId;
            this.initDictionaries(res.elementId, true, true).subscribe( oData => {
              if(oData.type === 'DEPARTMENT') {
                //initialize Department "Label" and Agency dropdown
                this.dictionary.aAgency = oData.hierarchy;
                var agencyformattedData = this.formatHierarchy("agency",oData.hierarchy);
                this.agencySelectConfig.options = agencyformattedData;
                this.selectedAgencyId = res.hierarchy[0].elementId;
                this.setOrganizationId("agency");
              }
            });
          }
        });
      }
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
            this.organizationId = '';
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
                var formattedData = this.formatHierarchy("agency",oData.hierarchy);
                this.dictionary.aAgency = oData.hierarchy;
                this.agencySelectConfig.options = formattedData;
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
            this.setOrganizationId("department");
        }

        //empty office dropdowns
        this.dictionary.aOffice = [];
        this.selectedOfficeId = "";

        //get offices of the selected agency
        this.initDictionaries(this.organizationId, false, true).subscribe( (oData) => {
            if(oData.type === 'AGENCY') {
                //initialize Department "Label" and Office dropdown
                this.dictionary.aOffice = oData.hierarchy;
                var formattedData = this.formatHierarchy("office",oData.hierarchy);
                this.officeSelectConfig.options = formattedData;
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

  formatHierarchy(type,data){
    var formattedData = [];
    switch(type){
      case "department":
        formattedData.push(this.defaultDpmtOption);
        break;
      case "agency":
        formattedData.push(this.defaultAgencyOption);
        break;
      case "office":
        formattedData.push(this.defaultOfficeOption);
        break;
    }

    for(var idx in data){
      var obj = {};
      obj['value'] = data[idx].elementId;
      obj['label'] = data[idx].name;
      obj['name'] = data[idx].elementId;
      formattedData.push(obj);
    }
    return formattedData;
  }
}
