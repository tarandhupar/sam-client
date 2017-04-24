import {HostListener, Component, ElementRef, Input, Renderer, OnInit, EventEmitter, Output} from '@angular/core';
import {AutocompleteConfig} from "sam-ui-kit/types";
import { SamUIKitModule } from 'sam-ui-kit';


@Component({
  selector: 'duns-entity-filter',
  templateUrl: 'duns-entity-filter.template.html'


})
export class DunsEntityFilter{

  @Input() ngModel: any;




  constructor( ) {}


}
