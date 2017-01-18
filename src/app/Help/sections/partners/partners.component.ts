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
        title:"USASpending.gov",
        detail:"The official government searchable website to give the American public access on how tax dollars are spent within their communities and all over the US.  SAM.gov provides the wide range of programs and funding opportunities financed by tax dollars.",
        link:"View USASpending.gov",
        url:"https://www.usaspending.gov/Pages/Default.aspx",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Acquisition.gov",
        detail:"A comprehensive website to stay-up-to-date on the latest developments in federal acquisitions and electronically search versions from the past and present. SAM.gov also provides a catalog of Federal Acquisitions but allows the user to create an account, maintain information, and apply for funding.",
        link:"View Acquisition.gov",
        url:"https://www.acquisition.gov/",
        img:"src/assets/img/logos/acq_logo.png"
      },
      {
        title:"Grants.gov",
        detail:"The official government website to create, search, and apply for Federal grants and funding opportunities. SAM.gov grants are more specific to those looking to work directly with the government.",
        link:"View Grants.gov",
        url:"http://www.grants.gov/",
        img:"src/assets/img/logos/Grants-Gov-Logo.png"
      }
    ],
    [
      {
        title:"Disaster Assistance",
        detail:"A user-friendly website provides assistance on how to prepare for, respond to, and recover from disasters. SAM.gov contains information on other forms of federal assistance pertaining to government services.",
        link:"View Disaster Assistance",
        url:"https://www.disasterassistance.gov/",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Usa.gov",
        detail:"The official government website to publicly access the U.S government information and services. SAM.gov provides the funding opportunities for U.S. government services.",
        link:"View USA.gov",
        url:"https://www.usa.gov/",
        img:"src/assets/img/logos/usagov_logo_hi_res.png"
      },
      {
        title:"Benefits.gov",
        detail:"The official website for information about benefits available from the U.S. government.  SAM.gov provides the benefits program content.",
        link:"View Benefits.gov",
        url:"https://www.benefits.gov/",
        img:"src/assets/img/logos/benefits-logo.png"
      }
    ],
  ];

  constructor() { }

}
