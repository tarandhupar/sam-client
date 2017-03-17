import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import * as moment from 'moment/moment';


@Component ({
  templateUrl: 'profile.template.html'
})
export class OrgDetailProfilePage {
  orgId:string = "100000121";

  orgDetails = [];
  orgCodes = [];
  orgAddresses = [];

  hierarchyPathMap = [];
  hierarchyPath = [];

  currentHierarchyType: string = "";
  currentHierarchyLevel: number;

  isDataAvailable:boolean = false;

  constructor(private fhService: FHService, private route: ActivatedRoute, private _router: Router){
  }

  ngOnInit(){
    this.orgId = this.route.parent.snapshot.params['orgId'];

    this.getOrgDetail(this.orgId);
  }

  isLastHierarchy(index):boolean{return index === this.hierarchyPath.length-1;}
  isNextLayerCreatable():boolean{return this.getNextLayer() !== "";}

  getOrgDetail(orgId){
    this.isDataAvailable = false;
    this.fhService.getOrganizationById(orgId,false,true).subscribe(
      val => {
        let orgDetail = val._embedded[0].org;
        this.setCurrentHierarchyType(orgDetail.type);
        this.setCUrrentHierarchyLevel(orgDetail.level);
        this.setupHierarchyPathMap(orgDetail.fullParentPath, orgDetail.fullParentPathName);
        this.setupOrganizationDetail(orgDetail);
        this.setupOrganizationCodes(orgDetail);
        this.setupOrganizationAddress(orgDetail);
        this.isDataAvailable = true;
      });

  }

  onChangeOrgDetail(hierarchyName){
    if(hierarchyName !== this.hierarchyPath[this.hierarchyPath.length - 1]){
      // make API call to get selected organization detail
      this.getOrgDetail(this.hierarchyPathMap[hierarchyName]);
      this._router.navigate(["/organization-detail",this.hierarchyPathMap[hierarchyName],"profile"]);
    }
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
      case "Agency": case "Sub Command": case "Major Command":
        res = "Office";
        break;
      case "Office":
        res= this.currentHierarchyLevel <= 5? "Office":"";
        break;
      default:
        break;
    }

    return res;
  }

  capitalizeFirstLetter(str:string):string {
    return str.split(' ').map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(' ');
  }
}
