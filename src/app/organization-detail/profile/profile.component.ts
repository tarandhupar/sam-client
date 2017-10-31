import { Component, Input, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import * as moment from 'moment/moment';
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHRoleModel } from "../../fh/fh-role-model/fh-role-model.model";
import { IAMService } from "api-kit";
import IAM from "../../../api-kit/iam/api/core/iam";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { Observable } from 'rxjs';

@Component ({
  templateUrl: 'profile.template.html',
})
export class OrgDetailProfilePage {

  @ViewChildren(OrgAddrFormComponent) addrForms:QueryList<OrgAddrFormComponent>;


  orgId:string = "100000121";

  orgObj = {};
  orgDetails = [];
  orgCodes = [];
  orgAddresses = [];
  orgTypes = [];

  hierarchyPathMap = [];
  hierarchyPath = [];

  currentHierarchyType: string = "";
  currentHierarchyLevel: number;

  isDataAvailable:boolean = false;

  isEdit:boolean = false;
  showFullDes: boolean = false;
  isFPDSSource:boolean = false;
  showEditOrgFlashAlert:boolean = false;
  editedDescription:string = "";
  editedShortname:string = "";
  editedEndDate:string = "";

  noneDodHierarchy = ["Dept/Ind Agency", "Sub-Tier", "Office"];
  dodHierarchy = ["Dept/Ind Agency", "Sub-Tier", "Maj Command", "Sub-Command 1", "Sub-Command 2","Sub-Command 3", "Office"];
  adminTypeMap = {"Dept/Ind Agency":"Department", "Sub-Tier":"Agency", "Maj Command":"Office", "Sub-Command 1":"Office", "Sub-Command 2":"Office","Sub-Command 3":"Office", "Office":"Office"};
  createTypeMap = {"Dept/Ind Agency":"Department", "Sub-Tier":"Agency", "Maj Command":"MajCommand", "Sub-Command 1":"SubCommand", "Sub-Command 2":"SubCommand","Sub-Command 3":"SubCommand", "Office":"Office"};

  selectConfig = {
    options:[],
    label: '',
    name: 'Org Types',
  };

  subCommandBaseLevel = 4;
  addrTypeMaping = {M:"Mailing Address", B:"Billing Address", S:"Shipping Address"};

  fhRoleModel:FHRoleModel;

  constructor(private fhService: FHService,
              private route: ActivatedRoute,
              private _router: Router,
              private iamService: IAMService,
              private alertFooter: AlertFooterService,
              public flashMsgService:FlashMsgService){
  }

