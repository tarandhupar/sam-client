import {Component, DynamicComponentLoader, ElementRef, OnInit, Injector, Input} from '@angular/core';
import { ComponentInjectService } from '../service/component.inject.service.ts';
import { InputTypeConstants } from '../constants/input.type.constants.ts';

@Component({
  selector: 'samHeader',
  template:`<div id={{labelname}}></div>`,
  providers: [ComponentInjectService, InputTypeConstants]
})
export class SamHeader implements OnInit {

  @Input() labelname;   

  constructor(
    private loader: DynamicComponentLoader, 
    private elementRef: ElementRef,
    public _injector:Injector,
    private _componentInjectService : ComponentInjectService
  ) {}

  ngOnInit() {
    
    this.loader.loadAsRoot(
      this._componentInjectService.injectComponent('header',{}),      
      "#"+this.labelname,
      this._injector
    );
  }
}



