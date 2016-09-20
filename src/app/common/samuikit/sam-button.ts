import {Component, ElementRef, OnInit, Injector, Input} from '@angular/core';
import { ComponentInjectService } from '../service/component.inject.service.ts';
import { InputTypeConstants } from '../constants/input.type.constants.ts';

@Component({
  selector:'samButton',
  template:`<div id={{labelname}}></div>`,
  providers: [ComponentInjectService, InputTypeConstants]
})
export class SamButton implements OnInit{
  @Input() labelname;
  @Input() config : any;

  constructor(
    public _injector:Injector,
  ){}

  ngOnInit(){

  }
}
