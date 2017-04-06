import { Injectable, Directive, Input, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { Observable }    from 'rxjs/Observable';
import {ProgramService} from "../program/program.service";

@Injectable()
export class FALProgramAutoCompleteWrapper implements AutocompleteService{
  private target = "search";
  autocompleteIndex = "";
  constructor(private oProgramService:ProgramService) {}

  //sam-ui-kit autocomplete
  fetch(val: any, endOfList: boolean) {
    if(this.target=="search"){
      if(val.length>3){
        return this.oProgramService.falautosearch({
          index: this.autocompleteIndex,
          keyword: val
        });
      }
    }
    return Observable.of([/*{
      keyProperty: 'test1',
    valueProperty: 'test1'
    },
      {
        keyProperty: 'test2',
        valueProperty: 'test2'
      },*/
    ]);
  }

  setFetchMethod(newVal){
    this.target = newVal;
  }
}

@Directive({
  selector: 'sam-autocomplete[autofill-falProgram]',
  providers: [
    { provide: AutocompleteService, useClass: FALProgramAutoCompleteWrapper }
  ]
})
export class FAlProgramServiceDirective implements OnChanges {
  @Input('index') index: string;
  constructor(private autocompleteService: AutocompleteService){}
  ngOnInit(){
    this.autocompleteService['autocompleteIndex'] = this.index;
  }
  ngOnChanges(){
    this.autocompleteService['autocompleteIndex'] = this.index;
  }
}
