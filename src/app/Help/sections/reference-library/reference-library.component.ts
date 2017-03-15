import { Component } from '@angular/core';
import { globals } from '../../../globals';

@Component({
  providers: [ ],
  templateUrl: './reference-library.template.html',
})
export class ReferenceLibraryComponent {

  private data: any={
    Federal: [
        {
          title:"Grants.gov Learning Center",
          detail:"Here you can learn and navigate the step-by-step process of the grant lifecycle, from the online application phase, pre-award phase, and post award phase.",
          link:"View Grants.gov",
          url:"http://www.grants.gov/web/grants/learn-grants.html",
          img:"src/assets/img/logos/Grants-Gov-Logo.png"
        },
        {
          title:"Benefit Finder",
          detail:"An easy-to-use online tool to find government benefit information and your eligibility. ",
          link:"View Benefits.gov",
          url:"https://www.benefits.gov/benefits/benefit-finder#benefits&qc=cat_1",
          img:"src/assets/img/logos/benefits-logo.png"
        },
        {
          title:"Government Benefits, Grants, and Loans",
          detail:"All you need to know about affordable housing, grants, and loans are located under this comprehensive website. Go here to learn more. ",
          link:"View USA.gov",
          url:"https://www.usa.gov/benefits-grants-loans",
          img:"src/assets/img/logos/usagov_logo_hi_res.png"
        }
      ],
    Contract:[
        {
          title:"Federal Acquisition Regulation",
          detail:"The FAR is your primary resource documenting the policies and procedures that govern acquisitions by all executive agencies of the U.S. federal government.  It provides for coordination, simplicity, and uniformity in the Federal acquisition process.  You can quickly access any section of the Federal Acquisition Regulation electronically by using the online table of contents on this page. ",
          link:"View FAR",
          url:"https://www.acquisition.gov/?q=browsefar",
          img:"src/assets/img/placeholder.jpg"
        },
        {
          title:"Compliance Assistance",
          detail:"Obtain assistance on government contracts, include wage laws, workers rights, and more. ",
          link:"View Compliance Assistance",
          url:"https://www.dol.gov/whd/govcontracts/",
          img:"src/assets/img/placeholder.jpg"
        },
        {
          title:"Request DUNS Number",
          detail:"A Duns & Bradstreet (DUNS) Number is a unique 9-digit identification number assigned to businesses worldwide. Go here to look up a DUNS Number or request a new one. ",
          link:"View DUNS Number",
          url:"http://fedgov.dnb.com/webform/index.jsp",
          img:"src/assets/img/placeholder.jpg"
        }
    ]
  };

  private imageLibraryNotification:string = "";

  constructor() { }

  onImageLibrarySelect(val){
    this.imageLibraryNotification = val;
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }

}
