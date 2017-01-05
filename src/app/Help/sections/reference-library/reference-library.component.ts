import { Component } from '@angular/core';
import { globals } from '../../../globals';

@Component({
  providers: [ ],
  templateUrl: './reference-library.template.html',
})
export class ReferenceLibraryComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim.`;


  private data: any={
    Federal: [
        {
          title:"Grants.gov Learning Center",
          detail:"Details for Grants.gov Learning Center: "+this.detailLipsum,
          link:"View Grants.gov",
          url:"http://www.grants.gov/web/grants/learn-grants.html",
          img:"src/assets/img/logos/Grants-Gov-Logo.png"
        },
        {
          title:"Benefit Finder",
          detail:"Benefit Finder: "+this.detailLipsum,
          link:"View Benefits.gov",
          url:"https://www.benefits.gov/benefits/benefit-finder#benefits&qc=cat_1",
          img:"src/assets/img/logos/benefits-logo.png"
        },
        {
          title:"Government Benefits, Grants, and Loans",
          detail:"Details for Government Benefits, Grants, and Loans: "+this.detailLipsum,
          link:"View USA.gov",
          url:"https://www.usa.gov/benefits-grants-loans",
          img:"src/assets/img/logos/usagov_logo_hi_res.png"
        }
      ],
    Contract:[
        {
          title:"Federal Acquisition Regulation",
          detail:"Details for Federal Acquisition Regulation: "+this.detailLipsum,
          link:"View FAR",
          url:"https://www.acquisition.gov/?q=browsefar",
          img:"src/assets/img/placeholder.jpg"
        },
        {
          title:"Compliance Assistance",
          detail:"Details for Compliance Assistance: "+this.detailLipsum,
          link:"View Compliance Assistance",
          url:"https://www.dol.gov/whd/govcontracts/",
          img:"src/assets/img/placeholder.jpg"
        },
        {
          title:"Request DUNS Number",
          detail:"Details for Request DUNS Number: "+this.detailLipsum,
          link:"View DUNS Number",
          url:"http://fedgov.dnb.com/webform/index.jsp",
          img:"src/assets/img/placeholder.jpg"
        }
    ]
  };

  constructor() { }

  private linkToggle():boolean{
    return globals.showOptional;
  }
}
