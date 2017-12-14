import { Pipe, PipeTransform } from '@angular/core';
import {OpportunityFields} from "../opportunity.fields";


@Pipe({name: 'setDisplayFields'})
export class SetDisplayFields implements PipeTransform {
  transform(type: string, parent: any): any {
    let displayField = {}; // for safety, clear any existing values

    // if type is Update/Amendment then display like original type

    switch (type) {
      // These types are a superset of p/m/r/s, using case fallthrough
      case 'g': // Sale of Surplus Property
        displayField[OpportunityFields.Award] = false;
        break;

      case 'f': // Foreign Government Standard
        displayField[OpportunityFields.Award] = false;
        displayField[OpportunityFields.SpecialLegislation] = false;
        break;

        // These types are a superset of j, using case fallthrough
      case 'p': // Presolicitation
        displayField[OpportunityFields.Award] = false;
        break;

      case 'k': // Combined Synopsis/Solicitation
        displayField[OpportunityFields.AwardDate] = false;
        displayField[OpportunityFields.AwardedName] = false;
        displayField[OpportunityFields.AwardedDUNS] = false;
        displayField[OpportunityFields.AwardedAddress] = false;
        displayField[OpportunityFields.Contractor] = false;
        displayField[OpportunityFields.ContractorStreet] = false;
        displayField[OpportunityFields.ContractorCity] = false;
        displayField[OpportunityFields.ContractorState] = false;
        displayField[OpportunityFields.ContractorZip] = false;
        displayField[OpportunityFields.ContractorCountry] = false;
        displayField[OpportunityFields.OrderNumber] = false;
        break;

      case 'o': // Solicitation
        displayField[OpportunityFields.AwardDate] = false;
        displayField[OpportunityFields.AwardedName] = false;
        displayField[OpportunityFields.AwardedDUNS] = false;
        displayField[OpportunityFields.AwardedAddress] = false;
        displayField[OpportunityFields.Contractor] = false;
        displayField[OpportunityFields.ContractorStreet] = false;
        displayField[OpportunityFields.ContractorCity] = false;
        displayField[OpportunityFields.ContractorState] = false;
        displayField[OpportunityFields.ContractorZip] = false;
        displayField[OpportunityFields.ContractorCountry] = false;
        displayField[OpportunityFields.OrderNumber] = false;
        break;

      case 'r': // Sources Sought
        displayField[OpportunityFields.Award] = false;
        break;

      case 's': // Special Notice
        displayField[OpportunityFields.JustificationAuthority] = false;

        displayField[OpportunityFields.StatutoryAuthority] = false;
        displayField[OpportunityFields.ModificationNumber] = false;

        displayField[OpportunityFields.Contractor] = false;
        displayField[OpportunityFields.ContractorStreet] = false;
        displayField[OpportunityFields.ContractorCity] = false;
        displayField[OpportunityFields.ContractorState] = false;
        displayField[OpportunityFields.ContractorZip] = false;
        displayField[OpportunityFields.ContractorCountry] = false;
        displayField[OpportunityFields.AwardedAddress] = false;
        break;

      case 'j': // Justification and Approval (J&A)
        displayField[OpportunityFields.AwardAmount] = false;
        displayField[OpportunityFields.LineItemNumber] = false;
        displayField[OpportunityFields.AwardedName] = false;
        displayField[OpportunityFields.AwardedDUNS] = false;
        displayField[OpportunityFields.AwardedAddress] = false;
        displayField[OpportunityFields.Contractor] = false;

        displayField[OpportunityFields.JustificationAuthority] = false;
        displayField[OpportunityFields.OrderNumber] = false;
        break;

      // Type i is a superset of l, using case fallthrough
      case 'i': // Intent to Bundle Requirements (DoD-Funded)
        displayField[OpportunityFields.AwardDate] = false;
        displayField[OpportunityFields.JustificationAuthority] = false;
        displayField[OpportunityFields.ModificationNumber] = false;
        displayField[OpportunityFields.SpecialLegislation] = false;
        break;

      case 'l': // Fair Opportunity / Limited Sources Justification
        displayField[OpportunityFields.AwardAmount] = false;
        displayField[OpportunityFields.LineItemNumber] = false;
        displayField[OpportunityFields.AwardedName] = false;
        displayField[OpportunityFields.AwardedDUNS] = false;
        displayField[OpportunityFields.AwardedAddress] = false;
        displayField[OpportunityFields.Contractor] = false;
        displayField[OpportunityFields.StatutoryAuthority] = false;
        break;

      case 'a': // Award Notice
        displayField[OpportunityFields.ResponseDate] = false;
        displayField[OpportunityFields.StatutoryAuthority] = false;
        displayField[OpportunityFields.JustificationAuthority] = false;
        displayField[OpportunityFields.OrderNumber] = true;
        displayField[OpportunityFields.ModificationNumber] = false;
        displayField[OpportunityFields.AwardedAddress] = false;
        break;

      default:
        console.log('Error: Unknown opportunity type ');
        break;
    }

    if(parent == null) {
      displayField[OpportunityFields.PostedDate] = false;
      displayField[OpportunityFields.ResponseDate] = false;
      displayField[OpportunityFields.ArchiveDate] = false;
      displayField[OpportunityFields.SetAside] = false;
    }
    return displayField;
  }
}
