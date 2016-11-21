import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'noticeTypeLabel'})
export class OpportunityTypeLabelPipe implements PipeTransform {
  transform(opportunityType: string): string {
    let label = '';
    switch (opportunityType) {
      case 'p':
        label = 'Presolicitation';
        break;
      case 'a':
        label = 'Award Notice';
        break;
      case 'm':
        label = 'Modification/Amendment/Cancel';
        break;
      case 'r':
        label = 'Sources Sought';
        break;
      case 's':
        label = 'Special Notice';
        break;
      case 'f':
        label = 'Foreign Government Standard';
        break;
      case 'g':
        label = 'Sale of Surplus Property';
        break;
      case 'k':
        label = 'Combined Synopsis/Solicitation';
        break;
      case 'j':
        label = 'Justification and Approval (J&A)';
        break;
      case 'i':
        label = 'Intent to Bundle Requirements (DoD-Funded)';
        break;
      case 'l':
        label = 'Fair Opportunity / Limited Sources Justification';
        break;
    }

    return label;
  }
}

