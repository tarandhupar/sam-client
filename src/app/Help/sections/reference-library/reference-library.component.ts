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
        content:"Here you can learn and navigate the step-by-step process of the grant lifecycle, from the online application phase, pre-award phase, and post award phase.",
        link:"View Grants.gov",
        url:"http://www.grants.gov/web/grants/learn-grants.html",
        img:"src/assets/img/logos/Grants-Gov-Logo.png"
      },
      {
        title:"Benefit Finder",
        content:"An easy-to-use online tool to find government benefit information and your eligibility. ",
        link:"View Benefits.gov",
        url:"https://www.benefits.gov/benefits/benefit-finder#benefits&qc=cat_1",
        img:"src/assets/img/logos/benefits-logo.png"
      },
      {
        title:"Government Benefits, Grants, and Loans",
        content:"All you need to know about affordable housing, grants, and loans are located under this comprehensive website. Go here to learn more. ",
        link:"View USA.gov",
        url:"https://www.usa.gov/benefits-grants-loans",
        img:"src/assets/img/logos/usagov_logo_hi_res.png"
      }
    ],
    Contract:[
      {
        title:"Federal Acquisition Regulation",
        content:"The FAR is your primary resource documenting the policies and procedures that govern acquisitions by all executive agencies of the U.S. federal government.  It provides for coordination, simplicity, and uniformity in the Federal acquisition process.  You can quickly access any section of the Federal Acquisition Regulation electronically by using the online table of contents on this page. ",
        link:"View FAR",
        url:"https://www.acquisition.gov/?q=browsefar",
        img:"src/assets/img/logos/acq_logo.png"
      },
      {
        title:"Compliance Assistance",
        content:"Obtain assistance on government contracts, include wage laws, workers rights, and more. ",
        link:"View Compliance Assistance",
        url:"https://www.dol.gov/whd/govcontracts/",
        img:"src/assets/img/logos/Seal_of_the_United_States_Department_of_Labor.svg.png",
        imgWidth: '50%'
      },
      {
        title:"Request DUNS Number",
        content:"A Duns & Bradstreet (DUNS) Number is a unique 9-digit identification number assigned to businesses worldwide. Go here to look up a DUNS Number or request a new one. ",
        link:"View DUNS Number",
        url:"http://fedgov.dnb.com/webform/index.jsp"
      }
    ]
  };

  private wdolLinks = [
    {
      "text": "Chief Acquisition Officers Council (CAOC) Members",
      "comment": "ALA Page",
      "url": "https://www.acquisition.gov/council-members"
    },
    {
      "text": "See the 2015 List",
      "comment": "Scanned PDF",
      "url": "https://www.wdol.gov/CIRROSTE-2015.pdf",
    },
    {
      "text": "Department of Labor",
      "comment": "",
      "url": "https://www.dol.gov/",
    },
    {
      "text": "SCA Conformance Guide",
      "comment": "Scanned PDF",
      "url": "https://www.dol.gov/whd/regs/compliance/wage/SCADirV5/SCA_Conformance_Guide.pdf",
    },
    {
      "text": "Prevailing Wage Seminars",
      "comment": "",
      "url": "https://www.dol.gov/whd/govcontracts/PrevailingWageSeminars.htm",
    },
    {
      "text": "SCA Directory of Occupations 4th Edition",
      "comment": "",
      "url": "https://www.dol.gov/whd/regs/compliance/wage/index.htm",
    },
    {
      "text": "SCA Directory of Occupations 5th Edition",
      "comment": "Scanned PDF",
      "url": "https://www.dol.gov/whd/regs/compliance/wage/SCADirV5/SCADirectVers5.pdf",
    },
    {
      "text": "SCA Directory of Occupations 5th Edition - Table of Contents and Federal Grade Equivalents",
      "comment": "Scanned PDF",
      "url": "https://www.dol.gov/whd/regs/compliance/wage/SCADirV5/Vers5ContentsTable.pdf"
    },
    {
      "text": "SCA Directory of Occupations 5th Edition - Occupational Index",
      "comment": "Scanned PDF",
      "url": "https://www.dol.gov/whd/regs/compliance/wage/SCADirV5/Vers5SCAIndex.pdf"
    },
    {
      "text": "SCA Directory of Occupations Comparison (Cross-Walk) Report from 4th Edition to 5th Edition",
      "comment": "Scanned PDF",
      "url": "https://www.dol.gov/whd/regs/compliance/wage/SCADirV5/Crosswalk4thEdition2withchanges.pdf"
    },
    {
      "text": "2015 SCA Crosswalk",
      "comment": "Excel download - no warning",
      "url": "None",
    },
    {
      "text": "FAR - Federal Acquisition Regulations",
      "comment": "",
      "url": "https://www.acquisition.gov/?q=browsefar"
    },
    {
      "text": "Federal Register",
      "comment": "",
      "url": "http://www.gpoaccess.gov/fr/index.html",
    },
    {
      "text": "Title 29 Code of Federal Regulations",
      "comment": "",
      "url": "https://www.gpo.gov/fdsys/search/advanced/advsearchpage.action?totalMetadataFields=2&dispatch=advancedsearch&selectedPublicationDate=All+Dates&newAvailableList=GPO&newAvailableList=BUDGET&newAvailableList=CZIC&newAvailableList=CPD&newAvailableList=BILLS&newAvailableList=CCAL&newAvailableList=CPRT&newAvailableList=CDIR&newAvailableList=CDOC&newAvailableList=CHRG&newAvailableList=CREC&newAvailableList=CRECB&newAvailableList=CRI&newAvailableList=CRPT&newAvailableList=ECONI&newAvailableList=ERP&newAvailableList=ERIC&newAvailableList=FR&newAvailableList=GAOREPORTS&newAvailableList=GOVMAN&newAvailableList=HOB&newAvailableList=HJOURNAL&newAvailableList=HMAN&newAvailableList=LSA&newAvailableList=PAI&newAvailableList=PPP&newAvailableList=PLAW&newAvailableList=SMAN&newAvailableList=STATUTE&newAvailableList=USCODE&newAvailableList=USCOURTS&newSelectedList=&newSelectedList=CFR&ycord=0&selectedMetadataField1=content&selectedTextBoxValue1=&link=",
    },
    {
      "text": "Engineer Pamphlet on Service Contract Act Labor Relations",
      "comment": "",
      "url": "https://www.acquisition.gov/Supplemental_Regulations"
    },
    {
      "text": "Department of Agriculture",
      "comment": "",
      "url": "http://www.dm.usda.gov/procurement/policy/agar.htm"
    },
    {
      "text": "Department of Defense",
      "comment": "",
      "url": "http://farsite.hill.af.mil/VFDFARA.HTM",
    },
    {
      "text": "Department of the Air Force",
      "comment": "",
      "url": "http://farsite.hill.af.mil/VFDFARA.HTM",
    },
    {
      "text": "Department of the Army",
      "comment": "",
      "url": "http://farsite.hill.af.mil/VFAFAR1.HTM",
    },
    {
      "text": "Department of the Navy",
      "comment": "",
      "url": "http://www.secnav.navy.mil/rda/Pages/PolicyGuidance.aspx"
    },
    {
      "text": "Department of Energy",
      "comment": "",
      "url": "http://energy.gov/management/downloads/searchable-electronic-department-energy-acquisition-regulation"
    },
    {
      "text": "Department of Housing and Urban Development",
      "comment": "",
      "url": "http://portal.hud.gov/hudportal/HUD?src=/program_offices/cpo/hudar"
    },
    {
      "text": "Department of the Interior",
      "comment": "",
      "url": "http://www.doi.gov/pam/programs/acquisition/pamareg.cfm"
    },
    {
      "text": "Department of Labor",
      "comment": "",
      "url": "http://www.dol.gov/oasam/regs/cfr/48cfr/toc_Part2900-2999/Part2900-2999_toc.htm"
    },
    {
      "text": "Department of State",
      "comment": "",
      "url": "http://www.state.gov/m/a/c8224.htm"
    },
    {
      "text": "Department of Transportation",
      "comment": "",
      "url": "http://www.dot.gov/administrations/assistant-secretary-administration/transportation-acquisition-regulation-tar"
    },
    {
      "text": "Department of Treasury(PDF)",
      "comment": "",
      "url": "http://www.treasury.gov/about/organizational-structure/offices/Mgt/Pages/ProcurementPolicy-Regulations.aspx"
    },
    {
      "text": "Environmental Protection Agency",
      "comment": "",
      "url": "https://www.epa.gov/contracts",
    },
    {
      "text": "General Services Administration",
      "comment": "",
      "url": "https://www.acquisition.gov/?q=browsegsam"
    },
    {
      "text": "National Aeronautics and Space Administration",
      "comment": "",
      "url": "https://www.hq.nasa.gov/office/procurement/regs/1822.htm",
    },
    {
      "text": "Nuclear Regulatory Commission",
      "comment": "",
      "url": "https://www.nrc.gov/about-nrc/contracting/48cfr-ch20.html",
    },
    {
      "text": "Significant All Agency Memos Issued by DOL",
      "comment": "Internal",
      "url": "https://www.wdol.gov/aam.aspx",
    },
    {
      "text": "Davis-Bacon Act",
      "comment": "",
      "url": "https://www.dol.gov/whd/contracts/dbra.htm",
    },
    {
      "text": "Service Contract Act",
      "comment": "",
      "url": "https://www.dol.gov/whd/contracts/sca.htm",
    },
    {
      "text": "Employment Laws Assistance for Workers and Small Businesses",
      "comment": "",
      "url": "http://webapps.dol.gov/elaws/",
    },
    {
      "text": "Office of the DOL/Administrative Law Judge (Wage Appeal Board Decisions)",
      "comment": "",
      "url": "https://www.oalj.dol.gov/PUBLIC/DBA_SCA/REFERENCES/CASELISTS/WABLIST.HTM",
    },
    {
      "text": "(Administrative Review Board Decisions and Library)",
      "comment": "",
      "url": "https://www.dol.gov/arb/",
    },
    {
      "text": "DBA - Information on Apprentices and Trainees",
      "comment": "",
      "url": "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjfw9q-tprVAhWEgj4KHc0NDkIQFggmMAA&url=https%3A%2F%2Fwww.dol.gov%2Fwhd%2Fgovcontracts%2FPresentations%2FPPT12-Apprentices_NN.pptx&usg=AFQjCNEbOViBRUqfG-uUNkyrGJXjEnU8ow"
    },
    {
      "text": "DOL Approved State Apprenticeship Agencies",
      "comment": "",
      "url": "https://www.doleta.gov/OA/stateagencies.cfm",
    },
    {
      "text": "DOL Prevailing Wage Resource Book",
      "comment": "",
      "url": "https://www.dol.gov/whd/recovery/pwrb/toc.htm",
    },
    {
      "text": "Department of Defense (DoD) Glossary",
      "comment": "",
      "url": "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=8&cad=rja&uact=8&sqi=2&ved=0ahUKEwjKyOXPtprVAhXCcz4KHUvtDbcQFghGMAc&url=https%3A%2F%2Fdap.dau.mil%2Faphome%2Fdas%2FPages%2FGlossaryandAcronyms.aspx&usg=AFQjCNGTKLHg0-PX2euCNddBhvy8R12mQg"
    },
    {
      "text": "Federal Acquisition Institute (FAI) Glossary",
      "comment": "",
      "url": "https://www.fai.gov/pdfs/glossary.pdf",
    },
    {
      "text": "Veterans Employment and Training Service - VETS 100 Federal Contractor Program",
      "comment": "",
      "url": "https://www.dol.gov/vets/vets4212.htm"
    },
    {
      "text": "Office of Federal Contract Compliance Programs (OFCCP) National Pre-Award Registry",
      "comment": "",
      "url": "https://ofccp.dol-esa.gov/preaward/pa_reg.html"
    },
    {
      "text": "OFCCP's Construction Industry Goals for Minority and Female Participation",
      "comment": "",
      "url": "https://www.wdol.gov/docs/ofccpgoals.PDF",
    },
    {
      "text": "OFCCP Regional Offices",
      "comment": "",
      "url": "https://www.dol.gov/ofccp/contacts/ofcpkeyp.htm",
    },
    {
      "text": "DOL/Wage and Hour's ",
      "comment": "",
      "url": "https://www.dol.gov/whd/FOH/index.htm",
    },
    {
      "text": "Acquisition Network",
      "comment": "",
      "url": "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjRsLDEt5rVAhUCYT4KHXbPCAwQFggiMAA&url=https%3A%2F%2Fwww.acquisition.gov%2F&usg=AFQjCNGcGznmE2dbllDwV6Wqb8Cn5VZfYw"
    },
    {
      "text": "Chief Acquisition Officers Council",
      "comment": "",
      "url": "https://www.acquisition.gov/cao-home",
    },
    {
      "text": "Office of Labor Relations, U. S. Department of Housing and Urban Development",
      "comment": "",
      "url": "https://portal.hud.gov/hudportal/HUD?src=/program_offices/davis_bacon_and_labor_standards",
    },
    {
      "text": "SF308 (217 KB PDF) - Request for DBA Project Wage Determination",
      "comment": "Internal",
      "url": "https://www.wdol.gov/docs/sf308x.pdf"
    },
    {
      "text": "Cross Index for Labor Standards: Cross-walk from Title 29 CFR to FAR (Title 41 CFR)",
      "comment": "Internal",
      "url": "https://www.wdol.gov/crossindex.aspx",
    },
    {
      "text": "SF1444 - Request for Authorization of Additional Classification and Rate",
      "comment": "",
      "url": "https://www.dol.gov/whd/contracts/dbra.htm",
    },
    {
      "text": "FAQs",
      "comment": "Internal",
      "url": "https://www.wdol.gov/conform-faqs.pdf",
    },
    {
      "text": "Conformances under the Service Contract Act",
      "comment": "Internal",
      "url": "https://www.wdol.gov/sca_confrmnce.aspx",
    },
    {
      "text": "Conformances under the Davis-Bacon Act",
      "comment": "",
      "url": "https://www.wdol.gov/db_confrmnce.aspx",
    },
  ];

  private imageLibraryNotification:string = "";

  constructor() { }

  onImageLibrarySelect(val){
    this.imageLibraryNotification = val;
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }

}
