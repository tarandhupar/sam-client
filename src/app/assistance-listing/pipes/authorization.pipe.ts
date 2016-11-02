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
        title = title + (oAuthorization.act ? (oAuthorization.act.description || "") : "") + ", Title " + (oAuthorization.act ? (oAuthorization.act.title || "N/A") : "N/A") + ", Part " + (oAuthorization.act ? (oAuthorization.act.part || "N/A") : "N/A") + ", Section " + (oAuthorization.act ? (oAuthorization.act.section || "N/A") : "N/A") + "\n";
      }
      if (oAuthorization.executiveOrder != null){
        title = title + "Executive Order - " + ( oAuthorization.executiveOrder ? oAuthorization.executiveOrder.description : "N/A") + "\n";
      }
      if (oAuthorization.publicLaw != null){
        title = title + (oAuthorization.publicLaw ? ("Public Law " + (oAuthorization.publicLaw.congressCode || "")) : "") + "- " + (oAuthorization.publicLaw ? (oAuthorization.publicLaw.number || "N/A") : "N/A") + "\n";
      }
      if (oAuthorization.statute != null){
        title = title + (oAuthorization.statute ? ("Statute " + (oAuthorization.statute.volume || "")) : "") + "-" + (oAuthorization.statute ? (oAuthorization.statute.page || "N/A") : "N/A") + "\n";
      }
      if (oAuthorization.USC != null){
        title = title + (oAuthorization.USC ? (oAuthorization.USC.title || "") : "") + " US Code " + (oAuthorization.USC ? (oAuthorization.USC.section || "") : "") + "\n";
      }
    });
    return title;
  }
}
