import { Pipe, PipeTransform } from '@angular/core';
import {FilterMultiArrayObjectPipe} from "../../app-pipes/filter-multi-array-object.pipe";
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import {FixHTMLPipe} from "./fix-html.pipe";
import  JsDiff = require('diff') ;



@Pipe({name: 'viewChanges'})
export class ViewChangesPipe implements PipeTransform {
  transform(previousOpportunity: any, currentOpportunity:any, dictionaries: any, currentOpportunityLocation:any, previousOpportunityLocation:any): any {
    //let jsDiff = new JsDiff();
    let filterMultiArrayObjectPipe = new FilterMultiArrayObjectPipe();
    let dateFormatPipe = new DateFormatPipe();
    let fixHtmlPipe = new FixHTMLPipe();
    let differences;
    let updateResponseDate = null;
    let currentUpdateResponseDate;
    let previousUpdateResponseDate;
    let archivingPolicy = null;
    let currentArchivingPolicy;
    let previousArchivingPolicy;
    let updateArchiveDate = null;
    let currentUpdateArchiveDate;
    let previousUpdateArchiveDate;
    let specialLegislation = null;
    let currentSpecialLegislation;
    let previousSpecialLegislation;
    let updateSetAside = null;
    let currentUpdateSetAside;
    let previousUpdateSetAside;
    let classificationCode = null;
    let currentClassificationCode;
    let previousClassificationCode;
    let naicsCode = null;
    let currentNaicsCode;
    let previousNaicsCode;
    let placeOfPerformance = null;
    let currentPlaceOfPerformanceStreet;
    let previousPlaceOfPerformanceStreet;
    let currentPlaceOfPerformanceCity;
    let previousPlaceOfPerformanceCity;
    let currentPlaceOfPerformanceState;
    let previousPlaceOfPerformanceState;
    let currentPlaceOfPerformanceZip;
    let previousPlaceOfPerformanceZip;
    let currentPlaceOfPerformanceCountry;
    let previousPlaceOfPerformanceCountry;
    let description = null;
    let currentDescription;
    let previousDescription;
    // let contractingOfficeAddress = null;
    // let currentContractingOfficeAddressStreet;
    // let previousContractingOfficeAddressStreet;
    // let currentContractingOfficeAddressCity;
    // let previousContractingOfficeAddressCity;
    // let currentContractingOfficeAddressState;
    // let previousContractingOfficeAddressState;
    // let currentContractingOfficeAddressZip;
    // let previousContractingOfficeAddressZip;
    // let currentContractingOfficeAddressCountry;
    // let previousContractingOfficeAddressCountry;
    // let primaryPointOfContact = null;
    // let currentPrimaryFullName;
    // let previousPrimaryFullName;
    // let currentPrimaryTitle;
    // let previousPrimaryTitle;
    // let currentPrimaryEmail;
    // let previousPrimaryEmail;
    // let currentPrimaryPhone;
    // let previousPrimaryPhone;
    // let currentPrimaryFax;
    // let previousPrimaryFax;
    // let secondaryPointOfContact = null;
    // let currentSecondaryFullName;
    // let previousSecondaryFullName;
    // let currentSecondaryTitle;
    // let previousSecondaryTitle;
    // let currentSecondaryEmail;
    // let previousSecondaryEmail;
    // let currentSecondaryPhone;
    // let previousSecondaryPhone;
    // let currentSecondaryFax;
    // let previousSecondaryFax;
    let postedDate = null;
    let changesExistGeneral = false;
    let changesExistSynopsis = false;

    //checks for Update Response Date
    if (currentOpportunity.data && currentOpportunity.data.solicitation && currentOpportunity.data.solicitation.deadlines && currentOpportunity.data.solicitation.deadlines.response){
      currentUpdateResponseDate = currentOpportunity.data.solicitation.deadlines.response;
    } else {
      currentUpdateResponseDate = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.solicitation && previousOpportunity.data.solicitation.deadlines && previousOpportunity.data.solicitation.deadlines.response){
      previousUpdateResponseDate = previousOpportunity.data.solicitation.deadlines.response;
    } else {
      previousUpdateResponseDate = null;
    }
    if (currentUpdateResponseDate != previousUpdateResponseDate && previousUpdateResponseDate == null){
      updateResponseDate = "New Data".italics();
    } else if (currentUpdateResponseDate != previousUpdateResponseDate && previousUpdateResponseDate != null){
      updateResponseDate = dateFormatPipe.transform(previousUpdateResponseDate, 'MMM DD, YYYY').strike();
    }


    ////checks for Archiving Policy
    if (currentOpportunity.data && currentOpportunity.data.archive && currentOpportunity.data.archive.type){
      currentArchivingPolicy = currentOpportunity.data.archive.type;
    } else {
      currentArchivingPolicy = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.archive && previousOpportunity.data.archive.type){
      previousArchivingPolicy = previousOpportunity.data.archive.type;
    } else {
      previousArchivingPolicy = null;
    }
    if (currentArchivingPolicy != previousArchivingPolicy && previousArchivingPolicy == null){
      archivingPolicy = "New Data".italics();
      changesExistGeneral = true;
    } else if (currentUpdateResponseDate != previousUpdateResponseDate && previousUpdateResponseDate != null){
      switch (previousArchivingPolicy){
        case "manual": {
          archivingPolicy = "Manual Archive".strike();
          break;
        }
        case "auto15": {
          archivingPolicy = "Automatic, 15 days after response date".strike();
          break;
        }
        case "autocustom": {
          archivingPolicy = "Automatic, on specified date".strike();
          break;
        }
      }
      changesExistGeneral = true;
    }

    //checks for Update Archive Date
    if (currentOpportunity.data && currentOpportunity.data.archive && currentOpportunity.data.archive.date){
      currentUpdateArchiveDate = currentOpportunity.data.archive.date;
    } else {
      currentUpdateArchiveDate = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.archive && previousOpportunity.data.archive.date){
      previousUpdateArchiveDate = previousOpportunity.data.archive.date;
    } else {
      previousUpdateArchiveDate = null;
    }
    if (currentUpdateArchiveDate != previousUpdateArchiveDate && previousUpdateArchiveDate == null){
      updateArchiveDate = "New Data".italics();
      changesExistGeneral = true;
    } else if (currentUpdateArchiveDate != previousUpdateArchiveDate && previousUpdateArchiveDate != null){
      updateArchiveDate = dateFormatPipe.transform(previousUpdateArchiveDate, 'MMM DD, YYYY').strike();
      changesExistGeneral = true;
    }


    //checks for special legislation
    if(currentOpportunity.data && currentOpportunity.data.isRecoveryRelated){
      currentSpecialLegislation = currentOpportunity.data.isRecoveryRelated;
    } else {
      currentSpecialLegislation = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.isRecoveryRelated){
      previousSpecialLegislation = previousOpportunity.data.isRecoveryRelated;
    } else {
      previousSpecialLegislation = null;
    }
    if (currentSpecialLegislation != previousSpecialLegislation && (previousSpecialLegislation == null || previousSpecialLegislation == false)){
      specialLegislation = "New Data".italics();
      changesExistGeneral = true;
    } else if (currentSpecialLegislation != previousSpecialLegislation && previousSpecialLegislation == true){
      specialLegislation = "Recovery and Reinvestment Act".strike();
      changesExistGeneral = true;
    }

    //Checks for Set Aside
    if(currentOpportunity.data  && currentOpportunity.data.solicitation && currentOpportunity.data.solicitation.setAside){
      currentUpdateSetAside = currentOpportunity.data.solicitation.setAside;
    } else {
      currentUpdateSetAside = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.solicitation && previousOpportunity.data.solicitation.setAside){
      previousUpdateSetAside = previousOpportunity.data.solicitation.setAside;
    } else {
      previousUpdateSetAside = null;
    }
    if (currentUpdateSetAside != previousUpdateSetAside && previousUpdateSetAside == null){
      updateSetAside = "New Data".italics();
      changesExistGeneral = true;
    } else if (currentUpdateSetAside != previousUpdateSetAside && previousUpdateSetAside != null){
      let result = filterMultiArrayObjectPipe.transform([previousUpdateSetAside], dictionaries.set_aside_type, 'element_id', false, "");
      updateSetAside = (result instanceof Array && result.length > 0) ? result[0].value.strike() : [];

      changesExistGeneral = true;
    }


    //Checks for Classification Code
    if (currentOpportunity.data  && currentOpportunity.data.classificationCode){
      currentClassificationCode = currentOpportunity.data.classificationCode;
    } else {
      currentClassificationCode = null;
    }
    if (previousOpportunity.data  && previousOpportunity.data.classificationCode){
      previousClassificationCode = previousOpportunity.data.classificationCode;
    } else {
      previousClassificationCode = null;
    }
    if (currentClassificationCode != previousClassificationCode && previousClassificationCode == null){
      classificationCode = "New Data".italics();
      changesExistGeneral = true;
    } else if (currentClassificationCode != previousClassificationCode && previousClassificationCode != null){
      let result = filterMultiArrayObjectPipe.transform([previousClassificationCode], dictionaries.classification_code, 'element_id', false, '');
      classificationCode = (result instanceof Array && result.length > 0) ? result[0].value.strike() : [];

      changesExistGeneral = true;
    }


    //Checks for Classification Code
    if (currentOpportunity.data  && currentOpportunity.data.naicsCode && currentOpportunity.data.naicsCode[0]){
      currentNaicsCode = currentOpportunity.data.naicsCode[0];
    } else {
      currentNaicsCode = null;
    }
    if (previousOpportunity.data  && previousOpportunity.data.naicsCode && previousOpportunity.data.naicsCode[0]){
      previousNaicsCode = previousOpportunity.data.naicsCode[0];
    } else {
      previousNaicsCode = null;
    }
    if (currentNaicsCode != previousNaicsCode && previousNaicsCode == null){
      naicsCode = "New Data".italics();
      changesExistGeneral = true;
    } else if (currentNaicsCode != previousNaicsCode && previousNaicsCode != null){
      let result = filterMultiArrayObjectPipe.transform([previousNaicsCode], dictionaries.naics_code, 'element_id', false, '')
      naicsCode =(result instanceof Array && result.length > 0) ? result[0].value.strike() : [];
      changesExistGeneral = true;
    }


    //checks for Place of Performance
    if (currentOpportunity.data && currentOpportunity.data.placeOfPerformance && currentOpportunity.data.placeOfPerformance.streetAddress){
      currentPlaceOfPerformanceStreet = currentOpportunity.data.placeOfPerformance.streetAddress;
    } else {
      currentPlaceOfPerformanceStreet = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.placeOfPerformance && previousOpportunity.data.placeOfPerformance.streetAddress){
      previousPlaceOfPerformanceStreet = previousOpportunity.data.placeOfPerformance.streetAddress;
    } else {
      previousPlaceOfPerformanceStreet = null;
    }
    if (currentOpportunity.data && currentOpportunity.data.placeOfPerformance && currentOpportunity.data.placeOfPerformance.city){
      currentPlaceOfPerformanceCity = currentOpportunity.data.placeOfPerformance.city;
    } else {
      currentPlaceOfPerformanceCity = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.placeOfPerformance && previousOpportunity.data.placeOfPerformance.city){
      previousPlaceOfPerformanceCity = previousOpportunity.data.placeOfPerformance.city;
    } else {
      previousPlaceOfPerformanceCity = null;
    }
    if (currentOpportunity.data && currentOpportunity.data.placeOfPerformance && currentOpportunity.data.placeOfPerformance.state){
      currentPlaceOfPerformanceState = currentOpportunity.data.placeOfPerformance.state;
    } else {
      currentPlaceOfPerformanceState = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.placeOfPerformance && previousOpportunity.data.placeOfPerformance.state){
      previousPlaceOfPerformanceState = previousOpportunity.data.placeOfPerformance.state;
    } else {
      previousPlaceOfPerformanceState = null;
    }
    if (currentOpportunity.data && currentOpportunity.data.placeOfPerformance && currentOpportunity.data.placeOfPerformance.zip){
      currentPlaceOfPerformanceZip = currentOpportunity.data.placeOfPerformance.zip;
    } else {
      currentPlaceOfPerformanceZip = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.placeOfPerformance && previousOpportunity.data.placeOfPerformance.zip){
      previousPlaceOfPerformanceZip = previousOpportunity.data.placeOfPerformance.zip;
    } else {
      previousPlaceOfPerformanceZip = null;
    }
    if (currentOpportunity.data && currentOpportunity.data.placeOfPerformance && currentOpportunity.data.placeOfPerformance.country){
      currentPlaceOfPerformanceCountry = currentOpportunity.data.placeOfPerformance.country;
    } else {
      currentPlaceOfPerformanceCountry = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.placeOfPerformance && previousOpportunity.data.placeOfPerformance.country){
      previousPlaceOfPerformanceCountry = previousOpportunity.data.placeOfPerformance.country;
    } else {
      previousPlaceOfPerformanceCountry = null;
    }
    if ((currentPlaceOfPerformanceStreet != previousPlaceOfPerformanceStreet || currentPlaceOfPerformanceCity != previousPlaceOfPerformanceCity || currentPlaceOfPerformanceState != previousPlaceOfPerformanceState || currentPlaceOfPerformanceCountry != previousPlaceOfPerformanceCountry || currentPlaceOfPerformanceZip != previousPlaceOfPerformanceZip) && (previousPlaceOfPerformanceStreet == null && previousPlaceOfPerformanceCity == null && previousPlaceOfPerformanceState == null && previousPlaceOfPerformanceZip == null && previousPlaceOfPerformanceCountry == null)){
      placeOfPerformance = "New Data".italics();
      changesExistGeneral = true;
    } else if (((currentPlaceOfPerformanceStreet != previousPlaceOfPerformanceStreet && previousPlaceOfPerformanceStreet != null) || (currentPlaceOfPerformanceCity != previousPlaceOfPerformanceCity && previousPlaceOfPerformanceCity != null) || (currentPlaceOfPerformanceState != previousPlaceOfPerformanceState && previousPlaceOfPerformanceState != null) || (currentPlaceOfPerformanceCountry != previousPlaceOfPerformanceCountry && previousPlaceOfPerformanceCountry != null) || currentPlaceOfPerformanceZip != previousPlaceOfPerformanceZip && previousPlaceOfPerformanceZip != null)){
      placeOfPerformance = ((previousPlaceOfPerformanceStreet ? previousPlaceOfPerformanceStreet : "") + " " + (previousPlaceOfPerformanceCity ? previousPlaceOfPerformanceCity : "") + " " + (previousPlaceOfPerformanceState ? previousPlaceOfPerformanceState : "") + " " + (previousPlaceOfPerformanceCountry ? previousPlaceOfPerformanceCountry : "") + " " + (previousPlaceOfPerformanceZip ? previousPlaceOfPerformanceZip : "")).strike();
      changesExistGeneral = true;
    }

    //checks for Description
    if (currentOpportunity.data && currentOpportunity.data.descriptions && currentOpportunity.data.descriptions[0] && currentOpportunity.data.descriptions[0].content){
      currentDescription = currentOpportunity.data.descriptions[0].content;
    } else {
      currentDescription = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.descriptions && previousOpportunity.data.descriptions[0] && previousOpportunity.data.descriptions[0].content){
      previousDescription = previousOpportunity.data.descriptions[0].content;
    } else {
      previousDescription = null;
    }
    if (currentDescription != previousDescription && previousDescription == null){
      description = "New Data".italics();
      changesExistSynopsis = true;
    } else if (currentDescription != previousDescription && previousDescription != null){
      //description = fixHtmlPipe.transform(previousDescription).strike();
      let diffString = JsDiff.diffChars(previousDescription, currentDescription);
      console.log("Diff String", diffString);
      let finalString = '';
      diffString.forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        console.log("part: ", part);
        var color = part.added ? 'green' :
          part.removed ? 'red' : 'grey';
        console.log("color: ", color);
        console.log("part value color,", part.value.fontcolor(color));
        finalString = finalString + part.value.fontcolor(color);
      });
      //console.log("description", color);
      description = finalString;
      //description = fixHtmlPipe.transform(previousDescription).strike();
      changesExistSynopsis = true;
    }

    //checks for Contracting Office Address
    // if(currentOpportunityLocation.street) {
    //   currentContractingOfficeAddressStreet = currentOpportunityLocation.street;
    // } else{
    //   currentContractingOfficeAddressStreet = null;
    // }
    // if(previousOpportunityLocation.street) {
    //   previousContractingOfficeAddressStreet = previousOpportunityLocation.street;
    // } else{
    //   previousContractingOfficeAddressStreet = null;
    // }
    // if(currentOpportunityLocation.city) {
    //   currentContractingOfficeAddressCity = currentOpportunityLocation.city;
    // } else{
    //   currentContractingOfficeAddressCity = null;
    // }
    // if(previousOpportunityLocation.city) {
    //   previousContractingOfficeAddressCity = previousOpportunityLocation.city;
    // } else{
    //   previousContractingOfficeAddressCity = null;
    // }
    // if(currentOpportunityLocation.state) {
    //   currentContractingOfficeAddressState = currentOpportunityLocation.state;
    // } else{
    //   currentContractingOfficeAddressState = null;
    // }
    // if(previousOpportunityLocation.state) {
    //   previousContractingOfficeAddressState = previousOpportunityLocation.state;
    // } else{
    //   previousContractingOfficeAddressState = null;
    // }
    // if(currentOpportunityLocation.country) {
    //   currentContractingOfficeAddressCountry = currentOpportunityLocation.country;
    // } else{
    //   currentContractingOfficeAddressCountry = null;
    // }
    // if(previousOpportunityLocation.country) {
    //   previousContractingOfficeAddressCountry = previousOpportunityLocation.country;
    // } else{
    //   previousContractingOfficeAddressCountry = null;
    // }
    // if(currentOpportunityLocation.zip) {
    //   currentContractingOfficeAddressZip = currentOpportunityLocation.zip;
    // } else{
    //   currentContractingOfficeAddressZip = null;
    // }
    // if(previousOpportunityLocation.zip) {
    //   previousContractingOfficeAddressZip = previousOpportunityLocation.zip;
    // } else{
    //   previousContractingOfficeAddressZip = null;
    // }
    // if ((currentContractingOfficeAddressStreet != previousContractingOfficeAddressStreet || currentContractingOfficeAddressCity != previousContractingOfficeAddressCity || currentContractingOfficeAddressState != previousContractingOfficeAddressState || currentContractingOfficeAddressCountry != previousContractingOfficeAddressCountry || currentContractingOfficeAddressZip != previousContractingOfficeAddressZip) && (previousContractingOfficeAddressStreet == null && previousContractingOfficeAddressCity == null && previousContractingOfficeAddressState == null && previousContractingOfficeAddressZip == null && previousContractingOfficeAddressCountry == null)){
    //   contractingOfficeAddress = "New Data".italics();
    //   changesExist = true;
    // } else if (((currentContractingOfficeAddressStreet != previousContractingOfficeAddressStreet && previousContractingOfficeAddressStreet != null) || (currentContractingOfficeAddressCity != previousContractingOfficeAddressCity && previousContractingOfficeAddressCity != null) || (currentContractingOfficeAddressState != previousContractingOfficeAddressState && previousContractingOfficeAddressState != null) || (currentContractingOfficeAddressCountry != previousContractingOfficeAddressCountry && previousContractingOfficeAddressCountry != null) || currentContractingOfficeAddressZip != previousContractingOfficeAddressZip && previousContractingOfficeAddressZip != null)){
    //   contractingOfficeAddress = ((previousContractingOfficeAddressStreet ? previousContractingOfficeAddressStreet : "") + " " + (previousContractingOfficeAddressCity ? previousContractingOfficeAddressCity : "") + " " + (previousContractingOfficeAddressState ? previousContractingOfficeAddressState : "") + " " + (previousContractingOfficeAddressCountry ? previousContractingOfficeAddressCountry : "") + " " + (previousContractingOfficeAddressZip ? previousContractingOfficeAddressZip : "")).strike();
    //   changesExist = true;
    // }
    //
    // //checks primary Contact
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].fullName){
    //   currentPrimaryFullName = previousOpportunity.data.pointOfContact[0].fullName;
    // } else {
    //   currentPrimaryFullName = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].fullName){
    //   previousPrimaryFullName = previousOpportunity.data.pointOfContact[0].fullName;
    // } else {
    //   previousPrimaryFullName = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].title){
    //   currentPrimaryTitle = previousOpportunity.data.pointOfContact[0].title;
    // } else {
    //   currentPrimaryTitle = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].title){
    //   previousPrimaryTitle = previousOpportunity.data.pointOfContact[0].title;
    // } else {
    //   previousPrimaryTitle = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].email){
    //   currentPrimaryEmail = previousOpportunity.data.pointOfContact[0].email;
    // } else {
    //   currentPrimaryEmail = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].email){
    //   previousPrimaryEmail = previousOpportunity.data.pointOfContact[0].email;
    // } else {
    //   previousPrimaryEmail = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].phone){
    //   currentPrimaryPhone = previousOpportunity.data.pointOfContact[0].phone;
    // } else {
    //   currentPrimaryPhone = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].phone){
    //   previousPrimaryPhone = previousOpportunity.data.pointOfContact[0].phone;
    // } else {
    //   previousPrimaryPhone = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].fax){
    //   currentPrimaryFax = previousOpportunity.data.pointOfContact[0].fax;
    // } else {
    //   currentPrimaryFax = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].fax){
    //   previousPrimaryFax = previousOpportunity.data.pointOfContact[0].fax;
    // } else {
    //   previousPrimaryFax = null;
    // }
    // if ((currentPrimaryFullName != previousPrimaryFullName || currentPrimaryTitle != previousPrimaryTitle || currentPrimaryEmail != previousPrimaryEmail || currentPrimaryPhone != previousPrimaryPhone || currentPrimaryFax != previousPrimaryFax) && (previousPrimaryFullName == null && previousPrimaryTitle == null && previousPrimaryEmail == null && previousPrimaryPhone == null && previousPrimaryFax == null)){
    //   contractingOfficeAddress = "New Data".italics();
    //   changesExist = true;
    // } else if (((currentPrimaryFullName != previousPrimaryFullName && previousPrimaryFullName != null) || (currentPrimaryTitle != previousPrimaryTitle && previousPrimaryTitle != null) || (currentPrimaryEmail != previousPrimaryEmail && previousPrimaryEmail != null) || (currentPrimaryPhone != previousPrimaryPhone && previousPrimaryPhone != null) || currentPrimaryFax != currentPrimaryFax && previousPrimaryFax != null)){
    //   contractingOfficeAddress = ((previousPrimaryFullName ? previousPrimaryFullName : "") + " " + (previousPrimaryTitle ? previousPrimaryTitle : "") + " " + (previousPrimaryEmail ? previousPrimaryEmail : "") + " " + (previousPrimaryPhone ? previousPrimaryPhone : "") + " " + (currentPrimaryFax ? currentPrimaryFax : "")).strike();
    //   changesExist = true;
    // }
    //
    // //checks Secondary Contact
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].fullName){
    //   currentSecondaryFullName = previousOpportunity.data.pointOfContact[1].fullName;
    // } else {
    //   currentSecondaryFullName = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].fullName){
    //   previousSecondaryFullName = previousOpportunity.data.pointOfContact[1].fullName;
    // } else {
    //   previousSecondaryFullName = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].title){
    //   currentSecondaryTitle = previousOpportunity.data.pointOfContact[1].title;
    // } else {
    //   currentSecondaryTitle = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].title){
    //   previousSecondaryTitle = previousOpportunity.data.pointOfContact[1].title;
    // } else {
    //   previousSecondaryTitle = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].email){
    //   currentSecondaryEmail = previousOpportunity.data.pointOfContact[1].email;
    // } else {
    //   currentSecondaryEmail = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].email){
    //   previousSecondaryEmail = previousOpportunity.data.pointOfContact[1].email;
    // } else {
    //   previousSecondaryEmail = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].phone){
    //   currentSecondaryPhone = previousOpportunity.data.pointOfContact[1].phone;
    // } else {
    //   currentSecondaryPhone = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].phone){
    //   previousSecondaryPhone = previousOpportunity.data.pointOfContact[1].phone;
    // } else {
    //   previousSecondaryPhone = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].fax){
    //   currentSecondaryFax = previousOpportunity.data.pointOfContact[1].fax;
    // } else {
    //   currentSecondaryFax = null;
    // }
    // if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].fax){
    //   previousSecondaryFax = previousOpportunity.data.pointOfContact[1].fax;
    // } else {
    //   previousSecondaryFax = null;
    // }
    // if ((currentSecondaryFullName != previousSecondaryFullName || currentSecondaryTitle != previousSecondaryTitle || currentSecondaryEmail != previousSecondaryEmail || currentSecondaryPhone != previousSecondaryPhone || currentSecondaryFax != previousSecondaryFax) && (previousSecondaryFullName == null && previousSecondaryTitle == null && previousSecondaryEmail == null && previousSecondaryPhone == null && previousSecondaryFax == null)){
    //   contractingOfficeAddress = "New Data".italics();
    //   changesExist = true;
    // } else if (((currentSecondaryFullName != previousSecondaryFullName && previousSecondaryFullName != null) || (currentSecondaryTitle != previousSecondaryTitle && previousSecondaryTitle != null) || (currentSecondaryEmail != previousSecondaryEmail && previousSecondaryEmail != null) || (currentSecondaryPhone != previousSecondaryPhone && previousSecondaryPhone != null) || currentSecondaryFax != currentSecondaryFax && previousSecondaryFax != null)){
    //   contractingOfficeAddress = ((previousSecondaryFullName ? previousSecondaryFullName : "") + " " + (previousSecondaryTitle ? previousSecondaryTitle : "") + " " + (previousSecondaryEmail ? previousSecondaryEmail : "") + " " + (previousSecondaryPhone ? previousSecondaryPhone : "") + " " + (currentSecondaryFax ? currentSecondaryFax : "")).strike();
    //   changesExist = true;
    // }

    //checks posted date
    postedDate = dateFormatPipe.transform(previousOpportunity.postedDate, 'MM/DD/YYYY h:mm a');

    differences = {
      changesExistGeneral: changesExistGeneral,
      changesExistSynopsis: changesExistSynopsis,
      updateResponseDate: updateResponseDate,
      archivingPolicy: archivingPolicy,
      updateArchiveDate: updateArchiveDate,
      specialLegislation: specialLegislation,
      updateSetAside: updateSetAside,
      classificationCode: classificationCode,
      naicsCode: naicsCode,
      placeOfPerformance: placeOfPerformance,
      description: description,
      // contractingOfficeAddress: contractingOfficeAddress,
      // primaryPointOfContact: primaryPointOfContact,
      // secondaryPointOfContact: secondaryPointOfContact,
      postedDate: postedDate
    };

    return differences;
  }
}

