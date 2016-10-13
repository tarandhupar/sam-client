import { HostListener, Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Directive({ selector: '[sam-sticky]' })
export class SamStickyDirective implements OnInit {
  
  // Research sticky polyfill
  // http://html5please.com/#sticky
  @Input() limit: number;

  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.makeSticky(event.target.innerWidth, this.limit || 0);
  }

  constructor( private el: ElementRef, private renderer: Renderer) {}

  ngOnInit(){
    this.makeSticky(window.innerWidth, this.limit || 0);
  }

  makeSticky(width : number, limit: number){
    width > limit ? this.setPosition("fixed") : this.setPosition("static")
  }

  setPosition(position: string){
    this.renderer.setElementStyle(this.el.nativeElement, 'position', position);
  }

}
