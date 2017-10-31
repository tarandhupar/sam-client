import { Directive, Injectable, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { NaicsService } from 'api-kit/naics/naics.service';
import { AlertFooterService } from 'app/app-components/alert-footer/alert-footer.service';//this will be moved into sam-ui-kit soon

@Injectable()
export class NaicsServiceImpl implements AutocompleteService {

  sourceYears:string[];
  maxLevel:string;

  constructor(private naicsService: NaicsService) { }

  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean, serviceOptions: any) {
    if(val.length>0){
      return this.naicsService.searchNaics(this.sourceYears, this.maxLevel, val).map(data => {
        return data._embedded.nAICSList.map((value)=>{
          let newObj = {
            key:value.naicsCode,
            value: value.naicsCode + " - " + value.naicsTitle
          };
          return newObj;
        });
      });
    }
    return this.getAllActiveTopLevelNaics();
  }

  getAllActiveTopLevelNaics() {
    return this.naicsService.getTopLevelNaics().map(data => {
      return data._embedded.nAICSList.map((value)=>{
          let newObj = {
            key:value.naicsCode,
            value: value.naicsCode + " - " + value.naicsTitle
          };
        return newObj;
      });
    });
  }

  setFetchMethod(_?: any): any {}

  setSourceYears(sourceYears: string[]) {
    this.sourceYears = sourceYears;
  }

  setMaxLevel(maxLevel: string) {
    this.maxLevel = maxLevel;
  }
}

@Directive({
  selector: 'sam-autocomplete[naicspicker-autofill],sam-autocomplete-multiselect[naicspicker-autofill]',
  providers: [
    { provide: AutocompleteService, useClass: NaicsServiceImpl }
  ]
})
export class SamNaicsServiceDirective implements  OnInit {
  @Input() sourceYears: string[];
  @Input() maxLevel: string;

  private autocompleteService: any;

  constructor(autocompleteService: AutocompleteService) {
    // Cast to any since we have to use Typescript
    // metadata for injection, but we actually need
    // NaicsServiceImpl's additional methods
    this.autocompleteService = autocompleteService;
  }

  ngOnInit() {
    if (this.sourceYears) {
      this.autocompleteService.setSourceYears(this.sourceYears);
    } 
    if (this.maxLevel) {
      this.autocompleteService.setMaxLevel(this.maxLevel);
    } 
  }
}



