import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: "filterLabel"})
export class FilterParamLabel implements PipeTransform {
  
  cfdaStringMap;
  fboStringMap;
  wdStringMap;
  fpdsStringMap;
  
  constructor(){
    this.cfdaStringMap = new Map()
    .set(0, "Published Date")
    .set(1, "Modified Date");
    this.fboStringMap = new Map()
    .set(0, "Modified Date")
    .set(1, "Published Date")
    .set(2, "Response Date");
    this.wdStringMap = new Map()
    .set(0, "Modified Date");
    this.fpdsStringMap = new Map()
    .set(0, "Modified Date")
    .set(1, "Signed Date");
  }

  transform(param: string, dateFilterIndex: number): string {
    if(!dateFilterIndex){dateFilterIndex = 0};  

    switch(param) {
      case "index": return "Domain";
        break;
      case "keywords": return "Keyword(s)";
        break;
      case "is_active": return "Active Only?";
        break;
      case "organization_id": return "Organization";
        break;
      case "beneficiary_type": return "Beneficiaries";
        break;
      case "applicant_type": return "Applicant Types";
        break;
      case "assistance_type": return "Assistance Type";
        break;
      case "notice_type": return "Type of Notice";
        break;
      case "set_aside": return "Set Aside";
        break;
      case "duns": return "Entity name/UEI";
        break;
      case "naics": return "NAICS";
        break;
      case "psc": return "PSC";
        break;
      case "award_or_idv": return "Award or IDV";
        break;
      case "award_type": return "Award Type";
        break;
      case "contract_type": return "Contract Type";
        break;
      case "entity_type": return "Entity Type";
        break;
      case "wdType": return "WDOL Type";
        break;
      case "state": return "State";
        break;
      case "county": return "Counties";
        break;
      case "prevP": return "WD Previously Performed";
        break;
      case "is_standard": return "Standard WD";
        break;
      case "is_wd_even": return "WD Even";
        break;
      case "prevP": return "Previously Performed?";
        break;
      case "cba": return "Subject to CBA?";
        break;
      case "service": return "Service";
        break;
      case "construction_type": return "Construction Type";
        break;
      case "sort": return "Sort By";
        break;
      case "page": return "Page";
        break;
      case "date_rad_selection": return "Date Type";
        break;
      case "fbo_date_filter_model": 
        return this.fboStringMap.get(dateFilterIndex);
        break;
      case "cfda_date_filter_model": 
        return this.cfdaStringMap.get(dateFilterIndex);
        break;
      case "wd_date_filter_model": 
        return this.wdStringMap.get(dateFilterIndex);
        break;
      case "fpds_date_filter_model": 
        return this.fpdsStringMap.get(dateFilterIndex);
        break;
      case "date_filter_index": return "Date Filter Type";
        break;
      default: return param;
    }

  }
}
