import {HostListener, Directive, ElementRef, Input} from '@angular/core';

/**
 * The sticky-element directive is made to help element stick on the page
 */
@Directive({selector: '[sticky-element]'})
export class StickyElementComponent {

  @Input() element: any;

  @HostListener('window:resize', ['$event'])
  resize(event) {
    // Set element to initial styles
    // to help finding the initial element width
    this.el.nativeElement.style.position = 'static';
    this.makeSticky(event);
  }

  @HostListener('window:scroll', ['$event'])
  scroll(event) {
    this.makeSticky(event);
  }

  constructor(private el: ElementRef) {

  }

  makeSticky(event: any) {
    let rect;
    let element = this.element.nativeElement;
    let pageOffset = window.pageYOffset;
    if(element) {
      rect = element.getBoundingClientRect();
      let elementTop; //x and y
      let scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      elementTop = rect.top + scrollTop - window.innerHeight;
      if (elementTop > pageOffset) {
        this.setPosition("fixed");
      } else {
        this.setPosition("static");
      }
    }
  }

  setPosition(position: string) {
    this.el.nativeElement.style.position = position;
  }
}
