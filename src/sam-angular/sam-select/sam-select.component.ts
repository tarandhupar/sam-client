import { Component, Input } from '@angular/core';

@Component({
  selector: 'samSelect2',
<<<<<<< HEAD:src/app/sam-angular/sam-select/sam-select.component.ts
  styleUrls: [ 'sam-select.style.css' ],
=======
>>>>>>> sam-angular-module:src/sam-angular/sam-select/sam-select.component.ts
  templateUrl: 'sam-select.template.html'
})
export class SamSelectComponent {
  @Input() config: any;
  @Input() value: any;

  public hasError: boolean;

  constructor() {

  }
}
