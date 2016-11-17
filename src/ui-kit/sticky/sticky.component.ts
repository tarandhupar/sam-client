import { HostListener, Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Directive({ selector: '[sam-sticky]' })
export class SamStickyComponent implements OnInit {
  
  // Research sticky polyfill
  // http://html5please.com/#sticky
  @Input() limit: number;
  @Input() container: string;

  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.makeSticky(event.target.innerWidth, this.limit || 0);
  }

  @HostListener('window:scroll', ['$event'])
  scroll(event) {
    let parentContainer: any = document.getElementsByClassName(this.container);
    let documentHeight = this.getDocHeight();
    let scrollPosition = this.getScrollTop() + window.innerHeight;
    let parentContainerLimit = parentContainer[0].offsetHeight + parentContainer[0].offsetTop;
    let restOfDocumentHeight = documentHeight - parentContainerLimit;
    let stickyElementLimit = this.el.nativeElement.offsetTop + this.el.nativeElement.offsetHeight;
    let stickyElementTopMargin = 20 + (this.el.nativeElement.offsetTop * -1);
    let stopLimit = (documentHeight - restOfDocumentHeight) + ( window.innerHeight - stickyElementLimit);

    if(scrollPosition > stopLimit && scrollPosition > (documentHeight - restOfDocumentHeight)){
      let topPosition = (stickyElementTopMargin + (scrollPosition - stopLimit)) * -1;
      this.renderer.setElementStyle(this.el.nativeElement, 'top', topPosition + "px");
    }else if(scrollPosition < (documentHeight - restOfDocumentHeight)){
      this.renderer.setElementStyle(this.el.nativeElement, 'top', "auto");
    }
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

  getDocHeight() {
    let D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  getScrollTop(){
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return top;
  }

}
