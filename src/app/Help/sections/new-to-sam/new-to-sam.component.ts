import { Component } from '@angular/core';
import { globals } from '../../../globals';

@Component({
  providers: [ ],
  templateUrl: './new-to-sam.template.html',
})
export class NewToSamComponent {

  constructor() { }

  linkToggle():boolean{
    return globals.showOptional;
  }
  
  PWMAFA:any = {
    header: [
      "Actions",
      "Legacy Systems",
      "Availability on beta.SAM.gov"
    ],
    body: [
      [
        "Create and update assistance listings for each CFDA number.",
        "CFDA",
        "Future*"
      ],
      [
        "Search entities to ensure that they’re registered and eligible to receive awards.",
        "SAM",
        "Current"
      ],
      [
        "Oversee sub-award reporting if a prime awardee has sub-awardees.",
        "FSRS",
        "Future*"
      ]
    ]
  }
  
  PWMAFP:any = {
    header: [
      "Actions",
      "Legacy Systems",
      "Availability on beta.SAM.gov"
    ],
    body: [
      [
        "Post notices of proposed contract actions.",
        "FBO",
        "Future*"
      ],
      [
        "Post actual contract actions, typically using a contract writing system.",
        "FPDS",
        "Future*"
      ],
      [
        "Search entities before making an award to ensure that they’re registered and eligible to receive awards (checking for exclusions).",
        "SAM",
        "Current"
      ],
      [
        "Search wage rates and labor categories for covered contracts before posting notices, during the award process, and while issuing modifications.",
        "WDOL",
        "Current"
      ],
      [
        "Oversee small business and FFATA (Federal Funding Accountability and Transparency Act) subcontract reporting for prime contractors who issue subcontracts.",
        "ESRS FSRS",
        "Future*"
      ],
      [
        "Post actual contract actions, typically using a contract writing system.",
        "FPDS",
        "Future*"
      ],
      [
        "Fill out past performance evaluations for managed contracts. Research past performance reports during source selection to make sure that a particular entity is the best choice for the government.",
        "PPIRS CPARS",
        "Future*"
      ]
    ]
  }
  
  PWRAFA:any = {
    header: [
      "Actions",
      "Legacy Systems",
      "Availability on beta.SAM.gov"
    ],
    body: [
      [
        "Search assistance listings for funding options.",
        "CFDA",
        "Current"
      ],
      [
        "Register as an entity before applying for awards as a prime recipient. ",
        "SAM",
        "Future*"
      ],
      [
        "Report on sub-awards if you’re a prime awardee and have distributed sub-awards greater than or equal to $25,000.",
        "FSRS",
        "Future*"
      ]
    ]
  }
  
  PWRAFP:any = {
    header: [
      "Actions",
      "Legacy Systems",
      "Availability on beta.SAM.gov"
    ],
    body: [
      [
        "Search for contract opportunities.",
        "FBO",
        "Current"
      ],
      [
        "Register as an entity before applying for awards as a prime contractor.",
        "SAM",
        "Future*"
      ],
      [
        "Search wage rates during the bidding process to develop bids and compare with competitor bids. Track changes during the post-award process to ensure that workers are receiving appropriate wages. Reference wage rates during auditing process to evaluate own compliance.",
        "WDOL",
        "Current"
      ],
      [
        "Report on subawards if you’re a prime contractor and have distributed sub-awards greater than $30,000.",
        "FSRS",
        "Future*"
      ]
    ]
  }
  
  PWAA:any = {
    header: [
      "Actions",
      "Legacy Systems",
      "Availability on beta.SAM.gov"
    ],
    body: [
      [
        "Agency administrators manage the Federal Hierarchy. Domain administrators assign privileges to users.",
        "All",
        "Future"
      ]
    ]
  }
  
  PWTA:any = {
    header: [
      "Actions",
      "Legacy Systems",
      "Availability on beta.SAM.gov"
    ],
    body: [
      [
        "Run reports for all of the different data sets.",
        "FPDS",
        "Future*"
      ]
    ]
  }
  
  data:any = [
      {
        title:"People who<br><span class='uppercase'>make awards</span>",
      },
      {
        title:"I make grants or other assistance awards",
        contentType: "table",
        content: this.PWMAFA,
      },
      {
        title:"I make contract awards",
        contentType: "table",
        content: this.PWMAFP,
      },
      {
        title:"People who<br><span class='uppercase'>receive awards</span>"
      },
      {
        title:"I want to receive grants or other assistance awards",
        contentType: "table",
        content: this.PWRAFA,
      },
      {
        title:"I want to receive contract awards",
        contentType: "table",
        content: this.PWRAFP,
      },
      {
        title:"People who<br><span class='uppercase'>manage awards</span>",
        columns: "four"
      },
      {
        title:"I manage federal assistance and procurement awards",
        contentType: "table",
        content: this.PWTA,
        columns: "eight"
      },
      {
        title:"People who<br><span class='uppercase'>administer awards</span>",
        columns: "four"
      },
      {
        title:"I administer federal assistance and procurement awards",
        contentType: "table",
        content: this.PWAA,
        columns: "eight"
      }
  ];
  
}
