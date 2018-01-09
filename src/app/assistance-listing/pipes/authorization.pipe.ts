import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'authorization'})
export class AuthorizationPipe implements PipeTransform {
  //SAM-9136: Remove sort by `version` field is removed, use `parentAuthorizationId` instead
  sortBy: string = 'parentAuthorizationId';

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

    //make sure sorted by parentAuthorizationId null first to be shown first them rest is amended by
    authorizations = _.sortBy(authorizations, this.sortBy).reverse();

    // TODO, review implementation of string building of the the authorizations
    var title = [];
    _.forEach(authorizations, authorization => {

      // TODO: No test in the scpec for this...??
      // TODO: Would prefer the conditionals before the call be in the method;
      //       however, title.push is creating empty indeces within title
      //`version` field is remove, based on condition, we're checking if it has parent (amended by)
      //if (authorization.version > 1) {
      if (authorization.parentAuthorizationId != null && authorization.parentAuthorizationId != "") {
        title.push(this.getAmendedBy(authorization));
      }

      if (authorization.act != null && authorization.authorizationTypes.act) {
        title.push(this.getAuthorizationAct(authorization));
      }

      if (authorization.executiveOrder != null && authorization.authorizationTypes.executiveOrder) {
        title.push(this.getExecutiveOrder(authorization));
      }

      if (authorization.publicLaw != null && authorization.authorizationTypes.publicLaw) {
        title.push(this.getPublicLaw(authorization));
      }

      if (authorization.statute != null && authorization.authorizationTypes.statute){
        title.push(this.getStatute(authorization));
      }

      if (authorization.USC != null && authorization.authorizationTypes.USC){
        title.push(this.getUSCode(authorization));
      }
    });
    return title.join(', ');
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
    var eoText = [];
    if (authorization.executiveOrder.description) {
      eoText.push(authorization.executiveOrder.description);
    }
    if (authorization.executiveOrder.title) {
      eoText.push(this.titleString + ' ' + authorization.executiveOrder.title);
    }
    if (authorization.executiveOrder.part) {
      eoText.push(this.partString + ' ' + authorization.executiveOrder.part);
    }
    if (authorization.executiveOrder.section) {
      eoText.push(this.sectionString + ' ' + authorization.executiveOrder.section);
    }
    let actString = eoText.join(', ');
    return actString;
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
