import { Component, Injectable } from '@angular/core';
import { InputTypeConstants } from '../constants/input.type.constants.ts';


@Injectable()
export class ComponentInjectService {

    constructor(private _inputTypeConstants : InputTypeConstants) {

    }

    compileToComponent(selector,template) {
      @Component({
        selector,
        template
      })
      class ComponentInject {};
      return ComponentInject;
    }

    injectComponent( id : string, config : any){

      let type : any;

      if(id === 'label')
        type = this._inputTypeConstants.getConstants().label;
      else if (id === 'alert')
        type = this._inputTypeConstants.getConstants().alert;
      else if(id === 'footer')
        type = this._inputTypeConstants.getConstants().footer;
      else if(id === 'header')
        type = this._inputTypeConstants.getConstants().header;
      else if(id === 'button')
        type = this._inputTypeConstants.getConstants().button;
      else if(id === 'select')
        type = this._inputTypeConstants.getConstants().select;
      else if(id === 'accordions')
        type = this._inputTypeConstants.getConstants().accordions;
      
      if(id ==='space')
        return this.compileToComponent(id,'<div></div>');
      return this.compileToComponent(id,type.render(config));
    }


}
