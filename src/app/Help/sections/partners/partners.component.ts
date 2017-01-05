import { Component } from '@angular/core';

@Component({
  providers: [ ],
  templateUrl: './partners.template.html',
})
export class PartnersComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim.`;

  private data:any = [
    [
      {
        title:"Usa.gov",
        detail:"Details for Usa.gov: "+this.detailLipsum,
        link:"View USA.gov",
        url:"https://www.usa.gov/",
        img:"src/assets/img/logos/usagov_logo_hi_res.png"
      },
      {
        title:"Acquisition.gov",
        detail:"Details for Acquisition.gov: "+this.detailLipsum,
        link:"View Acquisition.gov",
        url:"https://www.acquisition.gov/",
        img:"src/assets/img/logos/acq_logo.png"
      },
      {
        title:"Grants.gov",
        detail:"Details for Grants.gov: "+this.detailLipsum,
        link:"View Grants.gov",
        url:"http://www.grants.gov/",
        img:"src/assets/img/logos/Grants-Gov-Logo.png"
      }
    ],
    [
      {
        title:"Disaster Assistance",
        detail:"Details for Disaster Assistance: "+this.detailLipsum,
        link:"View DA",
        url:"https://www.disasterassistance.gov/",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"USASpending.gov",
        detail:"Details for USASpending.gov: "+this.detailLipsum,
        link:"View USASpending.gov",
        url:"https://www.usaspending.gov/Pages/Default.aspx",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Benefits.gov",
        detail:"Details for Benefits.gov: "+this.detailLipsum,
        link:"View Benefits.gov",
        url:"https://www.benefits.gov/",
        img:"src/assets/img/logos/benefits-logo.png"
      }
    ],
  ];

  constructor() { }

}
