import { Component } from '@angular/core';

@Component({
  selector: 'swds',
  styleUrls: [ 'sam-angular.style.css' ],
  templateUrl: 'sam-angular.template.html'
})
export class SamAngularComponents {
  basicConfig: any;
  myString: string;
  dynamicConfigString: string; // Config the user has enter in the text box
  dynamicConfig: any; // JSON of our config

  constructor() {
    this.basicConfig = {
      options: [
        {key: 1, value: 'One'},
        {key: 2, value: 'Two'},
        {key: 3, value: 'Three'},
      ],
      label: "A label",
    };
    this.myString = `I'm a string`;
    this.dynamicConfigString = JSON.stringify({
      options: [
        {key: 1, value: 'One'},
        {key: 2, value: 'Two'},
        {key: 3, value: 'Three'},
      ],
      label: "A label",
    });
  }

  dynamicConfigChanged(dynamicConfig) {
    try {
      this.dynamicConfig = JSON.parse(dynamicConfig);
    } catch(e) {
      console.error(e);
      this.dynamicConfig = null;
    }
    console.log(this.dynamicConfig);
  }
}
