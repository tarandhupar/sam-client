import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: "filterValue"})
export class FilterParamValue implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case "true": return "Yes";
        break;
      case "false": return "No";
        break;
      case "ent": return "Registration";
       break;
      case "ex": return "Exclusion";
        break;
      case "ent,ex": return "Registration, Exclusion";
        break;
      case "-title": return "Title(Desc)";
       break;
      case "title": return "Title(Asc)";
       break;
      case "-modifiedDate": return "Date Modified(Desc)";
        break;
      case "modifiedDate": return "Date Modified(Asc)";
        break;
      case "-relevance": return "Relevance(Desc)";
        break;
      case "relevance": return "Relevance(Asc)";
        break;
      default: return value;
    }

  }
}
