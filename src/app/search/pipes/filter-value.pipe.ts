import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import moment = require("moment");

@Pipe({name: "filterValue"})
export class FilterParamValue implements PipeTransform {

  cfdaStringMap;
  fboStringMap;
  wdStringMap;
  fpdsStringMap;
  
  constructor(private datePipe: DatePipe){
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

  transform(value: string, paramLabel: string, data: {}): string {
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
      case "prevPerfYesLocality": return "Yes, in the same Locality"
        break;
      case "prevPerfYesDifferentLocality": return "Yes, but in different Locality"
        break;
      case "prevPerfNo": return "No, not performed before"
        break;
      case "yesNSS": return "Yes"
        break;
      case "dateRange": return "Date Range"
        break;
      case "date": return "Date"
        break;
      

      default: return this.determineReturnValue(value,paramLabel,data);
    }

  }

  // This function checks for any special cases of data formatting required and completes it, if no requirement is found the provided value is returned
  determineReturnValue(value: string, paramLabel: string, data: {}): string {
    //**DATE**
    // determine if date or dateRange exists
    if(value.search("\"date\":") >= 0 || value.search("\"dateRange\":") >= 0){
      // use json.parse to convert string back into an array of objects
      let tempArr = JSON.parse(value);
      let tempIndex = data['parameters']['date_filter_index'] ? data['parameters']['date_filter_index'] : 0;
      let tempRadSelection = data['parameters']['date_rad_selection'] ? data['parameters']['date_rad_selection'] : 'date';
      
      // use date filter index to pull out the only date we want and convert date to readable format
      // if dateRange
      if(tempRadSelection === 'dateRange'){
        // dateRange with time
        if(tempArr[tempIndex][tempRadSelection].hasOwnProperty('startTime')){
          let startDate = tempArr[tempIndex][tempRadSelection]['startDate'];
          let endDate = tempArr[tempIndex][tempRadSelection]['endDate'];
          let startTime = tempArr[tempIndex][tempRadSelection]['startTime'];
          let endTime = tempArr[tempIndex][tempRadSelection]['endTime'];
          let returnDate = "From: " + startDate + " To: " + endDate;
          // append date together into a format that date pipe can accept
          let fromTempMoment = moment(startDate + "T" + startTime + ":00");
          let toTempMoment = moment(endDate + "T" + endTime + ":00");
          let returnFrom = this.datePipe.transform(fromTempMoment, 'MMM dd, y h:mm a');
          let returnTo = this.datePipe.transform(toTempMoment, 'MMM dd, y h:mm a');
          return returnFrom + " - " + returnTo;
        }
        // dateRange without time
        else{
          let startDate = tempArr[tempIndex][tempRadSelection]['startDate'];
          let endDate = tempArr[tempIndex][tempRadSelection]['endDate'];
          let fromTempMoment = moment(startDate);
          let toTempMoment = moment(endDate);
          let returnFrom = this.datePipe.transform(fromTempMoment, 'MMM dd, y');
          let returnTo = this.datePipe.transform(toTempMoment, 'MMM dd, y');
          let returnDate = returnFrom + " - " + returnTo;
          return returnDate;
        }
      }
      // if date
      else{
        let returnDate = tempArr[tempIndex][tempRadSelection];
        let tempMoment = moment(returnDate);
        let returnMoment = this.datePipe.transform(tempMoment, 'MMM dd, y');
        return returnMoment;
      }
    }
    return value;
  }
}
