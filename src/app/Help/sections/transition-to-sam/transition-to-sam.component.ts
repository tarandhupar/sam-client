import { Component } from '@angular/core';

@Component({
  providers: [ ],
  templateUrl: './transition-to-sam.template.html',
})
export class TransitionToSamComponent {
  
  search = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Find contract opportunities and contract award data, assistance listings, 
          entities, exclusions, Federal Department/Independent Agency, Federal sub-tiers, 
          and wage determinations.
        </div>
        <div class="item">
        View details for individual transactions.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Use customized search filters for specific data sets.
        </div>
        <div class="item">
          Save, download, and print search results and detailed record pages.
        </div>
        <div class="item">
          Improvements to detailed records for contract awards, entities, and 
          exclusions.
        </div>
        <div class="item">
          Federal users who are logged in and have assigned  roles will be able 
          to access detailed records for contract opportunities and assistance 
          listings.
        </div>
      </div>
    `
  }
  
  reporting = {
    column1: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          View Standard, Static, and Adhoc reports for contract award data.
        </div> 
        <div class="item">
          Administrators for assistance listings will be able to view administrative reports to oversee agency compliance.
        </div>
      </div>
    `
  }
  
  dataentry = {
    column1: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Federal users who are logged in will be able to view, create, and update 
          assistance listings and contract opportunities.
        </div> 
        <div class="item">
          Federal users will be able to access additional capabilities for managing 
          assistance listings (including OMB Analyst or Agency Coordinator Review 
          and approval/rejection capabilities).
        </div>
      </div>
    `
  }

  administration = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Create a user account with single sign-on for all of beta.SAM.gov.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Users who are logged in can migrate their existing roles from each 
          legacy system for Assistance Listings or Opportunities, Awards. 
        </div>
        <div class="item">
          View federal assistance, contract opportunity, and contract award role 
          data.
        </div>
        <div class="item">
          Federal assistance listings administrators will be able to create, 
          delete or modify roles for their agency's users. 
        </div>
        <div class="item">
          Access Reports features based on your assigned role.
        </div>
      </div>
    `
  }
  
  helpcenter = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Find information for all beta.SAM.gov services  in one Help section.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          See more info in the Help section
        </div>
        <div class="item">
          Access the Federal Service Desk (FSD) directly from beta.SAM.gov. 
        </div>
      </div>
    `
  }
  
  systeminterfaces = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Locations, PSC, and NAICS reference data API services
        </div>
        <div class="item">
          Multi-factor authentication
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Additional reference data services 
        </div>
        <div class="item">
          Awards extracts and basic API functionality  
        </div>
        <div class="item">
          FAL extracts  
        </div>
        <div class="item">
          FH interfaces  
        </div>
        <div class="item">
          WS IAM conversion
        </div>
      </div>
    `
  }
  
  featureData:any = [
      {
        title:"Search", 
        contentType:"grid",
        content: [[this.search.column1], [this.search.column2]],
        img: "src/assets/img/sam-icons/search-b3.png",
        imgActive: "src/assets/img/sam-icons/search-c9.png",
        imgWidth: '70px'
      },
      {
        title:"Reporting",
        contentType:"grid",
        content: [[this.reporting.column1]],
        img: "src/assets/img/sam-icons/resources-b3.png",
        imgActive: "src/assets/img/sam-icons/resources-c9.png",
        imgWidth: '70px'
      },
      {
        title:"Data Entry",
        contentType:"grid",
        content: [[this.dataentry.column1]],
        img: "src/assets/img/sam-icons/data-entry-b3.png",
        imgActive: "src/assets/img/sam-icons/data-entry-c9.png",
        imgWidth: '70px'
      },
      {
        title:"Administration",
        contentType:"grid",
        content: [[this.administration.column1], [this.administration.column2]],
        img: "src/assets/img/sam-icons/admin-b3.png",
        imgActive: "src/assets/img/sam-icons/admin-c9.png",
        imgWidth: '70px'
      },
      {
        title:"Help Center",
        contentType:"grid",
        content: [[this.helpcenter.column1], [this.helpcenter.column2]],
        img: "src/assets/img/sam-icons/help-b3.png",
        imgActive: "src/assets/img/sam-icons/help-c9.png",
        imgWidth: '70px'
      },
      {
        title:"APIs",
        contentType:"grid",
        content: [[this.systeminterfaces.column1], [this.systeminterfaces.column2]],
        img: "src/assets/img/sam-icons/api-b3.png",
        imgActive: "src/assets/img/sam-icons/api-c9.png",
        imgWidth: '70px'
      }
  ];


  cfda = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Search and view detailed records of assistance listings.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Use advanced search filters.
        </div>
        <div class="item">
          View listings based on your user role.
        </div>
        <div class="item">
          Grants.gov and USASpending extracts
        </div>
        <div class="item">
          Federal users who are logged in can view, create, update, and manage 
          assistance listings. 
        </div>
      </div>
    `
  }
  
  fbo = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Search and view detailed records of contract opportunities.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Use advanced search filters.
        </div>
        <div class="item">
          View detailed records based on your user role.
        </div>
        <div class="item">
          Federal users who are logged in can create and/or modify a notice.
        </div>
      </div>
    `
  }
  
  fpds = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Search publicly available procurement opportunities and contract actions.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Use advanced search filters.
        </div>
        <div class="item">
          Run standard, static and adhoc reports.
        </div>
        <div class="item">
          Daily extracts and basic API functionality
        </div>
      </div>
    `
  }
  
  sam = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Search and view detailed records of entity registrations.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Role management
        </div>
        <div class="item">
          Reference data services
        </div>
        <div class="item">
          Infrastructure migration
        </div>
      </div>
    `
  }
  
  sam2 = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Search and view detailed records of entity exclusions.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Role management
        </div>
        <div class="item">
          Reference data services
        </div>
        <div class="item">
          Infrastructure migration
        </div>
      </div>
    `
  }
  
  wdol = {
    column1: `
      <h3>What can I do now?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Search for and view DBA and SCA wage determinations.
        </div>
      </div>
    `,
    column2: `
      <h3>What's next?</h3>
      <div class="sam-ui bulleted list">
        <div class="item">
          Improvements to the look and feel of detailed records
        </div>
      </div>
    `
  }

  legacyData:any = [
      {
        title:"Assistance Listings",
        contentType:"grid",
        content: [[this.cfda.column1], [this.cfda.column2]],
        img: "src/assets/img/logos/cfda.png",
        imgActive: "src/assets/img/logos/cfda-c9.png",
        imgWidth: "70%"
      },
      {
        title:"Contract Opportunities",
        contentType:"grid",
        content: [[this.fbo.column1], [this.fbo.column2]],
        img: "src/assets/img/logos/fbo.png",
        imgActive: "src/assets/img/logos/fbo-c9.png",
        imgWidth: "70%"
      },
      {
        title:"Contract Awards",
        contentType:"grid",
        content: [[this.fpds.column1], [this.fpds.column2]],
        img: "src/assets/img/logos/fpds.png",
        imgActive: "src/assets/img/logos/fpds-c9.png",
        imgWidth: "70%"
      },
      {
        title:"Entity Registrations",
        contentType:"grid",
        content: [[this.sam.column1], [this.sam.column2]],
        img: "src/assets/img/logos/sam.png",
        imgActive: "src/assets/img/logos/sam-c9.png",
        imgWidth: "70%"
      },
      {
        title:"Entity Exclusions",
        contentType:"grid",
        content: [[this.sam2.column1], [this.sam2.column2]],
        img: "src/assets/img/logos/sam.png",
        imgActive: "src/assets/img/logos/sam-c9.png",
        imgWidth: "70%"
      },
      {
        title:"Wage Determinations",
        contentType:"grid",
        content: [[this.wdol.column1], [this.wdol.column2]],
        img: "src/assets/img/logos/wdol.png",
        imgActive: "src/assets/img/logos/wdol-c9.png",
        imgWidth: "70%"
      }
  ];

  filter:string = "feature";

  constructor() { }

  getColorClass(type):string{
    if(this.filter === type){
      return "active";
    }
    return "";
  }

  selectFilter(type){
    this.filter = type;
  }

  isCurrentFilter(type){
    return this.filter === type;
  }
   
}
