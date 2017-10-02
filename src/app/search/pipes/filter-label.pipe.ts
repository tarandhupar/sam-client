import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: "filterLabel"})
export class FilterParamLabel implements PipeTransform {

  transform(param: string): string {
    switch(param) {
      case "index": return "Domain";
      break;
      case "keyword": return "Keyword(s)";
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
      case "service": return "Domain";
        break;
      case "construction_type": return "Construction Type";
        break;
      default: return null;
    }

  }
}
