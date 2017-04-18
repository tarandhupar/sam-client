import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import * as moment from 'moment/moment';
import { FlashMsgService } from "../flash-msg-service/flash-message.service";

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
  isCFDASource:boolean = false;
  showEditOrgFlashAlert:boolean = false;
  editedDescription:string = "";
  editedShortname:string = "";

  noneDodHierarchy = ["Department", "Agency", "Office"];
  dodHierarchy = ["Department", "Agency", "Major Command", "Sub Command", "Office"];

  selectConfig = {
    options:[],
    label: '',
    name: 'Org Types',
  };

  subCommandBaseLevel = 4;

  constructor(private fhService: FHService, private route: ActivatedRoute, private _router: Router, public flashMsgService:FlashMsgService){
  }

  ngOnInit(){
    this.route.parent.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        this.getOrgDetail(this.orgId);
      });
  }

  isLastHierarchy(index):boolean{return index === this.hierarchyPath.length-1;}
  isNextLayerCreatable():boolean{return this.currentHierarchyType !== "Office";}
  isEditableField(field):boolean{return field === "Description" || field === "Shortname";}
  isDoD():boolean{return this.hierarchyPath.some(e=> {return e.includes("DEFENSE");})}

  getOrgDetail(orgId){
    this.isDataAvailable = false;
    this.fhService.getOrganizationById(orgId,false,true).subscribe(
      val => {
        this.orgObj = val._embedded[0].org;
        this.setupOrgFields(this.orgObj);
        this.isDataAvailable = true;
        this.orgTypes = val._embedded[0].orgTypes;
        this.getSubLayerTypes();
      });
  }

  setupOrgFields(orgDetail){
    this.setCurrentHierarchyType(orgDetail.type);
    this.setCUrrentHierarchyLevel(orgDetail.level);
    this.setupHierarchyPathMap(orgDetail.fullParentPath, orgDetail.fullParentPathName);
    this.setupOrganizationDetail(orgDetail);
    this.setupOrganizationCodes(orgDetail);
    this.setupOrganizationAddress(orgDetail);
    this.isCFDASource = !!orgDetail.isSourceCfda?orgDetail.isSourceCfda:false;

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
    if(this.orgObj['summary'] !== this.editedDescription || this.orgObj['shortName'] !== this.editedShortname){
      this.orgObj['summary'] = this.editedDescription;
      this.orgObj['shortName'] = this.editedShortname;
      this.fhService.updateOrganization(this.orgObj).subscribe(
        val => {
          this.orgObj = val._embedded[0].org;
          this.setupOrgFields(this.orgObj);
          this.showEditOrgFlashAlert = true;
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
    let funding = "";

    if(!!org.startDate){
      startDateStr = moment(org.startDate).format('MM/DD/YYYY');
    }

    this.orgDetails.push({description:this.capitalizeFirstLetter(org.type)+" Name", value:this.capitalizeFirstLetter(org.name)});
    this.orgDetails.push({description:"Description", value:description});
    this.orgDetails.push({description:"Shortname", value:shortName});
    this.orgDetails.push({description:"Start Date", value:startDateStr});

    this.editedDescription = description;
    this.editedShortname = shortName;

    if(org.type === "OFFICE"){
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
        this.orgCodes.push({code:"FPDS Code", value:this.getOrgFieldData(org,"fpdsOrgId")});
        break;
      case "AGENCY": case "MAJOR COMMAND": case "SUB COMMAND":
        this.orgCodes.push({code:"FPDS Code", value:this.getOrgFieldData(org,"fpdsOrgId")});
        this.orgCodes.push({code:"OMB Bureau Code", value:this.getOrgFieldData(org,"ombAgencyCode")});
        break;
      case "DEPARTMENT":
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
    if(addresses.length > 0)this.orgAddresses.push({addressType:"Mailing Address", value:{street:addresses[0].streetAddress, city:addresses[0].city, state:addresses[0].state, zip:addresses[0].zipcode}});
    if(addresses.length > 1)this.orgAddresses.push({addressType:"Shipping Address", value:{street:addresses[1].streetAddress, city:addresses[1].city, state:addresses[1].state, zip:addresses[1].zipcode}});
    if(addresses.length > 2)this.orgAddresses.push({addressType:"Billing Address", value:{street:addresses[2].streetAddress, city:addresses[2].city, state:addresses[2].state, zip:addresses[2].zipcode}});
  }

  setCurrentHierarchyType(type){
    this.currentHierarchyType = this.capitalizeFirstLetter(type);
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
    let subCommandIndex = 0;
    if(curHierarchyType === "Sub Command"){
      subCommandIndex = this.currentHierarchyLevel - this.subCommandBaseLevel + 1;
      if(subCommandIndex < 3){
        let nextSubCommand = "Sub Command "+(subCommandIndex+1);
        subLayers.push({value: 'SubCommand', label: nextSubCommand, name: nextSubCommand});

      }
    }else{
      switch (this.currentHierarchyType) {
        case "Department":
          subLayers.push({value: 'Agency', label: 'Sub-tier Agency', name: 'Sub-tier Agency'});
          break;
        case "Agency":
          if(this.isDoD()) subLayers.push({value: 'MajorCommand', label: 'Major Command', name: 'Major Command'});
          break;
        case "Major Command":
          subLayers.push({value: 'SubCommand', label: 'Sub Command 1', name: 'Sub Command 1'});
          break;
        default:
          break;
      }
    }

    if(curHierarchyType !== "Office" && curHierarchyType !== "Department"){
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
}