  ngOnInit(){
    this.route.parent.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        this.getOrgDetail(this.orgId);
        this.isEdit = false;
      });
  }

  isLastHierarchy(index):boolean{return index === this.hierarchyPath.length-1;}
  isNextLayerCreatable():boolean{return this.currentHierarchyType !== "Office";}
  isEditableField(field):boolean{return ["Description","Shortname","End Date"].indexOf(field) !== -1;}
  isDoD():boolean{return this.hierarchyPath.some(e=> {return e.includes("DEFENSE");})}

  isRequestAACIcon(pair):boolean{
    if(this.fhRoleModel.hasPermissionType('PUT',this.adminTypeMap[this.currentHierarchyType])){
      return !this.isDoD() && pair.value === '' && (pair.code === 'Procurement AAC' || pair.code === 'Non-procurement AAC');
    }
    return false;
  }

  getOrgDetail = (orgId) => {
    this.isDataAvailable = false;
    this.fhService.getOrganizationDetail(orgId).subscribe(
      val => {
        this.fhRoleModel = FHRoleModel.FromResponse(val);
        this.orgObj = val._embedded[0].org;
        this.setupOrgFields(this.orgObj);
        this.orgTypes = val._embedded[0].orgTypes;
        this.getSubLayerTypes();
        this.isDataAvailable = true;
      });
  };

  setupOrgFields(orgDetail){
    this.setCurrentHierarchyType(orgDetail.type);
    this.setCurrentHierarchyLevel(orgDetail.level);
    this.setupHierarchyPathMap(orgDetail.fullParentPath, orgDetail.fullParentPathName);
    this.setupOrganizationDetail(orgDetail);
    this.setupOrganizationCodes(orgDetail);
    this.setupOrganizationAddress(orgDetail);
    this.isFPDSSource = !!orgDetail.isSourceFpds?orgDetail.isSourceFpds:false;
  }

  onChangeOrgDetail(hierarchyName){
    if(hierarchyName !== this.hierarchyPath[this.hierarchyPath.length - 1]){
      // make API call to get selected organization detail
      this.getOrgDetail(this.hierarchyPathMap[hierarchyName]);
      this._router.navigate(["/organization-detail",this.hierarchyPathMap[hierarchyName],"profile"]);
    }
  }

  onCancelEditPageClick(){
    this.isEdit = false;
  }

  onSaveEditPageClick(){
    if(this.orgObj['type'].toLowerCase() === 'office'){
      let validateRes = [];
      this.addrForms.forEach( e => {validateRes.push(e.validateForm())});
      Observable.forkJoin(validateRes).subscribe( results => {
        let isAddrValid = true;
        results.forEach(e => {if(e['description'] !== "VALID") isAddrValid = false;});
        if(isAddrValid){
          this.isEdit = false;
          let endDateStr = this.orgObj['endDate']? moment(this.orgObj['endDate']).format('Y-M-D'):'';
          let shortNameStr = this.orgObj['shortName']? this.orgObj['shortName']:'';
          let summaryStr = this.orgObj['summary']? this.orgObj['summary']:'';
          let updatedAddresses = this.getUpdatedOrgAddresses();
          if(this.orgObj['summary'] !== this.editedDescription || this.orgObj['shortName'] !== this.editedShortname ||
            endDateStr !== this.editedEndDate || JSON.stringify(updatedAddresses) !== JSON.stringify(this.orgObj['orgAddresses'])){
            let updatedOrgObj = JSON.parse(JSON.stringify(this.orgObj));
            updatedOrgObj['summary'] = this.editedDescription;
            updatedOrgObj['shortName'] = this.editedShortname;
            updatedOrgObj['endDate'] = this.editedEndDate === ''?null: this.editedEndDate;
            updatedOrgObj['orgAddresses'] = updatedAddresses;
            // this.orgObj['address'] = this.orgAddresses;
            this.updateOrganization(updatedOrgObj);
          }
        }
      }, error => {});
    }else{
      this.isEdit = false;
      let endDateStr = this.orgObj['endDate']? moment(this.orgObj['endDate']).format('Y-M-D'):'';
      let shortNameStr = this.orgObj['shortName']? this.orgObj['shortName']:'';
      let summaryStr = this.orgObj['summary']? this.orgObj['summary']:'';
      if(summaryStr !== this.editedDescription || shortNameStr !== this.editedShortname || endDateStr !== this.editedEndDate) {
        let updatedOrgObj = JSON.parse(JSON.stringify(this.orgObj));
        updatedOrgObj['summary'] = this.editedDescription;
        updatedOrgObj['shortName'] = this.editedShortname;
        updatedOrgObj['endDate'] = this.editedEndDate === '' ? null : this.editedEndDate;
        this.updateOrganization(updatedOrgObj);
      }
    }


  }

  updateOrganization(updatedOrgObj){
    this.fhService.updateOrganization(updatedOrgObj).subscribe(
      val => {
        this.getOrgDetail(this.orgId);
        this.alertFooter.registerFooterAlert({
          title: "Success",
          description: "Your edits have been saved",
          type: 'success',
          timer: 3200
        });
      },
      error=> {
        this.alertFooter.registerFooterAlert({
          title: "Error",
          description: "Failed to update your edits",
          type: 'error',
          timer: 3200
        });
      });
  }

  onEditPageClick(){
    this.isEdit = true;
  }

  onAACRequestClick(pair){
    // Make API call to request for procurement or non-procurement AAC
    let isProcureAAC = pair['code'] === 'Procurement AAC';
    this.fhService.requestAAC(this.orgId, isProcureAAC).subscribe(
      data => {
        this.setupOrganizationCodes(data);
        let message = "Non-procurement AAC has been requested";
        if(pair['code'] === 'Procurement AAC') message = "Procurement AAC request has been completed";
        this.alertFooter.registerFooterAlert({
          title: "Success",
          description: message,
          type: 'success',
          timer: 3200
        });
      },
      error => {
        this.alertFooter.registerFooterAlert({
          title: "",
          description: pair['code']+" request failed",
          type: 'error',
          timer: 3200
        });
      }
    );
  }

  onAddAddressForm(){
    if(this.orgAddresses.length === 2){
      let lastAddrType = "";
      if(this.orgAddresses[1].addrModel.addrType !== "") {
        lastAddrType = this.orgAddresses[1].addrModel.addrType === "Shipping Address"? "Billing Address" : "Shipping Address";
      }
      this.orgAddresses.push({addrModel:{addrType:lastAddrType,country:"",state:"",city:"",street1:"",street2:"",zip:""},showAddIcon:false});

    }else if(this.orgAddresses.length < 2){
      this.orgAddresses.push({addrModel:{addrType:"",country:"",state:"",city:"",street1:"",street2:"",zip:""},showAddIcon:false});
    }
    this.orgAddresses.forEach( e => { e.showAddIcon = false;});
  }

  onEnableAddAddressIcon(val){
    if(val){this.orgAddresses.forEach(e => {e.showAddIcon = true});}
  }

  onDeleteAddressForm(orgAddrModel){
    this.orgAddresses = this.orgAddresses.filter( e => {
      return orgAddrModel.addrType !== e.addrModel.addrType;
    });
    this.orgAddresses.forEach( e => {e.showAddIcon = true;});
  }

  setupHierarchyPathMap(fullParentPath:string, fullParentPathName:string){
    this.setupHierarchyPath(fullParentPathName);

    let parentOrgIds = fullParentPath.split('.');
    this.hierarchyPathMap = [];
    parentOrgIds.forEach((elem,index) => {
      this.hierarchyPathMap[this.hierarchyPath[index]] = elem;
    });

  }

  setupHierarchyPath(fullParentPathName:string){
    this.hierarchyPath = fullParentPathName.split('.').map( e => {
      return e.split('_').join(' ');
    });
  }

  setupOrganizationDetail(org){
    this.orgDetails = [];
    let description = this.getOrgFieldData(org,"summary");
    let shortName = this.getOrgFieldData(org,"shortName");
    let startDateStr = "";
    let endDateStr = "";
    let funding = "";

    if(!!org.startDate){
      startDateStr = moment(org.startDate).utc().format('MM/DD/YYYY');
    }

    if(!!org.endDate){
      endDateStr = moment(org.endDate).utc().format('MM/DD/YYYY');
    }

    this.orgDetails.push({description:this.capitalizeFirstLetter(org.type)+" Name", value:this.capitalizeFirstLetter(org.name)});
    this.orgDetails.push({description:"Description", value:description});
    this.orgDetails.push({description:"Shortname", value:shortName});
    this.orgDetails.push({description:"Start Date", value:startDateStr});
    this.orgDetails.push({description:"End Date", value:endDateStr});

    this.editedDescription = description;
    this.editedShortname = shortName;
    this.editedEndDate = endDateStr;

    if(org.type.toLowerCase() === "office"){
      let fundingStrs = [];
      if(org.newIsFunding) fundingStrs.push("Funding");
      if(org.newIsAward) fundingStrs.push("Award");
      if(fundingStrs.length > 1) funding = fundingStrs.join('/');
      this.orgDetails.push({description:"Indicate Funding", value:funding});
    }

  }

  setupOrganizationCodes(org){
    this.orgCodes = [];
    switch (org.type) {
      case "OFFICE": case "Office":
      this.orgCodes.push({code:"Procurement AAC", value:this.getOrgFieldData(org,"procurementAACCode")});
      this.orgCodes.push({code:"Non-procurement AAC", value:this.getOrgFieldData(org,"nonProcurementAACCode")});
      this.orgCodes.push({code:"FPDS Code", value:this.getOrgFieldData(org,"fpdsCode")});
      break;
      case "AGENCY": case "Sub-Tier": case "Maj Command": case "Sub-Command 1": case "Sub-Command 2": case "Sub-Command 3":
      this.orgCodes.push({code:"FPDS Code", value:this.getOrgFieldData(org,"fpdsCode")});
      this.orgCodes.push({code:"OMB Bureau Code", value:this.getOrgFieldData(org,"ombAgencyCode")});
      break;
      case "DEPARTMENT": case "Dept/Ind Agency":
      this.orgCodes.push({code:"TAS-2 Code", value:this.getOrgFieldData(org,"tas2Code")});
      this.orgCodes.push({code:"TAS-3 Code", value:this.getOrgFieldData(org,"tas3Code")});
      this.orgCodes.push({code:"A-11 Code", value:this.getOrgFieldData(org,"a11TacCode")});
      this.orgCodes.push({code:"CFDA Code", value:this.getOrgFieldData(org,"cfdaCode")});
      this.orgCodes.push({code:"OMB Bureau Code", value:this.getOrgFieldData(org,"ombAgencyCode")});
      break;
      default:
        break;
    }
  }

  setupOrganizationAddress(org){
    this.orgAddresses = [];
    let addresses = org.orgAddresses.length > 0? org.orgAddresses:[];
    addresses.forEach(e => {
      if(e.type){
        // this.orgAddresses.push({addressType:this.addrTypeMaping[e.type], value:{street:e.streetAddress, city:e.city, state:e.state, zip:e.zipcode}});
        this.orgAddresses.push({addrModel:{addrType:this.addrTypeMaping[e.type],country:e.countryCode,state:e.state,city:e.city,street1:e.streetAddress,street2:e.streetAddress2?e.streetAddress2:'',zip:e.zipcode},showAddIcon:addresses.length < 3});

      }
    });
  }

  setCurrentHierarchyType(type){
    this.currentHierarchyType = type;
  }

  setCurrentHierarchyLevel(level){
    this.currentHierarchyLevel = level;
  }

  getOrgFieldData(data, fieldName:string){
    let res = "";
    if(!!data[fieldName]){
      res = data[fieldName];
    }

    if(res == "" && data['nonProcAACRequestedDate'] && fieldName === 'nonProcurementAACCode'){
      res = "AAC has been requested";
    }
    return res;
  }

  getLastHierarchyClass(index){
    return index === this.hierarchyPath.length-1? "current-hierarchy-link":"";
  }

  getSubLayerTypes(){
    let curHierarchy = this.isDoD()? this.dodHierarchy: this.noneDodHierarchy;
    let curHierarchyType = this.currentHierarchyType;
    let subLayers = [];
    let index = curHierarchy.indexOf(curHierarchyType);

    if( index < curHierarchy.length - 1){
      if(this.fhRoleModel.hasPermissionType("POST",this.adminTypeMap[curHierarchy[index + 1]])) {
        subLayers.push({value: this.createTypeMap[curHierarchy[index + 1]], label: curHierarchy[index + 1], name: curHierarchy[index + 1]});
      }
    }

    if( index !== 0 && index < curHierarchy.length - 2 && this.fhRoleModel.hasPermissionType("POST",'Office')){
      subLayers.push({value: 'Office', label: 'Office', name: 'Office'});
    }


    this.selectConfig.options = subLayers;
    return subLayers;
  }

  getUpdatedOrgAddresses(){
    let updateAddresses = [];
    this.orgAddresses.forEach( e => {
      let isUpdated = false;
      let addrType = "";
      Object.keys(this.addrTypeMaping).forEach(key => {if(this.addrTypeMaping[key] === e.addrModel.addrType) addrType = key;});

      // Update existing address if the address type is matching
      this.orgObj['orgAddresses'].forEach( addr => {
        if(addr.type === addrType){
          let updatedAddr = JSON.parse(JSON.stringify(addr));
          isUpdated = true;
          updatedAddr["city"] = e.addrModel.city;
          updatedAddr["countryCode"] = e.addrModel.country;
          updatedAddr["state"] = e.addrModel.state;
          updatedAddr["streetAddress"] =  e.addrModel.street1;
          updatedAddr["streetAddress2"] =  e.addrModel.street2;
          updatedAddr["zipcode"] = e.addrModel.zip;
          updateAddresses.push(updatedAddr);
        }
      });

      // Push a new address to the org address if there is no existing type of address in org
      if(!isUpdated){
        updateAddresses.push({
          "type": addrType,
          "city": e.addrModel.city,
          "countryCode": e.addrModel.country,
          "state": e.addrModel.state,
          "streetAddress":  e.addrModel.street1,
          "streetAddress2":  e.addrModel.street2,
          "zipcode": e.addrModel.zip,
        });
      }
    });
    return updateAddresses;
  }

  onSelect(val){
    let navigationExtras: NavigationExtras = {
      queryParams: { parentID: this.orgId, orgType: val},
    };
    this._router.navigate(["/create-organization"],navigationExtras);
  }

  capitalizeFirstLetter(str:string):string {
    return str.split(' ').map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(' ');
  }

  showFullDescription(){this.showFullDes = true;}
  hideFullDescription(){this.showFullDes = false;}

  dismissCreateOrgFlashAlert(){
    this.flashMsgService.hideFlashMsg();
    this.flashMsgService.resetFlags();
  }

  dismissEditOrgFlashAlert(){
    this.showEditOrgFlashAlert = false;
  }

  dismissMoveOrgFlashAlert(){
    this.flashMsgService.hideFlashMsg();
    this.flashMsgService.resetFlags();
  }

  dismissCreateOrgInfoAlert(){
    this.flashMsgService.resetFlags();
  }

  dismissAACRequestFlashAlert(){
    this.flashMsgService.hideFlashMsg();
    this.flashMsgService.resetFlags();
  }
}
