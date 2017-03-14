import { Component } from "@angular/core";

@Component ({
  templateUrl: 'profile.template.html'
})
export class OrgDetailProfilePage {
  hierarchyList = ["Department", "Sub-tier Agency", "Office"];

  currentHierarchyType: string = "";

  departmentObj = {
    hierarchy: ["Department of Agriculture"],
    type: "Department",
    name: "Department of Agriculture",
    detail: [
      {description:"Department Name",value:"Department of Agriculture"},
      {description:"Description",value:"Lipsum Description..."},
      {description:"Shortname",value:"USDA"},
      {description:"Start Date",value:"02/14/2017"},
    ],
    codes: [{code:"TAS-2 code",value:"123-456"},{code:"TAS-3 code",value:"123-456"},{code:"CFDA code",value:"123-456"}]
  };

  agencyObj = {
    hierarchy: ["Department of Agriculture","Farm Service Agency"],
    type: "Sub-tier Agency",
    name: "Farm Service Agency",
    detail: [
      {description:"Sub-tier Agency Name",value:"Farm Service Agency"},
      {description:"Description",value:"Lipsum Description..."},
      {description:"Shortname",value:"FSA"},
      {description:"Start Date",value:"02/14/2017"},
    ],
    codes: [{code:"FPDS code",value:"123-456"},{code:"OMB code",value:"123-456"}]
  };

  officeObj = {
    hierarchy: ["Department of Agriculture","Farm Service Agency","Farm Supplies Management"],
    type: "Office",
    name: "Farm Supplies Management",
    detail: [
      {description:"Office Name",value:"Farm Supplies Management"},
      {description:"Description",value:"Lipsum Description..."},
      {description:"Shortname",value:"FSA"},
      {description:"Start Date",value:"02/14/2017"},
      {description:"Indicate Funding",value:"Funding/Award"}
    ],
    codes: [{code:"AAC code",value:"123-456"},{code:"FPDS code",value:"123-456"}],
    address: [
      {addressType:"Mailing Address",value:{street:"813 Rosewood Lane", city:"Washington", state:"DC", zip:20007}},
      {addressType:"Shipping Address",value:{street:"813 Rosewood Lane", city:"Washington", state:"DC", zip:20007}},
      {addressType:"Billing Address",value:{street:"813 Rosewood Lane", city:"Washington", state:"DC", zip:20007}},
    ]
  };

  detailObj = this.officeObj;

  constructor(){
    this.currentHierarchyType = this.detailObj.type;
  }

  isLastHierarchy(index):boolean{return index === this.detailObj.hierarchy.length-1}

  isNextLayerCreatable():boolean{
    let index = this.hierarchyList.indexOf(this.currentHierarchyType);
    return index < this.hierarchyList.length -1 && index !== -1;
  }

  getCreateButtonText():string{
    let index = this.hierarchyList.indexOf(this.currentHierarchyType);
    if( index < this.hierarchyList.length -1 && index !== -1){
      return this.hierarchyList[index+1];
    }
    return "";
  }

  getOrgDetail(hierarchyName){
    if(hierarchyName === "Department of Agriculture"){
      this.detailObj = this.departmentObj;
    }else if(hierarchyName === "Farm Service Agency"){
      this.detailObj = this.agencyObj;
    }else{
      this.detailObj = this.officeObj;
    }
    this.currentHierarchyType = this.detailObj.type;
  }

  onChangeOrgDetail(hierarchyName){
    if(hierarchyName !== this.detailObj.name){
      // make API call to get selected organization detail
      this.getOrgDetail(hierarchyName);
    }
  }
}
