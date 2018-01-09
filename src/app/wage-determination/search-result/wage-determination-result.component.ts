import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import {SortArrayOfObjects} from "../../app-pipes/sort-array-object.pipe";


@Component({
  moduleId: __filename,
  selector: 'wage-determination-result',
  templateUrl: 'wage-determination-result.template.html'
})
export class WageDeterminationResult implements OnInit {
  @Input() data: any={};
  @Input() qParams: any={};
  constructor() { }

  ngOnInit(){
    if(this.data.publishDate && this.data.publishDate!==null) {
    this.data.publishDate = moment(this.data.publishDate).format("MMM DD, YYYY");
    }
    if(this.data.location && this.data.location!==null) {
      if (this.data.location.states && this.data.location.states !== null) {
        for (var i = 0; i < this.data.location.states.length; i++) {
          if (this.data.location.states[i].counties && this.data.location.states[i].counties.include && this.data.location.states[i].counties.include !== null) {
            this.data.location.states[i].counties.include = new SortArrayOfObjects().transform(this.data.location.states[i].counties.include, 'value');
          }
          if (this.data.location.states[i].counties && this.data.location.states[i].counties.exclude && this.data.location.states[i].counties.exclude !== null) {
            this.data.location.states[i].counties.exclude = new SortArrayOfObjects().transform(this.data.location.states[i].counties.exclude, 'value');
          }
        }
      }
      if (this.data.location.state && this.data.location.state.counties && this.data.location.state.counties !== null) {
        this.data.location.state.counties = new SortArrayOfObjects().transform(this.data.location.state.counties, 'value');
      }
    }
  }
}
