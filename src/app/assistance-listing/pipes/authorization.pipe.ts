import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'authorization'})
export class AuthorizationPipe implements PipeTransform {
  transform(authorizations, args:string[]):any {

    //make sure sorted by version number
    authorizations = _.sortBy(authorizations, 'version');

    // TODO, review implementation of string building of the the authorizations
    var title = [];
    _.forEach(authorizations, authorization => {

      // TODO: No test in the scpec for this
      // could be its own method call
      if (authorization.version > 1) {
        title.push("as amended by ");
      }

      // could be its own method call
      if (authorization.act != null) {
        var actText = [];
        if (authorization.act.description) {
          actText.push(authorization.act.description);
        }
        if (authorization.act.title) {
          actText.push('Title ' + authorization.act.title);
        }
        if (authorization.act.part) {
          actText.push('Part ' + authorization.act.part);
        }
        if (authorization.act.section) {
          actText.push('Section ' + authorization.act.section);
        }
        let actString = actText.join(', ');
        title.push(actString);
      }

      // could be its own method
      if (authorization.executiveOrder != null && authorization.executiveOrder.description) {
        title.push('Executive Order - ' + authorization.executiveOrder.description);
      }

      // could be its own method
      if (authorization.publicLaw != null) {
        var lawText = [];
        if (authorization.publicLaw.congressCode) {
          lawText.push('Public Law ' + authorization.publicLaw.congressCode);
        }
        if (authorization.publicLaw.number) {
          lawText.push(authorization.publicLaw.number);
        }
        let lawString = lawText.join('-');
        title.push(lawString);
      }

      // could be its own method
      if (authorization.statute != null){
        var statuteText = [];
        if (authorization.statute.volume) {
          statuteText.push('Statute ' + authorization.statute.volume);
        }
        if (authorization.statute.page) {
          statuteText.push(authorization.statute.page);
        }
        let statuteString = statuteText.join('-');
        title.push(statuteText);
      }

      // could be its own method
      if (authorization.USC != null){
        var authorizationText = [];
        if (authorization.USC.title) {
          authorizationText.push(authorization.USC.title);
        }
        if (authorization.USC.section) {
          authorizationText.push('US Code ' + authorization.USC.section);
        }
        let authorizationString = authorizationText.join(' ');
        title.push(authorizationString);
      }
    });
    title = title.join(', ');
    // title = title.slice(0, -2);
    return title;
  }

  getAmendedBy(authorization) {

  }
}
