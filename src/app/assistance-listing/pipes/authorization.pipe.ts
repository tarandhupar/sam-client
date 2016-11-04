import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'authorization'})
export class AuthorizationPipe implements PipeTransform {
  transform(aAuthorization, args:string[]):any {

    //make sure sorted by version number
    aAuthorization = _.sortBy(aAuthorization, 'version');

    // TODO, review implementation of string building of the the authorizations

    var title = '';
    _.forEach(aAuthorization, oAuthorization => {
      if (oAuthorization.version > 1) {
        title = title.concat(", as amended by ");
      }
      if (oAuthorization.act != null){
        title = title + (oAuthorization.act.description ? (oAuthorization.act.description) : "") + (oAuthorization.act.title ? (", Title " + oAuthorization.act.title) : "") + (oAuthorization.act.part ? (", Part " + oAuthorization.act.part) : "") + (oAuthorization.act.section ? (", Section " + oAuthorization.act.section) : "") + ", ";
      }
      if (oAuthorization.executiveOrder != null){
        title = title + "Executive Order - " + ( oAuthorization.executiveOrder.description ? oAuthorization.executiveOrder.description : "") + ", ";
      }
      if (oAuthorization.publicLaw != null){
        title = title + (oAuthorization.publicLaw ? ("Public Law " + (oAuthorization.publicLaw.congressCode || "")) : "") + "-" + (oAuthorization.publicLaw ? (oAuthorization.publicLaw.number || "") : "") + ", ";
      }
      if (oAuthorization.statute != null){
        title = title + (oAuthorization.statute.volume ? ("Statute " + (oAuthorization.statute.volume)) : "") + "-" + (oAuthorization.statute.page ? (oAuthorization.statute.page) : "") + ", ";
      }
      if (oAuthorization.USC != null){
        title = title + (oAuthorization.USC.title ? (oAuthorization.USC.title) : "") + " US Code " + (oAuthorization.USC.section ? (oAuthorization.USC.section) : "") + ", ";
      }
    });
    title = title.slice(0, -2);
    return title;
  }
}
