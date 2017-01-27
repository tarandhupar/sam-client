import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { FHService } from '../fh/fh.service';
import { SuggestionsService } from '../search/suggestions.service';

@Injectable()
export class AutoCompleteWrapper {

  constructor(private oFHService:FHService, private oSearchService:SuggestionsService) {}

  search(oData, name) {
    switch(name) {
      case "suggestions":
            return this.oSearchService.autosearch(oData);
      
      case "agencypicker":
            return this.oFHService.search(oData);
    }
  }
}
