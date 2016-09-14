/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentInjectService } from './common/service/component.inject.service.ts';
import { InputTypeConstants } from './common/constants/input.type.constants.ts';
import { SamFooter } from './common/samuikit/sam-footer.ts';
import { SamHeader } from './common/samuikit/sam-header.ts';
import { SamSpace } from './common/samuikit/sam-space.ts';
import '../assets/js/samuikit.js';


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  templateUrl: 'app.template.html',
  providers : [ComponentInjectService,InputTypeConstants],
  directives: [SamHeader, SamFooter, SamSpace]
})
export class App {
  testValue = { value: 'Test' };
  constructor() {
    
  }

  ngOnInit() {
       this.testValue = { value: 'Test2' };
  }

}

