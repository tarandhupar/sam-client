import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'authorization'})
export class AuthorizationPipe implements PipeTransform {
  sortBy: string = 'version';

  // TODO: Promote to its own file or pipe to make reusable labels.
  titleString: string = 'Title';
  partString: string = 'Part';
  sectionString: string = 'Section';
  executiveOrderString: string = 'Executive Order';
  pulicLawString: string = 'Public Law';
  statuteString: string = 'Statute';
  usCodeString: string = 'US Code';
  asAmendedByString: string = 'as amended by';

  transform(authorizations, args:string[]):any {

    //make sure sorted by version number
    authorizations = _.sortBy(authorizations, this.sortBy);

    // TODO, review implementation of string building of the the authorizations
    var title = [];
    _.forEach(authorizations, authorization => {

      // TODO: No test in the scpec for this...??
      // TODO: Would prefer the conditionals before the call be in the method;
      //       however, title.push is creating empty indeces within title
      if (authorization.version > 1) {
        title.push(this.getAmendedBy(authorization));
      }

      if (authorization.act != null) {
        title.push(this.getAuthorizationAct(authorization));
      }

      if (authorization.executiveOrder != null && authorization.executiveOrder.description) {
        title.push(this.getExecutiveOrder(authorization));
      }

      if (authorization.publicLaw != null) {
        title.push(this.getPublicLaw(authorization));
      }

      if (authorization.statute != null){
        title.push(this.getStatute(authorization));
      }

      if (authorization.USC != null){
        title.push(this.getUSCode(authorization));
      }
    });
    title = title.join(', ');
    return title;
  }

  private getAmendedBy(authorization) {
    return this.asAmendedByString;
  }

  private getAuthorizationAct(authorization) {
    var actText = [];
    if (authorization.act.description) {
      actText.push(authorization.act.description);
    }
    if (authorization.act.title) {
      actText.push(this.titleString + ' ' + authorization.act.title);
    }
    if (authorization.act.part) {
      actText.push(this.partString + ' ' + authorization.act.part);
    }
    if (authorization.act.section) {
      actText.push(this.sectionString + ' ' + authorization.act.section);
    }
    let actString = actText.join(', ');
    return actString;
  }

  private getExecutiveOrder(authorization)
  {
    return this.executiveOrderString + ' - ' + authorization.executiveOrder.description;
  }

  private getPublicLaw(authorization)
  {
    var lawText = [];
    if (authorization.publicLaw.congressCode) {
      lawText.push(this.pulicLawString + ' ' + authorization.publicLaw.congressCode);
    }
    if (authorization.publicLaw.number) {
      lawText.push(authorization.publicLaw.number);
    }
    let lawString = lawText.join('-');
    return lawString;
  }

  private getStatute(authorization)
  {
    var statuteText = [];
    if (authorization.statute.volume) {
      statuteText.push(this.statuteString + ' ' + authorization.statute.volume);
    }
    if (authorization.statute.page) {
      statuteText.push(authorization.statute.page);
    }
    let statuteString = statuteText.join('-');
    return statuteText;
  }

  private getUSCode(authorization)
  {
    var authorizationText = [];
    if (authorization.USC.title) {
      authorizationText.push(authorization.USC.title);
    }
    if (authorization.USC.section) {
      authorizationText.push(this.usCodeString + ' ' + authorization.USC.section);
    }
    let authorizationString = authorizationText.join(' ');
    return authorizationString;
  }
}
