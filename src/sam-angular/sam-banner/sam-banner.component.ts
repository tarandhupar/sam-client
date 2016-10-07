import { Component} from '@angular/core';



/**
 * The <samBanner> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 */
@Component({
  selector: 'samBanner',
  templateUrl: './sam-banner.template.html',
  styleUrls: [ './banner.style.css' ],

})
export class SamBannerComponent {

  showDetail:boolean = false;
  showBanner:boolean = true;

  constructor() {
  }

  ngOnInit(){

  }

  toggleDetails(){
    this.showDetail = !this.showDetail;
  }

  closeBanner(){
    this.showBanner = false;
  }


}
