import {Component, Input, OnInit, OnChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import {FilterParamLabel} from "../../pipes/filter-label.pipe";
import { globals } from '../../.././globals.ts';

@Component({
  moduleId: __filename,
  selector: 'saved-search-result',
  templateUrl: 'saved-search-result.template.html'
})
export class SavedSearchResult implements OnInit {
  @Input() data: any={};
  parameters: Array =[];
  id: string;

  constructor() { }

  ngOnChanges(changes) {
  }

  ngOnInit(){
    let ctx = this;
    if(this.data.data && this.data.data.key) {
      this.id = this.data.data.key;
    }
    if(this.data.data && this.data.data.parameters) {
      this.getFilterParamLabels(this.data.data.parameters);
    }
    if(this.data.data && this.data.data.index) {
      globals.searchFilterConfig.forEach(function(index) {
        if(index['value'] == ctx.data.data.index.toString()) {
          ctx.data.data.index = index['label'];
        }
      })
    }
  }

  //To display parameter labels generically
  getFilterParamLabels(params: any) {
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var label = new FilterParamLabel().transform(key);
        this.parameters.push({"label": label, "value": params[key].toString()});
      }
    }
  }

}
