import { Component } from '@angular/core';
import { globals } from '../../app/globals.ts';

@Component({
  selector: 'samFooter',
  templateUrl:'footer.template.html',
})
export class SamFooterComponent {

  constructor() {
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }
}
