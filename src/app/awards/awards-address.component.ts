import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'awardsAddress',
  templateUrl: 'awards-address.html',
})
export class AwardsAddress implements OnInit {
  
  @Input() address: any;

  constructor( ) {}

  ngOnInit(){
  }

}
