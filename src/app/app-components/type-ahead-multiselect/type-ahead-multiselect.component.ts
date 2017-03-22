import { Component} from '@angular/core';
import { SamListComponent } from 'sam-ui-elements/src/ui-kit/form-controls/list';

@Component({
  selector: 'sam-type-ahead-multiselect',
  templateUrl: 'type-ahead-multiselect.template.html'
})
export class SamTypeAheadMultiselectComponent extends SamListComponent {

  constructor(){
    super();
  }
}
