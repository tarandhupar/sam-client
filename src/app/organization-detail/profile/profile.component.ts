import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import * as moment from 'moment/moment';
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { FHRoleModel } from "../../fh/fh-role-model/fh-role-model.model";
import { IAMService } from "api-kit";
import IAM from "../../../api-kit/iam/api/core/iam";

@Component ({
  templateUrl: 'profile.template.html',
})
export class OrgDetailProfilePage {
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
              public flashMsgService:FlashMsgService){
  }

  ngOnInit(){
    this.route.parent.params.subscribe(
      params => {
        this.orgId = params['orgId'];

        this.iamService.iam.checkSession(this.checkAccess, this.redirectToSignin);

      });
  }

  isLastHierarchy(index):boolean{return index === this.hierarchyPath.length-1;}
  isNextLayerCreatable():boolean{return this.currentHierarchyType !== "Office";}
  isEditableField(field):boolean{return ["Description","Shortname","End Date"].indexOf(field) !== -1;}
  isDoD():boolean{return this.hierarchyPath.some(e=> {return e.includes("DEFENSE");})}

  checkAccess = (user) => {
    this.fhService.getAccess(this.orgId).subscribe(
      (data)=> {this.getOrgDetail(this.orgId);},
      (error)=> {if(error.status === 403) this.redirectToForbidden();}
    );
  };

  redirectToSignin = () => { this._router.navigateByUrl('/signin')};
  redirectToForbidden = () => {this._router.navigateByUrl('/403')};

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
    this.setCUrrentHierarchyLevel(orgDetail.level);
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
    this.isEdit = false;
    let endDateStr = moment(this.orgObj['endDate']).format('Y-M-D');
    if(this.orgObj['summary'] !== this.editedDescription || this.orgObj['shortName'] !== this.editedShortname || endDateStr !== this.editedEndDate){
      this.orgObj['summary'] = this.editedDescription;
      this.orgObj['shortName'] = this.editedShortname;
      this.orgObj['endDate'] = this.editedEndDate;
      this.fhService.updateOrganization(this.orgObj).subscribe(
        val => {
          this.getOrgDetail(this.orgId);
          this.showEditOrgFlashAlert = true;
          setTimeout(()=>{this.showEditOrgFlashAlert = false;}, 3000);
        });
    }
  }

  onEditPageClick(){
    this.isEdit = true;
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
      startDateStr = moment(org.startDate).format('MM/DD/YYYY');
    }

    if(!!org.endDate){
      endDateStr = moment(org.endDate).format('MM/DD/YYYY');
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
      case "OFFICE":
        this.orgCodes.push({code:"AAC Code", value:this.getOrgFieldData(org,"aacCode")});
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
        this.orgAddresses.push({addressType:this.addrTypeMaping[e.type], value:{street:e.streetAddress, city:e.city, state:e.state, zip:e.zipcode}});
      }
    });
  }

  setCurrentHierarchyType(type){
    this.currentHierarchyType = type;
  }

  setCUrrentHierarchyLevel(level){
    this.currentHierarchyLevel = level;
  }

  getOrgFieldData(data, fieldName:string){
    let res = "";
    if(!!data[fieldName]){
      res = data[fieldName];
    }
    return res;
  }

  getLastHierarchyClass(index){
    return index === this.hierarchyPath.length-1? "current-hierarchy-link":"";
  }

  /**
   * Returns next layer text for button of creating next layer organization
   * @returns {string}
   */
  getNextLayer():string{
    let res = "";
    switch (this.currentHierarchyType) {
      case "Department":
        res = "Sub-tier Agency";
        break;
      case "Agency":
        res = "Major Command";
        break;
      case "Major Command":
        res= "Sub Command 1";
        break;
      case "Office":
        res= this.currentHierarchyLevel <= 5? "Office":"";
        break;
      default:
        break;
    }

    return res;
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
}
