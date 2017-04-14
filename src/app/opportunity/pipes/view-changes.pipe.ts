import { Pipe, PipeTransform } from '@angular/core';
import {FilterMultiArrayObjectPipe} from "../../app-pipes/filter-multi-array-object.pipe";
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import {FixHTMLPipe} from "./fix-html.pipe";
import DiffMatchPatch = require('diff-match-patch');
import * as _ from 'lodash';
import * as moment from 'moment/moment';




@Pipe({name: 'viewChanges'})
export class ViewChangesPipe implements PipeTransform {
  transform(previousOpportunity: any, currentOpportunity:any, dictionaries: any, currentOpportunityLocation:any, previousOpportunityLocation:any): any {
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
    let contractingOfficeAddress = null;
    let currentContractingOfficeAddressStreet;
    let previousContractingOfficeAddressStreet;
    let currentContractingOfficeAddressCity;
    let previousContractingOfficeAddressCity;
    let currentContractingOfficeAddressState;
    let previousContractingOfficeAddressState;
    let currentContractingOfficeAddressZip;
    let previousContractingOfficeAddressZip;
    let currentContractingOfficeAddressCountry;
    let previousContractingOfficeAddressCountry;
    let primaryPointOfContact = false;
    let secondaryPointOfContact = false;
    let primaryFullName = null;
    let currentPrimaryFullName;
    let previousPrimaryFullName;
    let primaryTitle = null;
    let currentPrimaryTitle;
    let previousPrimaryTitle;
    let primaryEmail = null;
    let currentPrimaryEmail;
    let previousPrimaryEmail;
    let primaryPhone = null;
    let currentPrimaryPhone;
    let previousPrimaryPhone;
    let primaryFax = null;
    let currentPrimaryFax;
    let previousPrimaryFax;
    let secondaryFullName = null;
    let currentSecondaryFullName;
    let previousSecondaryFullName;
    let secondaryTitle = null;
    let currentSecondaryTitle;
    let previousSecondaryTitle;
    let secondaryEmail = null;
    let currentSecondaryEmail;
    let previousSecondaryEmail;
    let secondaryPhone = null;
    let currentSecondaryPhone;
    let previousSecondaryPhone;
    let secondaryFax = null;
    let currentSecondaryFax;
    let previousSecondaryFax;
    let postedDate = null;
    let awardDate = null;
    let currentAwardDate;
    let previousAwardDate;
    let awardNumber = null;
    let currentAwardNumber;
    let previousAwardNumber;
    let orderNumber = null;
    let currentOrderNumber;
    let previousOrderNumber;
    let awardedDuns = null;
    let currentAwardedDuns;
    let previousAwardedDuns;
    let awardedName;
    let currentAwardedName;
    let previousAwardedName = null;
    let awardedAddress = null;
    let currentAwardedAddressStreet;
    let previousAwardedAddressStreet;
    let currentAwardedAddressCity;
    let previousAwardedAddressCity;
    let currentAwardedAddressState;
    let previousAwardedAddressState;
    let currentAwardedAddressZip;
    let previousAwardedAddressZip;
    let currentAwardedAddressCountry;
    let previousAwardedAddressCountry;
    let awardAmount = null;
    let currentAwardAmount;
    let previousAwardAmount;
    let lineItemNumber = null;
    let currentLineItemNumber;
    let previousLineItemNumber;
    let changesExistGeneral = false;
    let changesExistSynopsis = false;
    let changesExistClassification = false;
    let changesExistContactInformation = false;
    let changesExistAwardDetails = false;
    let descriptionAria = null;
    let updateResponseDateAria = null;
    let archivingPolicyAria = null;
    let updateArchiveDateAria = null;
    let specialLegislationAria = null;
    let updateSetAsideAria = null;
    let classificationCodeAria = null;
    let naicsCodeAria = null;
    let placeOfPerformanceAria = null;
    let contractingOfficeAddressAria = null;
    let primaryFullNameAria = null;
    let primaryTitleAria = null;
    let primaryEmailAria = null;
    let primaryPhoneAria = null;
    let primaryFaxAria = null;
    let secondaryFullNameAria = null;
    let secondaryTitleAria = null;
    let secondaryEmailAria = null;
    let secondaryPhoneAria = null;
    let secondaryFaxAria = null;
    let awardDateAria = null;
    let awardNumberAria = null;
    let awardedDunsAria = null;
    let orderNumberAria = null;
    let awardedNameAria = null;
    let awardedAddressAria = null;
    let awardAmountAria = null;
    let lineItemNumberAria = null;

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
    if (currentUpdateResponseDate != null && previousUpdateResponseDate == null){
      updateResponseDate = "New Data".italics().fontcolor("003264");
      changesExistGeneral = true;
    } else if (previousUpdateResponseDate != null && currentUpdateResponseDate == null){
      let updateResponseDateNoStrike = dateFormatPipe.transform(previousUpdateResponseDate, 'MMM DD, YYYY');
      updateResponseDate = updateResponseDateNoStrike.strike();
      updateResponseDateAria = "Previous Update Response Date is " + updateResponseDateNoStrike;
      changesExistGeneral = true;
    } else if (previousUpdateResponseDate != null && currentUpdateResponseDate != null) {
      if (moment(currentUpdateResponseDate).format('YYYY-MM-DD') != moment(previousUpdateResponseDate).format('YYYY-MM-DD')){
        let updateResponseDateNoStrike = dateFormatPipe.transform(previousUpdateResponseDate, 'MMM DD, YYYY');
        updateResponseDate = updateResponseDateNoStrike.strike();
        updateResponseDateAria = "Previous Update Response Date is " + updateResponseDateNoStrike;
        changesExistGeneral = true;
      }
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
      archivingPolicy = "New Data".italics().fontcolor("003264");
      changesExistGeneral = true;
    } else if (currentArchivingPolicy != previousArchivingPolicy && previousArchivingPolicy != null){
      switch (previousArchivingPolicy){
        case "manual": {
          archivingPolicy = "Manual Archive".strike();
          archivingPolicyAria = "Previous Archiving Policy is Manual Archive";
          break;
        }
        case "auto15": {
          archivingPolicy = "Automatic, 15 days after response date".strike();
          archivingPolicyAria = "Previous Archiving Policy is Automatic, 15 days after response date";
          break;
        }
        case "autocustom": {
          archivingPolicy = "Automatic, on specified date".strike();
          archivingPolicyAria = "Previous Archiving Policy is Automatic, on specified date";
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

    if (currentUpdateArchiveDate != null && previousUpdateArchiveDate == null){
      updateArchiveDate = "New Data".italics().fontcolor("003264");
      changesExistGeneral = true;
    } else if (previousUpdateArchiveDate != null && currentUpdateArchiveDate == null){
      let updateArchiveDateNoStrike = dateFormatPipe.transform(previousUpdateArchiveDate, 'MMM DD, YYYY')
      updateArchiveDate = updateArchiveDateNoStrike.strike();
      updateArchiveDateAria = "Previous Update Archive Date is " + updateArchiveDateNoStrike;
      changesExistGeneral = true;
    } else if (previousUpdateArchiveDate != null && currentUpdateArchiveDate != null) {
      if (moment(currentUpdateArchiveDate).format('YYYY-MM-DD') != moment(previousUpdateArchiveDate).format('YYYY-MM-DD')){
        let updateArchiveDateNoStrike = dateFormatPipe.transform(previousUpdateArchiveDate, 'MMM DD, YYYY');
        updateArchiveDate = updateArchiveDateNoStrike.strike();
        updateArchiveDateAria = "Previous Update Archive Date is " + updateArchiveDateNoStrike;
        changesExistGeneral = true;
      }
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
      specialLegislation = "New Data".italics().fontcolor("003264");
      changesExistGeneral = true;
    } else if (currentSpecialLegislation != previousSpecialLegislation && previousSpecialLegislation == true){
      specialLegislation = "Recovery and Reinvestment Act".strike();
      specialLegislationAria = "Previous Special Legislation is Recovery and Reinvestment Act";
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
      updateSetAside = "New Data".italics().fontcolor("003264");
      changesExistClassification = true;
    } else if (currentUpdateSetAside != previousUpdateSetAside && previousUpdateSetAside != null){
      let result = filterMultiArrayObjectPipe.transform([previousUpdateSetAside], this.findDictionary('set_aside_type', dictionaries), 'elementId', false, "");
      updateSetAside = (result instanceof Array && result.length > 0) ? result[0].value.strike() : [];
      let updateSetAsideAriaIncomplete = (result instanceof Array && result.length > 0) ? result[0].value : [];
      updateSetAsideAria = "Previous Update Set Aside is " + updateSetAsideAriaIncomplete;
      changesExistClassification = true;
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
      classificationCode = "New Data".italics().fontcolor("003264");
      changesExistClassification = true;
    } else if (currentClassificationCode != previousClassificationCode && previousClassificationCode != null){
      let result = filterMultiArrayObjectPipe.transform([previousClassificationCode], this.findDictionary('classification_code', dictionaries), 'elementId', false, '');
      classificationCode = (result instanceof Array && result.length > 0) ? result[0].value.strike() : [];
      let classificationCodeAriaIncomplete = (result instanceof Array && result.length > 0) ? result[0].value : [];
      classificationCodeAria = "Previous Classification Code is " + classificationCodeAriaIncomplete;
      changesExistClassification = true;
    }


    //Checks for Naics Code
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
      naicsCode = "New Data".italics().fontcolor("003264");
      changesExistClassification = true;
    } else if (currentNaicsCode != previousNaicsCode && previousNaicsCode != null){
      let result = filterMultiArrayObjectPipe.transform([previousNaicsCode], this.findDictionary('naics_code', dictionaries), 'elementId', false, '');
      naicsCode =(result instanceof Array && result.length > 0) ? result[0].value.strike() : [];
      let naicsCodeAriaIncomplete = (result instanceof Array && result.length > 0) ? result[0].value : [];
      naicsCodeAria = "Previous NAICS Code is " + naicsCodeAriaIncomplete;
      changesExistClassification = true;
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
      placeOfPerformance = "New Data".italics().fontcolor("003264");
      changesExistClassification = true;
    } else if (((currentPlaceOfPerformanceStreet != previousPlaceOfPerformanceStreet && previousPlaceOfPerformanceStreet != null) || (currentPlaceOfPerformanceCity != previousPlaceOfPerformanceCity && previousPlaceOfPerformanceCity != null) || (currentPlaceOfPerformanceState != previousPlaceOfPerformanceState && previousPlaceOfPerformanceState != null) || (currentPlaceOfPerformanceCountry != previousPlaceOfPerformanceCountry && previousPlaceOfPerformanceCountry != null) || currentPlaceOfPerformanceZip != previousPlaceOfPerformanceZip && previousPlaceOfPerformanceZip != null)){
      let placeOfPerformanceNoStrike = ((previousPlaceOfPerformanceStreet ? previousPlaceOfPerformanceStreet : "") + " " + (previousPlaceOfPerformanceCity ? previousPlaceOfPerformanceCity + "," : "") + " " + (previousPlaceOfPerformanceState ? previousPlaceOfPerformanceState : "") + " " + (previousPlaceOfPerformanceCountry ? previousPlaceOfPerformanceCountry : "") + " " + (previousPlaceOfPerformanceZip ? previousPlaceOfPerformanceZip : ""));
      placeOfPerformance = placeOfPerformanceNoStrike.strike();
      placeOfPerformanceAria = "Previous Place of Performance is " + placeOfPerformanceNoStrike;
      changesExistClassification = true;
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
      description = currentDescription + "<span>" + "New Data".italics().fontcolor("003264") + "</span>";
      changesExistSynopsis = true;
    } else if (currentDescription != previousDescription && previousDescription != null){
      if (currentDescription == null) {
        currentDescription = "";
      }
      let finalString = '';
      let diff = new DiffMatchPatch();
      let diffString = diff.diff_main(previousDescription, currentDescription);
      let m = diff.diff_cleanupSemantic(diffString);
      diffString.forEach(function(part){
        if (part[0] == 1){
          part[1] = "<u>" + part[1].toString() +"</u>";
        } else if (part[0] == -1){
          part[1] = part[1].toString().strike();
        }
        finalString = finalString + part[1];
      });
      description = finalString;
      descriptionAria = "Previous Description is " + previousDescription + " Current Description is " + currentDescription;
      changesExistSynopsis = true;
    }

    //checks for Contracting Office Address
    if(currentOpportunityLocation && currentOpportunityLocation.street) {
      currentContractingOfficeAddressStreet = currentOpportunityLocation.street;
    } else{
      currentContractingOfficeAddressStreet = null;
    }
    if(previousOpportunityLocation && previousOpportunityLocation.street) {
      previousContractingOfficeAddressStreet = previousOpportunityLocation.street;
    } else{
      previousContractingOfficeAddressStreet = null;
    }
    if(currentOpportunityLocation && currentOpportunityLocation.city) {
      currentContractingOfficeAddressCity = currentOpportunityLocation.city;
    } else{
      currentContractingOfficeAddressCity = null;
    }
    if(previousOpportunityLocation && previousOpportunityLocation.city) {
      previousContractingOfficeAddressCity = previousOpportunityLocation.city;
    } else{
      previousContractingOfficeAddressCity = null;
    }
    if(currentOpportunityLocation && currentOpportunityLocation.state) {
      currentContractingOfficeAddressState = currentOpportunityLocation.state;
    } else{
      currentContractingOfficeAddressState = null;
    }
    if(previousOpportunityLocation && previousOpportunityLocation.state) {
      previousContractingOfficeAddressState = previousOpportunityLocation.state;
    } else{
      previousContractingOfficeAddressState = null;
    }
    if(currentOpportunityLocation && currentOpportunityLocation.country) {
      currentContractingOfficeAddressCountry = currentOpportunityLocation.country;
    } else{
      currentContractingOfficeAddressCountry = null;
    }
    if(previousOpportunityLocation && previousOpportunityLocation.country) {
      previousContractingOfficeAddressCountry = previousOpportunityLocation.country;
    } else{
      previousContractingOfficeAddressCountry = null;
    }
    if(currentOpportunityLocation && currentOpportunityLocation.zip) {
      currentContractingOfficeAddressZip = currentOpportunityLocation.zip;
    } else{
      currentContractingOfficeAddressZip = null;
    }
    if(previousOpportunityLocation && previousOpportunityLocation.zip) {
      previousContractingOfficeAddressZip = previousOpportunityLocation.zip;
    } else{
      previousContractingOfficeAddressZip = null;
    }
    if ((currentContractingOfficeAddressStreet != previousContractingOfficeAddressStreet || currentContractingOfficeAddressCity != previousContractingOfficeAddressCity || currentContractingOfficeAddressState != previousContractingOfficeAddressState || currentContractingOfficeAddressCountry != previousContractingOfficeAddressCountry || currentContractingOfficeAddressZip != previousContractingOfficeAddressZip) && (previousContractingOfficeAddressStreet == null && previousContractingOfficeAddressCity == null && previousContractingOfficeAddressState == null && previousContractingOfficeAddressZip == null && previousContractingOfficeAddressCountry == null)){
      contractingOfficeAddress = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
    } else if (((currentContractingOfficeAddressStreet != previousContractingOfficeAddressStreet && previousContractingOfficeAddressStreet != null) || (currentContractingOfficeAddressCity != previousContractingOfficeAddressCity && previousContractingOfficeAddressCity != null) || (currentContractingOfficeAddressState != previousContractingOfficeAddressState && previousContractingOfficeAddressState != null) || (currentContractingOfficeAddressCountry != previousContractingOfficeAddressCountry && previousContractingOfficeAddressCountry != null) || currentContractingOfficeAddressZip != previousContractingOfficeAddressZip && previousContractingOfficeAddressZip != null)){
      let contractingOfficeAddressNoStrike = ((previousContractingOfficeAddressStreet ? previousContractingOfficeAddressStreet : "") + " " + (previousContractingOfficeAddressCity ? previousContractingOfficeAddressCity + "," : "") + " " + (previousContractingOfficeAddressState ? previousContractingOfficeAddressState : "") + " " + (previousContractingOfficeAddressCountry ? previousContractingOfficeAddressCountry : "") + " " + (previousContractingOfficeAddressZip ? previousContractingOfficeAddressZip : ""));
      contractingOfficeAddress = contractingOfficeAddressNoStrike.strike();
      contractingOfficeAddressAria = "Previous Contracting Office Address is " + contractingOfficeAddressNoStrike;
      changesExistContactInformation = true;
    }

    //checks primary Contact

    //primary full name
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[0].fullName){
      currentPrimaryFullName = currentOpportunity.data.pointOfContact[0].fullName;
    } else {
      currentPrimaryFullName = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].fullName){
      previousPrimaryFullName = previousOpportunity.data.pointOfContact[0].fullName;
    } else {
      previousPrimaryFullName = null;
    }
    if (currentPrimaryFullName != previousPrimaryFullName && previousPrimaryFullName == null){
      primaryFullName = "New Data".italics().fontcolor("003264");
      primaryPointOfContact = true;
      changesExistContactInformation = true;
    } else if (currentPrimaryFullName != previousPrimaryFullName && previousPrimaryFullName != null) {
      primaryFullName = previousPrimaryFullName.strike();
      primaryFullNameAria = "Previous Primary Full Name is " + previousPrimaryFullName;
      primaryPointOfContact = true;
      changesExistContactInformation = true;
    }

    //Primary Title
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[0].title){
      currentPrimaryTitle = currentOpportunity.data.pointOfContact[0].title;
    } else {
      currentPrimaryTitle = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].title){
      previousPrimaryTitle = previousOpportunity.data.pointOfContact[0].title;
    } else {
      previousPrimaryTitle = null;
    }
    if (currentPrimaryTitle != previousPrimaryTitle && previousPrimaryTitle == null){
      primaryTitle = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    } else if (currentPrimaryTitle != previousPrimaryTitle && previousPrimaryTitle != null) {
      primaryTitle = previousPrimaryTitle.strike();
      primaryTitleAria = "Previous Primary Title is " + previousPrimaryTitle;
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    }

    //primary email
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[0].email){
      currentPrimaryEmail = currentOpportunity.data.pointOfContact[0].email;
    } else {
      currentPrimaryEmail = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].email){
      previousPrimaryEmail = previousOpportunity.data.pointOfContact[0].email;
    } else {
      previousPrimaryEmail = null;
    }
    if (currentPrimaryEmail != previousPrimaryEmail && previousPrimaryEmail == null){
      primaryEmail = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    } else if (currentPrimaryEmail != previousPrimaryEmail && previousPrimaryEmail != null) {
      primaryEmail = previousPrimaryEmail.strike();
      primaryEmailAria = "Previous Primary Email is " + previousPrimaryEmail;
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    }

    //primary phone
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[0].phone){
      currentPrimaryPhone = currentOpportunity.data.pointOfContact[0].phone;
    } else {
      currentPrimaryPhone = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].phone){
      previousPrimaryPhone = previousOpportunity.data.pointOfContact[0].phone;
    } else {
      previousPrimaryPhone = null;
    }
    if (currentPrimaryPhone != previousPrimaryPhone && previousPrimaryPhone == null){
      primaryPhone = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    } else if (currentPrimaryPhone != previousPrimaryPhone && previousPrimaryPhone != null) {
      primaryPhone = previousPrimaryPhone.strike();
      primaryPhoneAria = "Previous Primary Phone is " + previousPrimaryPhone;
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    }

    //primary fax
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[0].fax){
      currentPrimaryFax = currentOpportunity.data.pointOfContact[0].fax;
    } else {
      currentPrimaryFax = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[0] && previousOpportunity.data.pointOfContact[0].fax){
      previousPrimaryFax = previousOpportunity.data.pointOfContact[0].fax;
    } else {
      previousPrimaryFax = null;
    }
    if (currentPrimaryFax != previousPrimaryFax && previousPrimaryFax == null){
      primaryFax = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    } else if (currentPrimaryFax != previousPrimaryFax && previousPrimaryFax != null) {
      primaryFax = previousPrimaryFax.strike();
      primaryFaxAria = "Previous Primary Fax is " + previousPrimaryFax;
      changesExistContactInformation = true;
      primaryPointOfContact = true;
    }





    //checks Secondary Contact
    //full name
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[1] && currentOpportunity.data.pointOfContact[1].fullName){
      currentSecondaryFullName = currentOpportunity.data.pointOfContact[1].fullName;
    } else {
      currentSecondaryFullName = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].fullName){
      previousSecondaryFullName = previousOpportunity.data.pointOfContact[1].fullName;
    } else {
      previousSecondaryFullName = null;
    }
    if (currentSecondaryFullName != previousSecondaryFullName && previousSecondaryFullName == null){
      secondaryFullName = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    } else if (currentSecondaryFullName != previousSecondaryFullName && previousSecondaryFullName != null) {
      secondaryFullName = previousSecondaryFullName.strike();
      secondaryFullNameAria = "Previous Secondary Full Name is " + previousSecondaryFullName;
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    }

    //Secondary Title
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[1].title){
      currentSecondaryTitle = currentOpportunity.data.pointOfContact[1].title;
    } else {
      currentSecondaryTitle = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].title){
      previousSecondaryTitle = previousOpportunity.data.pointOfContact[1].title;
    } else {
      previousSecondaryTitle = null;
    }
    if (currentSecondaryTitle != previousSecondaryTitle && previousSecondaryTitle == null){
      secondaryTitle = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    } else if (currentSecondaryTitle != previousSecondaryTitle && previousSecondaryTitle != null) {
      secondaryTitle = previousSecondaryTitle.strike();
      secondaryTitleAria = "Previous Secondary Title is " + previousSecondaryTitle;
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    }

    //secondary email
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[0] && currentOpportunity.data.pointOfContact[1].email){
      currentSecondaryEmail = currentOpportunity.data.pointOfContact[1].email;
    } else {
      currentSecondaryEmail = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].email){
      previousSecondaryEmail = previousOpportunity.data.pointOfContact[1].email;
    } else {
      previousSecondaryEmail = null;
    }
    if (currentSecondaryEmail != previousSecondaryEmail && previousSecondaryEmail == null){
      secondaryEmail = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    } else if (currentSecondaryEmail != previousSecondaryEmail && previousSecondaryEmail != null) {
      secondaryEmail = previousSecondaryEmail.strike();
      secondaryEmailAria = "Previous Secondary Email is " + previousSecondaryEmail;
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    }

    //secondary phone
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[1] && currentOpportunity.data.pointOfContact[1].phone){
      currentSecondaryPhone = currentOpportunity.data.pointOfContact[1].phone;
    } else {
      currentSecondaryPhone = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].phone){
      previousSecondaryPhone = previousOpportunity.data.pointOfContact[1].phone;
    } else {
      previousSecondaryPhone = null;
    }
    if (currentSecondaryPhone != previousSecondaryPhone && previousSecondaryPhone == null){
      secondaryPhone = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    } else if (currentSecondaryPhone != previousSecondaryPhone && previousSecondaryPhone != null) {
      secondaryPhone = previousSecondaryPhone.strike();
      secondaryPhoneAria = "Previous Secondary Phone is " + previousSecondaryPhone;
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    }

    //secondary fax
    if(currentOpportunity.data && currentOpportunity.data.pointOfContact && currentOpportunity.data.pointOfContact[1] && currentOpportunity.data.pointOfContact[1].fax){
      currentSecondaryFax = currentOpportunity.data.pointOfContact[1].fax;
    } else {
      currentSecondaryFax = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.pointOfContact && previousOpportunity.data.pointOfContact[1] && previousOpportunity.data.pointOfContact[1].fax){
      previousSecondaryFax = previousOpportunity.data.pointOfContact[1].fax;
    } else {
      previousSecondaryFax = null;
    }
    if (currentSecondaryFax != previousSecondaryFax && previousSecondaryFax == null){
      secondaryFax = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    } else if (currentSecondaryFax != previousSecondaryFax && previousSecondaryFax != null) {
      secondaryFax = previousSecondaryFax.strike();
      secondaryFaxAria = "Previous Secondary Fax is " + previousSecondaryFax;
      changesExistContactInformation = true;
      secondaryPointOfContact = true;
    }


    //Award Details
    if (currentOpportunity.data && currentOpportunity.data.award && currentOpportunity.data.award.date) {
      currentAwardDate = currentOpportunity.data.award.date;
    } else {
      currentAwardDate = null;
    }
    if (previousOpportunity.data && previousOpportunity.data.award && previousOpportunity.data.award.date) {
      previousAwardDate = previousOpportunity.data.award.date;
    } else {
      previousAwardDate = null;
    }

    if (currentAwardDate != null && previousAwardDate == null) {
      awardDate = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (previousAwardDate != null && currentAwardDate == null) {
      awardDate = dateFormatPipe.transform(previousAwardDate, 'MMM DD, YYYY').strike();
      awardDateAria = "Previous Award Date is " + awardDate;
      changesExistAwardDetails = true;
    } else if (previousAwardDate != null && currentAwardDate != null) {
      if (moment(currentAwardDate).format('YYYY-MM-DD') != moment(previousAwardDate).format('YYYY-MM-DD')) {
        awardDate = dateFormatPipe.transform(previousAwardDate, 'MMM DD, YYYY').strike();
        awardDateAria = "Previous Award Date is " + previousAwardDate;
        changesExistAwardDetails = true;
      }
    }

    //Award Number
    if(currentOpportunity.data  && currentOpportunity.data.award && currentOpportunity.data.award.number){
      currentAwardNumber = currentOpportunity.data.award.number;
    } else {
      currentAwardNumber = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.award && previousOpportunity.data.award.number){
      previousAwardNumber = previousOpportunity.data.award.number;
    } else {
      previousAwardNumber = null;
    }
    if (currentAwardNumber != previousAwardNumber && previousAwardNumber == null){
      awardNumber = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (currentAwardNumber != previousAwardNumber && previousAwardNumber != null){
      awardNumber = previousAwardNumber.strike();
      awardNumberAria = "Previous Award Number is " + previousAwardNumber;
      changesExistAwardDetails = true;
    }

    //Task/Delivery Order Number
    if(currentOpportunity.data  && currentOpportunity.data.award && currentOpportunity.data.award.deliveryOrderNumber){
      currentOrderNumber = currentOpportunity.data.award.deliveryOrderNumber;
    } else {
      currentOrderNumber = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.award && previousOpportunity.data.award.deliveryOrderNumber){
      previousOrderNumber = previousOpportunity.data.award.deliveryOrderNumber;
    } else {
      previousOrderNumber = null;
    }
    if (currentOrderNumber != previousOrderNumber && previousOrderNumber == null){
      orderNumber = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (currentOrderNumber != previousOrderNumber && previousOrderNumber != null){
      orderNumber = previousOrderNumber.strike();
      orderNumberAria = "Previous Delivery Order Number is " + previousOrderNumber;
      changesExistAwardDetails = true;
    }

    //Contractor Awarded DUNS
    if(currentOpportunity.data  && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.duns){
      currentAwardedDuns = currentOpportunity.data.award.awardee.duns;
    } else {
      currentAwardedDuns = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.duns){
      previousAwardedDuns = previousOpportunity.data.award.awardee.duns;
    } else {
      previousAwardedDuns = null;
    }
    if (currentAwardedDuns != previousAwardedDuns && previousAwardedDuns == null){
      awardedDuns = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (currentAwardedDuns != previousAwardedDuns && previousAwardedDuns != null){
      awardedDuns = previousAwardedDuns.strike();
      awardedDunsAria = "Previous Contractor Awarded DUNS is " + previousAwardedDuns;
      changesExistAwardDetails = true;
    }

    //Contractor Awarded Name
    if(currentOpportunity.data  && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.name){
      currentAwardedName = currentOpportunity.data.award.awardee.name;
    } else {
      currentAwardedName = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.name){
      previousAwardedName = previousOpportunity.data.award.awardee.name;
    } else {
      previousAwardedName = null;
    }
    if (currentAwardedName != previousAwardedName && previousAwardedName == null){
      awardedName = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (currentAwardedName != previousAwardedName && previousAwardedName != null){
      awardedName = previousAwardedName.strike();
      awardedNameAria = "Previous Contractor Awarded Name is " + previousAwardedName;
      changesExistAwardDetails = true;
    }

    //Contractor Awarded Address
    if(currentOpportunity.data && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.location && currentOpportunity.data.award.awardee.location.streetAddress) {
      currentAwardedAddressStreet = currentOpportunity.data.award.awardee.location.streetAddress;
    } else{
      currentAwardedAddressStreet = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.location && previousOpportunity.data.award.awardee.location.streetAddress) {
      previousAwardedAddressStreet = previousOpportunity.data.award.awardee.location.streetAddress;
    } else{
      previousAwardedAddressStreet = null;
    }
    if(currentOpportunity.data && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.location && currentOpportunity.data.award.awardee.location.city) {
      currentAwardedAddressCity = currentOpportunity.data.award.awardee.location.city;
    } else{
      currentAwardedAddressCity = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.location && previousOpportunity.data.award.awardee.location.city) {
      previousAwardedAddressCity = previousOpportunity.data.award.awardee.location.city;
    } else{
      previousAwardedAddressCity = null;
    }
    if(currentOpportunity.data && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.location && currentOpportunity.data.award.awardee.location.state) {
      currentAwardedAddressState = currentOpportunity.data.award.awardee.location.state;
    } else{
      currentAwardedAddressState = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.location && previousOpportunity.data.award.awardee.location.state) {
      previousAwardedAddressState = previousOpportunity.data.award.awardee.location.state;
    } else{
      previousAwardedAddressState = null;
    }
    if(currentOpportunity.data && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.location && currentOpportunity.data.award.awardee.location.country) {
      currentAwardedAddressCountry = currentOpportunity.data.award.awardee.location.country;
    } else{
      currentAwardedAddressCountry = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.location && previousOpportunity.data.award.awardee.location.country) {
      previousAwardedAddressCountry = previousOpportunity.data.award.awardee.location.country;
    } else{
      previousAwardedAddressCountry = null;
    }
    if(currentOpportunity.data && currentOpportunity.data.award && currentOpportunity.data.award.awardee && currentOpportunity.data.award.awardee.location && currentOpportunity.data.award.awardee.location.zip) {
      currentAwardedAddressZip = currentOpportunity.data.award.awardee.location.zip;
    } else{
      currentAwardedAddressZip = null;
    }
    if(previousOpportunity.data && previousOpportunity.data.award && previousOpportunity.data.award.awardee && previousOpportunity.data.award.awardee.location && previousOpportunity.data.award.awardee.location.zip) {
      previousAwardedAddressZip = previousOpportunity.data.award.awardee.location.zip;
    } else{
      previousAwardedAddressZip = null;
    }
    if ((currentAwardedAddressStreet != previousAwardedAddressStreet || currentAwardedAddressCity != previousAwardedAddressCity || currentAwardedAddressState != previousAwardedAddressState || currentAwardedAddressCountry != previousAwardedAddressCountry || currentAwardedAddressZip != previousAwardedAddressZip) && (previousAwardedAddressStreet == null && previousAwardedAddressCity == null && previousAwardedAddressState == null && previousAwardedAddressZip == null && previousAwardedAddressCountry == null)){
      awardedAddress = "New Data".italics().fontcolor("003264");
      changesExistContactInformation = true;
    } else if (((currentAwardedAddressStreet != previousAwardedAddressStreet && previousAwardedAddressStreet != null) || (currentAwardedAddressCity != previousAwardedAddressCity && previousAwardedAddressCity != null) || (currentAwardedAddressState != previousAwardedAddressState && previousAwardedAddressState != null) || (currentAwardedAddressCountry != previousAwardedAddressCountry && previousAwardedAddressCountry != null) || currentAwardedAddressZip != previousAwardedAddressZip && previousAwardedAddressZip != null)){
      let awardedAddressNoStrike = ((previousAwardedAddressStreet ? previousAwardedAddressStreet : "") + " " + (previousAwardedAddressCity ? previousAwardedAddressCity + "," : "") + " " + (previousAwardedAddressState ? previousAwardedAddressState : "") + " " + (previousAwardedAddressCountry ? previousAwardedAddressCountry : "") + " " + (previousAwardedAddressZip ? previousAwardedAddressZip : ""));
      awardedAddress = awardedAddressNoStrike.strike();
      awardedAddressAria = "Previous Contractor Awarded Address is " + awardedAddressNoStrike;
      changesExistAwardDetails = true;
    }

    //Contract Award Dollar Amount
    if(currentOpportunity.data  && currentOpportunity.data.award && currentOpportunity.data.award.amount){
      currentAwardAmount = currentOpportunity.data.award.amount;
    } else {
      currentAwardAmount = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.award && previousOpportunity.data.award.amount){
      previousAwardAmount = previousOpportunity.data.award.amount;
    } else {
      previousAwardAmount = null;
    }
    if (currentAwardAmount != previousAwardAmount && previousAwardAmount == null){
      awardAmount = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (currentAwardAmount != previousAwardAmount && previousAwardAmount != null) {
      awardAmount = previousAwardAmount.strike();
      awardAmountAria = "Previous Contract Award Dollar Amount is " + previousAwardAmount;

      changesExistAwardDetails = true;
    }


    //Contract Line Item Number
    if(currentOpportunity.data  && currentOpportunity.data.award && currentOpportunity.data.award.lineItemNumber){
      currentLineItemNumber = currentOpportunity.data.award.lineItemNumber;
    } else {
      currentLineItemNumber = null;
    }
    if(previousOpportunity.data  && previousOpportunity.data.award && previousOpportunity.data.award.lineItemNumber){
      previousLineItemNumber = previousOpportunity.data.award.lineItemNumber;
    } else {
      previousLineItemNumber = null;
    }
    if (currentLineItemNumber != previousLineItemNumber && previousLineItemNumber == null){
      lineItemNumber = "New Data".italics().fontcolor("003264");
      changesExistAwardDetails = true;
    } else if (currentLineItemNumber != previousLineItemNumber && previousLineItemNumber != null) {
      lineItemNumber = previousLineItemNumber.strike();
      lineItemNumberAria = "Previous Contract Line Item Number is " + previousLineItemNumber;
      changesExistAwardDetails = true;
    }

    //checks posted date
    postedDate = ("Changes from " + dateFormatPipe.transform(previousOpportunity.postedDate, 'MM/DD/YYYY h:mm a z'));
    differences = {
      changesExistGeneral: changesExistGeneral,
      changesExistSynopsis: changesExistSynopsis,
      changesExistClassification: changesExistClassification,
      changesExistContactInformation: changesExistContactInformation,
      changesExistAwardDetails:changesExistAwardDetails,
      updateResponseDate: updateResponseDate,
      archivingPolicy: archivingPolicy,
      updateArchiveDate: updateArchiveDate,
      specialLegislation: specialLegislation,
      updateSetAside: updateSetAside,
      classificationCode: classificationCode,
      naicsCode: naicsCode,
      placeOfPerformance: placeOfPerformance,
      description: description,
      contractingOfficeAddress: contractingOfficeAddress,
      primaryPointOfContact: primaryPointOfContact,
      primaryFullName: primaryFullName,
      primaryTitle: primaryTitle,
      primaryPhone: primaryPhone,
      primaryEmail: primaryEmail,
      primaryFax: primaryFax,
      secondaryPointOfContact: secondaryPointOfContact,
      secondaryFullName: secondaryFullName,
      secondaryTitle: secondaryTitle,
      secondaryPhone: secondaryPhone,
      secondaryEmail: secondaryEmail,
      secondaryFax: secondaryFax,
      awardDate: awardDate,
      awardNumber: awardNumber,
      orderNumber: orderNumber,
      awardedDuns: awardedDuns,
      awardedName: awardedName,
      awardedAddress: awardedAddress,
      awardAmount: awardAmount,
      lineItemNumber: lineItemNumber,
      postedDate: postedDate,
      descriptionAria: descriptionAria,
      updateResponseDateAria: updateResponseDateAria,
      archivingPolicyAria: archivingPolicyAria,
      updateArchiveDateAria: updateArchiveDateAria,
      specialLegislationAria: specialLegislationAria,
      updateSetAsideAria: updateSetAsideAria,
      classificationCodeAria: classificationCodeAria,
      naicsCodeAria: naicsCodeAria,
      placeOfPerformanceAria: placeOfPerformanceAria,
      contractingOfficeAddressAria: contractingOfficeAddressAria,
      primaryFullNameAria: primaryFullNameAria,
      primaryTitleAria: primaryTitleAria,
      primaryEmailAria: primaryEmailAria,
      primaryPhoneAria: primaryPhoneAria,
      primaryFaxAria: primaryFaxAria,
      secondaryFullNameAria: secondaryFullNameAria,
      secondaryTitleAria: secondaryTitleAria,
      secondaryEmailAria: secondaryEmailAria,
      secondaryPhoneAria: secondaryPhoneAria,
      secondaryFaxAria: secondaryFaxAria,
      awardDateAria: awardDateAria,
      awardNumberAria: awardNumberAria,
      awardedDunsAria: awardedDunsAria,
      orderNumberAria: orderNumberAria,
      awardedNameAria: awardedNameAria,
      awardedAddressAria: awardedAddressAria,
      awardAmountAria: awardAmountAria,
      lineItemNumberAria: lineItemNumberAria
    };
    return differences;
  }

  private findDictionary(key: String, dictionaries: any): any[] {
    let dictionary = _.find(dictionaries._embedded['dictionaries'], { id: key });

    if (dictionary && typeof dictionary.elements !== undefined) {
      return dictionary.elements;
    } else {
      return [];
    }
  }
}

