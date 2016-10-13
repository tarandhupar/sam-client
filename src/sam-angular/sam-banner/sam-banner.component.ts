import { Component, Output, EventEmitter} from '@angular/core';



/**
 * The <samBanner> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Output onClose: output false when the close button on banner has been clicked.
 */
@Component({
  selector: 'samBanner',
  templateUrl: './sam-banner.template.html',
  styleUrls: [ './banner.style.css' ],

})
export class SamBannerComponent {

  showDetail:boolean = false;
  showBanner:boolean = true;

  @Output()
  onClose:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(){

  }

  toggleDetails(){
    this.showDetail = !this.showDetail;
  }

  /**
   * Send out the close banner event(let the header adjust margin accordingly)
   */
  closeBanner(){
    this.showBanner = false;
    this.onClose.emit(this.showBanner);
  }


}
