import {Observable} from "rxjs/Observable";
import {AuthorizationPipe} from "../../pipes/authorization.pipe";
import {TestBed} from '@angular/core/testing';
import {ProgramPage} from "../../assistance-listing.page";
import {FinancialObligationChart} from "../../assistance-listing.chart";
import {HistoricalIndexLabelPipe} from "../../pipes/historical-index-label.pipe";
import {AssistanceProgramResult} from "../program-result/assistance-program-result.component";
import {FalWorkspacePage} from "../assistance-listing-workspace.page";
import {RejectFALComponent} from "../../assistance-listing-operations/workflow/reject/reject-fal.component";
import {FeedsPage} from "./feeds.page";
import {FALFormChangeRequestActionComponent} from "../../assistance-listing-change-request/fal-form-change-request-action.component";
import {FALFormChangeRequestComponent} from "../../assistance-listing-change-request/fal-form-change-request.component";
import {FALSubmitComponent} from "../../assistance-listing-operations/workflow/submit/fal-form-submit.component";
import {RequestLabelPipe} from "../../pipes/request-label.pipe";
import {FALReviewComponent} from "../../assistance-listing-operations/workflow/review/fal-review.component";
import {FalRegionalAssistanceLocationsPage} from "../../regional-assistance-locations/regional-assistance-location.page";
import {RegionalAssistanceLocationResult} from "../../regional-assistance-locations/location-result/regional-assistance-location-result.component";
import {ActionHistoryPipe} from "../../pipes/action-history.pipe";
import {ActionHistoryLabelPipe} from "../../pipes/action-history-label.pipe";
import {RequestTypeLabelPipe} from "../../pipes/request-type-label.pipe";
import {FALRegionalAssistanceFormComponent} from "../../regional-assistance-locations/regional-assistance-operations/regional-assistance-form.component";
import {FALPublishComponent} from "../../assistance-listing-operations/workflow/publish/fal-publish.component";
import {FormatFederalHierarchyType} from "../../pipes/format-federal-hierarchy-type.pipe";
import {CfdaNumbersPage} from "../cfda-numbers/cfda-numbers.page";
import {CFDANumberManagementComponent} from "../cfda-number-management/fal-form-cfda-number-management.component";
import {PipesModule} from "../../../app-pipes/app-pipes.module";
import {AppComponentsModule} from "../../../app-components/app-components.module";
import {ProgramService} from "../../../../api-kit/program/program.service";
import {FALFormModule} from "../../assistance-listing-operations/fal-form.module";
import {FALComponentsModule} from "../../components/index";
import { CommonModule } from '@angular/common';
import {routing} from "../../assistance-listing.route";
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import * as Cookies from 'js-cookie';
import { async } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';
import {FALFormErrorService} from "../../assistance-listing-operations/fal-form-error.service";
import {SamUIKitModule} from "sam-ui-kit/index";
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";
import {AccessRestrictedPage} from "../program-result/testauthenvironment.page";
import {DictionaryService} from "../../../../api-kit/dictionary/dictionary.service";



let comp;
let fixture;

var MockProgramService = {
  getPermissions: (cookie: string, permissions: any) => {
    return Observable.of({
      "ORG_LEVELS":
      {
        "org":"100004222",
        "level":"all"
      }
    });
  },
  getRequests: (org) => {
    return Observable.of({
      "_embedded": {
        "programRequestList": [
          {
            "programId": "0056a8dc49e379c40276bc8383557718",
            "requestType": {
              "publicValue": "Request Agency Change",
              "value": "agency_request"
            },
            "entryDate": 1506543215735,
            "createdBy": "AGENCY_SUBMITTER",
            "modifiedDate": null,
            "modifiedBy": null,
            "reason": "Agency Submitter sending DHS change request",
            "data": "{\"organizationId\": 100011942}",
            "completed": false,
            "program": {
              "title": "Maternal and Child Health Federal Consolidated Programs",
              "website": "http://www.hrsa.gov",
              "contacts": {
                "local": {
                  "flag": "appendix",
                  "description": "Associate Administrator for Maternal and Child Health, Health Resources and Services Administration, Department of Health and Human Services, Room 18W37, 5600 Fishers Lane, Rockville, MD 20857. Telephone: (301) 443-2170."
                },
                "headquarters": [
                  {
                    "zip": "20857",
                    "city": "Rockville",
                    "phone": "(301) 443-2170.",
                    "state": "MD",
                    "country": "US",
                    "fullName": "Associate Administrator for Maternal and Child Health,",
                    "contactId": "828137e3399e76b1b9a61e949565d271",
                    "streetAddress": "5600 Fishers Lane, Room 18W37"
                  }
                ]
              },
              "projects": {
                "isApplicable": false
              },
              "financial": {
                "accounts": [
                  {
                    "code": "75-0354-0-1-550"
                  }
                ],
                "treasury": {
                  "tafs": [
                    {
                      "accountCode": "75-0354",
                      "departmentCode": "75"
                    }
                  ]
                },
                "description": "$3,419 to $3,996,711; $267,663\r\n",
                "obligations": [
                  {
                    "values": [
                      {
                        "year": 2017,
                        "estimate": 157449942
                      },
                      {
                        "year": 2016,
                        "actual": 133938299
                      },
                      {
                        "year": 2018,
                        "estimate": 81146575
                      }
                    ],
                    "description": "FY2017 includes $20M for Zika response.",
                    "obligationId": "8667658790cc3061e1ab964a70974880",
                    "isRecoveryAct": false,
                    "assistanceType": "0003003"
                  }
                ],
                "accomplishments": {
                  "isApplicable": false
                },
                "isFundedCurrentFY": true
              },
              "objective": "To carry out special maternal and child health (MCH) projects of regional and national significance; to conduct training and research; to conduct genetic disease testing, counseling, and information development and dissemination programs; for the screening of newborns for sickle cell anemia, and other genetic disorders; and to support comprehensive hemophilia diagnostic and treatment centers. These grants are funded with a set-aside from the MCH Block grant program. SPRANS grants are funded with 15 percent of the Block Grant appropriation of up to $600 million. When the appropriation exceeds $600 million, 12.75 percent of the amount over $600 million is set aside for the Community Integrated Service Systems grants. 15 percent of the balance remaining over $600 million is also for SPRANS. The CISS program is to develop and expand the following: (1) Home visitation; (2) increased participation of obstetricians and pediatricians; (3) integrated service delivery systems; (4) maternal and child health centers for women and infants, under the direction of a not-for-profit hospital; (5) services for rural populations; and (6)  integrated state and community service systems for children and youth with special health care needs. First funded in 2004, the Heritable Disorders Program is established to improve the ability of States to provide newborn and child screening for heritable disorders and affect the lives of all of the nation’s infants and children. Newborn and child screening occur at intervals across the life span of every child. Newborn screening universally provides early identification and follow-up for treatment of infants affected by certain genetic, metabolic, hormonal and/or functional conditions. It is expected that newborn and child screening will expand as the capacity to screen for genetic and congenital conditions expands. ",
              "assistance": {
                "appeal": {
                  "interval": "8"
                },
                "renewal": {
                  "interval": "9",
                  "description": "After initial award, projects may be renewed annually up to the limit of the project period upon the submission and approval of a satisfactory continuation application."
                },
                "approval": {
                  "interval": "9",
                  "description": "From 3 to 6 months."
                },
                "deadlines": {
                  "flag": "contact"
                },
                "awardProcedure": {
                  "description": "Notification is made in writing by a Notice of Award.\r\n\r\n"
                },
                "selectionCriteria": {
                  "description": "General criteria are described in Program Regulations 45 CFR 51, and specific criteria are included in the program guidance materials provided with application kits. Contact Central Office for details.",
                  "isApplicable": true
                },
                "applicationProcedure": {
                  "description": "HRSA requires all applicants to apply electronically through Grants.gov.\r\n\r\nAll qualified applications will be forwarded to an objective review committee.  Based on the advice of the objective review committee, the HRSA program official with delegated authority is responsible for final selection and funding decisions.\r\n\r\n",
                  "isApplicable": true
                },
                "preApplicationCoordination": {
                  "environmentalImpact": {
                    "reports": [
                      {
                        "isSelected": false,
                        "reportCode": "statement"
                      },
                      {
                        "isSelected": false,
                        "reportCode": "assessment"
                      },
                      {
                        "isSelected": false,
                        "reportCode": "ExecutiveOrder12372"
                      },
                      {
                        "isSelected": true,
                        "reportCode": "otherRequired"
                      }
                    ]
                  }
                }
              },
              "compliance": {
                "audit": {
                  "isApplicable": true
                },
                "records": {
                  "description": "Grantees are required to maintain grant accounting records for 3 years after the date they submit the Federal Financial Report (FFR).  If any litigation, claim, negotiation, audit, or other action involving the award has been started before the expiration of the 3-year period, the records shall be retained until completion of the action and resolution of all issues which arise from it, or until the end of the regular 3-year period, whichever is later."
                },
                "reports": [
                  {
                    "code": "program",
                    "isSelected": true,
                    "description": "Please refer to \"progress reports\" information below."
                  },
                  {
                    "code": "cash",
                    "isSelected": false
                  },
                  {
                    "code": "progress",
                    "isSelected": true,
                    "description": "The awardee will be required to submit performance and progress reports as well as status-federal financial reports (see the program announcement and notice of award for details for each required report). The awardee must submit a quarterly electronic Federal Financial Report (FFR) Cash Transaction Report via the Payment Management System within 30 days of the end of each calendar quarter.  A Federal Financial Report (SF-425) according to the following schedule:  http://www.hrsa.gov/grants/manage/technicalassistance/federalfinancialreport/ffrschedule.pdf.  A final report is due within 90 days after the project period ends. If applicable, the awardee must submit a Tangible Personal Property Report (SF-428) and any related forms within 90 days after the project period ends. New awards (“Type 1”) issued under this notice of funding opportunity are subject to the reporting requirements of the Federal Funding Accountability and Transparency Act (FFATA) of 2006 (Pub. L. 109–282), as amended by section 6202 of Public Law 110–252, and implemented by 2 CFR Part 170. Grant and cooperative agreement recipients must report information for each first-tier subaward of $25,000 or more in federal funds and executive total compensation for the recipient’s and subrecipient’s five most highly compensated executives as outlined in Appendix A to 2 CFR Part 170 (FFATA details are available online at http://www.hrsa.gov/grants/ffata.html). Competing continuation awardees, etc. may be subject to this requirement and will be so notified in the Notice of Award. "
                  },
                  {
                    "code": "expenditure",
                    "isSelected": false
                  },
                  {
                    "code": "performanceMonitoring",
                    "isSelected": true,
                    "description": "Refer to the notice of funding opportunity for further information."
                  }
                ],
                "documents": {
                  "description": "This program is subject to the provisions of 45 CFR Part 75 State, local and tribal governments, institutions of higher education, hospitals, other nonprofit organizations and commercial organizations, as applicable. 42 CFR Part 51a Project Grants for Maternal and Child and Health.\r\n\r\nHRSA awards are subject to the requirements of the HHS Grants Policy Statement (HHS GPS) that are applicable based on recipient type and purpose of award.  The HHS GPS is available at http://www.hrsa.gov/grants.",
                  "isApplicable": true
                },
                "CFR200Requirements": {
                  "questions": [
                    {
                      "code": "subpartB",
                      "isSelected": false
                    },
                    {
                      "code": "subpartC",
                      "isSelected": true
                    },
                    {
                      "code": "subpartD",
                      "isSelected": false
                    },
                    {
                      "code": "subpartE",
                      "isSelected": true
                    },
                    {
                      "code": "subpartF",
                      "isSelected": true
                    }
                  ],
                  "description": "HRSA requires all applicants to apply electronically through Grants.gov.\r\n\r\nAll qualified applications will be forwarded to an objective review committee.  Based on the advice of the objective review committee, the HRSA program official with delegated authority is responsible for final selection and funding decisions.\r\n\r\n"
                },
                "formulaAndMatching": {
                  "types": {
                    "moe": false,
                    "formula": false,
                    "matching": true
                  },
                  "matching": {
                    "percent": "0",
                    "description": "Opportunities may include matching requirements.  Please refer to the notice of funding opportunity.",
                    "requirementFlag": "voluntary"
                  }
                }
              },
              "fiscalYear": 2017,
              "eligibility": {
                "usage": {
                  "rules": {
                    "description": "Training grants are made to institutions of higher learning for training personnel for health care and related services for mothers and children. Research grants are for the purpose of research activities which show promise of a substantial contribution to the advancement of maternal and child health services. Genetic grants are for genetic disease testing, counseling and information development and dissemination. Hemophilia grants are for the support of centers which provide hemophilia diagnostic and treatment services. Sickle cell disease grants are made to support follow up for infants with sickle cell identified through newborn screening. Heritable Disorders grants are made to improve the ability of States to provide newborn and child screening for heritable disorders, coordinate services and long-term follow-up for newborns and children identified with a condition through newborn screening, and to provide newborn screening education resources to patients, parents, and families. Environmental health grants are made to decrease maternal and child morbidity and mortality associated with pre-and post-natal environmental exposures. Other special project grants are designed to support activities of a demonstration nature which are designed to improve services for mothers and children.\r\n\r\n\r\nRestricted Uses: Indirect costs that are allowed for administrative costs incurred as a result of the training grants project, are limited to 8 percent of direct costs."
                  },
                  "loanTerms": {
                    "isApplicable": false
                  },
                  "restrictions": {
                    "isApplicable": false
                  },
                  "discretionaryFund": {
                    "isApplicable": false
                  }
                },
                "applicant": {
                  "types": [
                    "0009",
                    "0011",
                    "0015",
                    "0017",
                    "0019",
                    "0021",
                    "0035",
                    "0043"
                  ],
                  "description": "Training grants may be made to public or private nonprofit institutions of higher learning. Research grants may be made to public or private nonprofit institutions of higher learning and public or private nonprofit private agencies and organizations engaged in research or in Maternal and Child Health (MCH) or Children with Special Health Care Needs (CSHCN) programs. Any public or private entity is eligible for hemophilia, genetics, and environmental health grants and other special project grants, including CISS. Eligible entities for the Heritable Disorders Program include a State or a political subdivision of a State; a consortium of 2 or more States of political subdivisions of States; a territory; a health facility or program operated by or pursuant to a contract with or grant from the Indian Health Service; or any other entity with appropriate expertise in newborn screening, as determined by the Secretary. "
                },
                "limitation": {
                  "awarded": "other",
                  "description": "Awards are made on an annual basis for the duration of the grant period, and payments are made through an Electronic Transfer System or Cash Demand System.",
                  "awardedDescription": "Grantees draw down funds, as necessary, from the Payment Management System (PMS).  PMS is the centralized web based payment system for HHS awards.\r\n\r\n"
                },
                "beneficiary": {
                  "types": [
                    "13",
                    "21",
                    "23",
                    "44",
                    "53",
                    "54"
                  ],
                  "description": "For training grants: (1) Trainees in the health professions related to MCH; and (2) mothers and children who receive services through training programs. For research grants: public or private nonprofit agencies and organizations engaged in research in MCH or CSHCN programs. For hemophilia, sickle cell, thalassemia genetics, or environmental health, and other special projects: (1) Public or private agencies, organizations and institutions; and (2) mothers and children, and persons with genetic conditions including hemophilia (any age), who receive services through the programs.",
                  "isSameAsApplicant": false
                },
                "documentation": {
                  "description": "Applicants should review the individual HRSA notice of funding opportunity issued under this CFDA program for any required proof or certifications which must be submitted prior to or simultaneous with submission of an application package.",
                  "isApplicable": true
                },
                "assistanceUsage": {
                  "types": [
                    "16",
                    "28"
                  ]
                }
              },
              "subjectTerms": [
                "0673007",
                "0673010",
                "0673015",
                "0673019"
              ],
              "programNumber": "93.110",
              "authorizations": {
                "list": [
                  {
                    "act": {
                      "description": "Social Security Act, Title V, Section 502(a)(1) and (b)(1), as amended; 42 U.S.C. 702.; Section 1109, 1111 and 1112 of the Public Health Service Act and Section 399T of the Public Health Service Act."
                    },
                    "authorizationId": "eaeb81d7dcfdef7835574323f0f775cf",
                    "authorizationTypes": {
                      "USC": false,
                      "act": true,
                      "statute": false,
                      "publicLaw": false,
                      "executiveOrder": false
                    }
                  }
                ]
              },
              "organizationId": "100008531",
              "assistanceTypes": [
                "0003003"
              ],
              "functionalCodes": [
                "0012006",
                "0012011",
                "0012014",
                "0012020"
              ],
              "relatedPrograms": [
                "088cb1964750de62a00c705545b6a3c7",
                "0c58d000bdb708b60aef03f9a7123f4d",
                "3f41bf8e4975db248166cef3bce87c22",
                "576ea16216acab533e429dbfdbb2abad",
                "805a8340fe393ba8cef7d7a1a26988a1",
                "82557315d27d8321d56bedafcc650ecb",
                "be36a26b81517f57bf1a8902f2a24f7b"
              ],
              "alternativeNames": [
                "Special Projects of Regional and National Significance (SPRANS), including the Community Integrated Service Systems (CISS); and the Heritable Disorders Program"
              ],
              "status": "published",
              "archived": false
            },
            "actionType": null,
            "id": "b71f8d007d794d249f1c8de889831e3d"
          },
          {
            "programId": "c3fae92b13825ff9b8cdf9e3c8f7ac6b",
            "requestType": {
              "publicValue": "Request Archive",
              "value": "archive_request"
            },
            "entryDate": 1506543119609,
            "createdBy": "AGENCY_SUBMITTER",
            "modifiedDate": null,
            "modifiedBy": null,
            "reason": "Agency Submitter Archive request",
            "data": "{}",
            "completed": false,
            "program": {
              "title": "PPHF Geriatric Education Centers ",
              "website": "http://www.hrsa.gov",
              "contacts": {
                "local": {
                  "flag": "none"
                },
                "headquarters": [
                  {
                    "zip": " 20857 ",
                    "city": "Rockville",
                    "email": "ntumosa@hrsa.gov",
                    "phone": "301-443-5626",
                    "state": "MD",
                    "country": "US",
                    "fullName": " Nina Tumosa, PhD, Medical Training and Geriatrics Branch, Division of Medicine and Dentistry, Bureau of Health Workforce",
                    "contactId": "e554226fa828735f06035909c6d789e9",
                    "streetAddress": "5600 Fishers Lane, Room 15N194B"
                  }
                ]
              },
              "projects": {
                "isApplicable": false
              },
              "financial": {
                "accounts": [
                  {
                    "code": "75-0353-0-1-552",
                    "description": "PPHF"
                  },
                  {
                    "code": "75-0350-0-1-550"
                  }
                ],
                "treasury": {
                  "tafs": [
                    {
                      "accountCode": "75-0350",
                      "departmentCode": "75"
                    },
                    {
                      "accountCode": "75-0353",
                      "departmentCode": "75"
                    }
                  ]
                },
                "description": "FY 16 Range:  $568,708-$842,833.  Average Award:  $815,819\r\nFY 17 Range:  $555,046-$850,000.  Average Award:  $814,540.  \r\nFY 18 Range:  $0.  Average Award:  $0.\r\n",
                "obligations": [
                  {
                    "values": [
                      {
                        "year": 2016,
                        "actual": 35872006,
                        "estimate": 35872006
                      },
                      {
                        "year": 2017,
                        "estimate": 35839723
                      },
                      {
                        "flag": "ena",
                        "year": 2018,
                        "estimate": 0
                      }
                    ],
                    "obligationId": "0a4b5a2e561e124ff04663590e916933",
                    "isRecoveryAct": false,
                    "assistanceType": "0003003"
                  },
                  {
                    "values": [
                      {
                        "year": 2018,
                        "estimate": 0
                      },
                      {
                        "year": 2017,
                        "estimate": 35839723
                      },
                      {
                        "year": 2016,
                        "actual": 35872006,
                        "estimate": 0
                      }
                    ],
                    "obligationId": "5339dec68c395bdf9c3fef57d58443df",
                    "isRecoveryAct": false,
                    "assistanceType": "0003003"
                  }
                ],
                "accomplishments": {
                  "isApplicable": false
                },
                "isFundedCurrentFY": true
              },
              "objective": "The purpose of this cooperative agreement program is to establish and operate geriatric education centers that will implement the Geriatric Workforce Enhancement Program (GWEP) to develop a health care workforce that maximizes patient and family engagement and improves health outcomes for older adults by integrating geriatrics with primary care. A GWEP: a) improves the training of health professionals and individuals in geriatrics, including geriatric residencies, traineeships, or fellowships; b) develops and disseminates curricula relating to the treatment of the health problems of elderly individuals; c) supports the training and retraining of faculty to provide instruction in geriatrics; d) supports continuing education of health professionals who provide geriatric care; e) provides students with clinical training in geriatrics in nursing homes, chronic and acute disease hospitals, ambulatory care centers, and senior centers; or f) establishes traineeships for individuals who are preparing for advanced education nursing degrees in geriatric nursing, long-term care, gero-psychiatric nursing or other nursing areas that specialize in the care of the elderly population. Special emphasis is on providing the primary care workforce with the knowledge and skills to care for older adults and on collaborating with community partners to address gaps in health care for older adults through individual, system, community, and population level changes. Interprofessional collaboration is an essential component of all project activities, and medicine must be one of the professions included in all interprofessional activities.",
              "assistance": {
                "appeal": {
                  "interval": "8"
                },
                "renewal": {
                  "interval": "9",
                  "description": "Depending on Agency priorities and availability of funding, during the final budget year of the approved project period competing continuation applications may be solicited from interested applicants."
                },
                "approval": {
                  "interval": "9",
                  "description": "Approximately 120 - 180 days after receipt of applications."
                },
                "deadlines": {
                  "flag": "contact"
                },
                "awardProcedure": {
                  "description": "Notification of award is made in writing (electronic) through a Notice of Award."
                },
                "selectionCriteria": {
                  "description": "Procedures for assessing the technical merit of grant applications have been instituted to provide an objective review of applications and to assist the applicant in understanding the standards against which each application will be judged. Critical indicators have been developed for each review criterion to assist the applicant in presenting pertinent information related to that criterion and to provide the reviewer with a standard for evaluation. Competing applications are reviewed by non-Federal expert consultant(s) for technical merit recommendations.  Applications will be reviewed and evaluated against the following criteria:  (1) Purpose and Need; (2) Response to Program Purpose; (3) Impact; (4) Organizational Information, Resources and Capabilities; and (5) Support Requested.  See the most recent Notice of Funding Opportunity for detailed selection criteria.\r\n",
                  "isApplicable": true
                },
                "applicationProcedure": {
                  "description": "HRSA requires all applicants to apply electronically through Grants.gov.\r\n\r\nAll eligible, qualified applications will be forwarded to an objective review committee.  Based on the advice of the objective review committee, the HRSA program official with delegated authority is responsible for final selection and funding decisions. Notification is made in writing by a Notice of Award. \r\n\r\nThe GWEP does not anticipate a new competing cycle until FY 2018. The program will continue to support forty-four (44) noncompeting continuation cooperative agreements through FY 2017.\r\n\r\n",
                  "isApplicable": true
                },
                "preApplicationCoordination": {}
              },
              "compliance": {
                "audit": {
                  "isApplicable": true
                },
                "records": {
                  "description": "Recipients are required to maintain grant accounting records 3 years after the date they submit the Federal Financial Report (FFR).  If any litigation, claim, negotiation, audit or other action involving the award has been started before the expiration of the 3 year period, the records shall be retained until completion of the action and resolution of all issues which arise from it, or until the end of the regular 3 year period, whichever is later.\r\n"
                },
                "reports": [
                  {
                    "code": "program",
                    "isSelected": true,
                    "description": "Both program and financial reports are required. The recipient will be required to submit annual performance and progress reports.  A Federal Financial Report (SF-425) is required according to the schedule in HRSA’s Application Guide.  A final report is due within 90 days after the project period ends.  If applicable, the recipient must submit a Tangible Personal Property Report (SF-428) and any related forms within 90 days after the project period ends.  New awards (“Type 1”) issued under this notice of funding opportunity are subject to the reporting requirements of the Federal Funding Accountability and Transparency Act (FFATA) of 2006 (Pub. L. 109–282), as amended by section 6202 of Public Law 110–252, and implemented by 2 CFR Part 170.  Grant and cooperative agreement recipients must report information for each first-tier subaward of $25,000 or more in federal funds and executive total compensation for the recipient’s and subrecipient’s five most highly compensated executives as outlined in Appendix A to 2 CFR Part 170 (The FFATA details are available online at http://www.hrsa.gov/grants/ffata.html).  Competing continuation recipients may be subject to this requirement and will be so notified in the Notice of Award. "
                  },
                  {
                    "code": "cash",
                    "isSelected": false
                  },
                  {
                    "code": "progress",
                    "isSelected": false
                  },
                  {
                    "code": "expenditure",
                    "isSelected": false
                  },
                  {
                    "code": "performanceMonitoring",
                    "isSelected": false
                  }
                ],
                "documents": {
                  "description": "All administrative and audit requirements and the cost principles that govern Federal monies associated with this activity will be subject to the Uniform Guidance 2 CFR 200 as codified by HHS at 45 CFR 75. \r\n\r\nHRSA awards are also subject to the requirements of the HHS Grants Policy Statement (HHS GPS) that are applicable based on recipient type and purpose of award.  The HHS GPS is available at http://www.hrsa.gov/grants/hhsgrantspolicy.pdf.\r\n",
                  "isApplicable": true
                },
                "CFR200Requirements": {
                  "questions": [
                    {
                      "code": "subpartB",
                      "isSelected": false
                    },
                    {
                      "code": "subpartC",
                      "isSelected": true
                    },
                    {
                      "code": "subpartD",
                      "isSelected": false
                    },
                    {
                      "code": "subpartE",
                      "isSelected": true
                    },
                    {
                      "code": "subpartF",
                      "isSelected": true
                    }
                  ],
                  "description": "HRSA requires all applicants to apply electronically through Grants.gov.\r\n\r\nAll eligible, qualified applications will be forwarded to an objective review committee.  Based on the advice of the objective review committee, the HRSA program official with delegated authority is responsible for final selection and funding decisions. Notification is made in writing by a Notice of Award. \r\n\r\nThe GWEP does not anticipate a new competing cycle until FY 2018. The program will continue to support forty-four (44) noncompeting continuation cooperative agreements through FY 2017.\r\n\r\n"
                },
                "formulaAndMatching": {
                  "moe": {
                    "description": "The recipient must agree to maintain non-federal funding for grant activities at a level which is not less than expenditures for such activities during the fiscal year prior to receiving the award."
                  },
                  "types": {
                    "moe": true,
                    "formula": false,
                    "matching": false
                  }
                }
              },
              "fiscalYear": 2017,
              "eligibility": {
                "usage": {
                  "rules": {
                    "description": "Projects must develop collaborations with at least one non-profit community organization and one primary care facility to ensure integrated delivery systems. Grantees must use funds for the following activities: \r\n1. Develop and implement integrated geriatrics and primary care health care delivery systems to provide clinical experiences for trainees with the goal of improving comprehensive, coordinated care for older adults; \r\n2. Partner with, or create as appropriate, community-based outreach resource centers to address the learning and support needs of older adults, their families and their caregivers. Such programs must address local needs, taking into account available care settings, social resources, and community culture. Topics in addressing psychosocial needs, disease self-management, patient engagement, and population health are encouraged; and\r\n3. Provide training to individuals who will provide care to older adults within the context of the above focus areas. Categories of individuals may include: patients, families, caregivers, direct care providers, primary care providers, students, residents, fellows, and faculty.\r\n4. In addition, projects may include Alzheimer’s disease and related dementias education and training for patients, families, caregivers, direct care providers, and health professions students, faculty, and providers.\r\n\r\nRestricted Uses: Student support through stipends, tuition, and fees from other funding sources is not eligible for support. The exception to this restriction is individuals who are preparing for advanced education nursing degrees in geriatric nursing, long-term care, gero-psychiatric nursing or other nursing areas that specialize in the care of the elderly population. These individuals are eligible for traineeship support. Funds may not be used for the constructions of buildings or the acquisition of land.\r\n\r\nindirect costs under training awards to organizations other than State, local or American Indian tribal governments will be budgeted and reimbursed at 8 percent of modified total direct costs rather than on the basis of a negotiated rate agreement, and are not subject to upward or downward adjustment. Funds may not be used for trainee costs, the constructions of buildings or the acquisition of land.\r\n"
                  },
                  "loanTerms": {
                    "isApplicable": false
                  },
                  "restrictions": {
                    "description": "Funds may not be used for trainee costs, the constructions of buildings or the acquisition of land.",
                    "isApplicable": true
                  },
                  "discretionaryFund": {
                    "isApplicable": false
                  }
                },
                "applicant": {
                  "types": [
                    "0015",
                    "0020",
                    "0035"
                  ],
                  "description": "Eligible applicants are accredited health professions schools and programs. The following entities are eligible applicants: Schools of Allopathic Medicine; Schools of Veterinary Medicine; Schools of Dentistry; Schools of Public Health; Schools of Osteopathic Medicine; Schools of Chiropractic; Schools of Pharmacy; Physician Assistant Programs; Schools of Optometry; Schools of Allied Health; Schools of Podiatric Medicine; and Schools of Nursing\r\nThe following accredited graduate programs are also eligible applicants: Health Administration; and Behavioral Health and Mental Health Practice, including: Clinical Psychology, Clinical Social Work, Professional Counseling, and Marriage and Family Therapy.\r\nIn addition these are also eligible entities under GWEP: a health care facility, a program leading to certification as a certified nurse assistant, a partnership of a school of nursing such and facility, or a partnership of such a program and facility\r\n\r\nFaith-based and community-based organizations, Federally Recognized Indian Tribal Governments and Native American Organizations may apply if otherwise eligible.\r\n\r\nApplicants must be located in the United States, the District of Columbia, the Commonwealth of Puerto Rico, the Commonwealth of the Northern Mariana Islands, the U.S Virgin Islands, Guam, American Samoa, the Republic of Palau, the Republic of the Marshall Islands, or the Federated States of Micronesia. \r\n"
                },
                "limitation": {
                  "awarded": "other",
                  "description": "This funding opportunity provides support for a three-year project period.",
                  "awardedDescription": "Recipients draw down funds, as necessary, from the Payment Management System (PMS), the centralized web based payment system for HHS awards."
                },
                "beneficiary": {
                  "types": [
                    "16",
                    "21",
                    "7"
                  ],
                  "description": "Accredited health professions schools",
                  "isSameAsApplicant": false
                },
                "documentation": {
                  "description": "Applicants should review the individual HRSA Notice of Funding Opportunity issued under this CFDA program for any required proof or certifications which must be submitted with an application package.",
                  "isApplicable": true
                },
                "assistanceUsage": {
                  "types": [
                    "16",
                    "31"
                  ]
                }
              },
              "subjectTerms": [
                "0019",
                "0453"
              ],
              "programNumber": "93.969",
              "authorizations": {
                "list": [
                  {
                    "act": {
                      "description": "GEC:  Public Health Service Act, Title VII, Section 753(a), Health Professions Education Partnerships Act of 1998, Public Law 105-392 as amended by the Patient Protection and Affordable Care Act of 2010, Public Law 111-148. "
                    },
                    "authorizationId": "74689332d3cfb09ed6fbca2fefaa35bc",
                    "authorizationTypes": {
                      "USC": false,
                      "act": true,
                      "statute": false,
                      "publicLaw": false,
                      "executiveOrder": false
                    }
                  },
                  {
                    "act": {
                      "description": "GWEP: Section 750 and 753(a) of the Public Health Service Act, Health Professions Education Partnerships Act of 1998, Public Law 105-392 as amended by the Affordable Care Act of 2010, Public Law 111-148; and Section 865 of the Public Health Service Act."
                    },
                    "authorizationId": "d2cf5028028ce402d25888d73838987d",
                    "authorizationTypes": {
                      "USC": false,
                      "act": true,
                      "statute": false,
                      "publicLaw": false,
                      "executiveOrder": false
                    }
                  }
                ]
              },
              "organizationId": "100008531",
              "assistanceTypes": [
                "0003001"
              ],
              "functionalCodes": [
                "0007007",
                "0012006"
              ],
              "alternativeNames": [
                "Geriatric Workforce Enhancement Program (GWEP)\r\n\r\n"
              ],
              "status": "published",
              "archived": false
            },
            "actionType": null,
            "id": "179b3250ed304983bca26f59a63d4ba6"
          },
          {
            "programId": "b35ab1eec752703a9f3e5a7e272efe0c",
            "requestType": {
              "publicValue": "Request Unarchive",
              "value": "unarchive_request"
            },
            "entryDate": 1506433694348,
            "createdBy": "AGENCY_SUBMITTER",
            "modifiedDate": null,
            "modifiedBy": null,
            "reason": "Unarchive Request",
            "data": "{}",
            "completed": false,
            "program": {
              "title": "Podiatric Residency Training in Primary Care",
              "website": "www.hrsa.gov .",
              "contacts": {
                "local": {
                  "flag": "none",
                  "description": "Jerry Katzoff, Dental, Psychology and Special Projects Branch, Division of Medicine and Dentistry, Bureau of Health Professions, Health Resources and Services Administration, Department of Health and Human Services, Room 9A-27, 5600 Fishers Lane, Rockville, MD 20857. Telephone: (301) 443-4443. cmclaughlin@hrsa.gov ."
                }
              },
              "projects": {
                "isApplicable": false
              },
              "financial": {
                "accounts": [
                  {
                    "code": "75-0350-0-1-550"
                  }
                ],
                "obligations": [
                  {
                    "values": [
                      {
                        "year": 2007,
                        "actual": 0
                      },
                      {
                        "year": 2008,
                        "estimate": 0
                      },
                      {
                        "year": 2009,
                        "estimate": 0
                      }
                    ],
                    "description": "(Grants)  FY 07 $0; FY 08 est $0; and FY 09 est $0. \n",
                    "obligationId": "548a26dc493f437cb261672593ef1739",
                    "assistanceType": "0001001"
                  }
                ],
                "accomplishments": {
                  "isApplicable": false
                },
                "isFundedCurrentFY": false
              },
              "objective": "To plan and implement projects in preventive and primary care training for podiatric physicians in approved or provisional residency programs that shall provide financial assistance in the form of traineeships to residents participating in such projects and who are planning to specialize in primary care.",
              "assistance": {
                "renewal": {
                  "description": "A Summary Progress Report must be submitted each year beginning with the second year of support.  Competitive continuations may be submitted during the terminal year of support."
                },
                "approval": {
                  "description": "From 3 to 4 months."
                },
                "deadlines": {
                  "flag": "yes",
                  "description": "www.hrsa.gov ."
                },
                "awardProcedure": {
                  "description": "Notification is made in writing by a Notice of Grant Award issued from Headquarters Office."
                },
                "selectionCriteria": {
                  "isApplicable": false
                },
                "applicationProcedure": {
                  "description": "Grant applications and required forms for this program can be obtained from Grants.gov . Please visit the Grants.gov Web site at www.grants.gov to both find and apply for all Federal grant opportunities.  All qualified applications will be forwarded to an objective review committee which will make funding recommendations to the Associate Administrator for the Bureau of Health Professions. The Associate Administrator has the authority to make final selections for awards.",
                  "isApplicable": false
                },
                "preApplicationCoordination": {
                  "environmentalImpact": {
                    "reports": [
                      {
                        "isSelected": false,
                        "reportCode": "statement"
                      },
                      {
                        "isSelected": false,
                        "reportCode": "assessment"
                      },
                      {
                        "isSelected": true,
                        "reportCode": "otherRequired"
                      },
                      {
                        "isSelected": false,
                        "reportCode": "ExecutiveOrder12372"
                      }
                    ]
                  }
                }
              },
              "compliance": {
                "audit": {
                  "isApplicable": false
                },
                "records": {
                  "description": "Grantees are required to maintain grant accounting records for a minimum of 3 years after the end of a grant period.  If any litigation, claim, negotiation, audit or other action involving the record has been started before the expiration of the 3-year period, the records shall be retained until completion of the action and resolution of all issues which arise from it, or until the end of the regular 3-year period, whichever is later.  More detailed information regarding retention requirements are provided in Title 45, CFR, Parts 74 and 92."
                },
                "reports": [
                  {
                    "code": "program",
                    "isSelected": false
                  },
                  {
                    "code": "cash",
                    "isSelected": false
                  },
                  {
                    "code": "progress",
                    "isSelected": false
                  },
                  {
                    "code": "expenditure",
                    "isSelected": false
                  },
                  {
                    "code": "performanceMonitoring",
                    "isSelected": false
                  }
                ],
                "documents": {
                  "isApplicable": false
                },
                "CFR200Requirements": {
                  "questions": [
                    {
                      "code": "subpartB",
                      "isSelected": false
                    },
                    {
                      "code": "subpartC",
                      "isSelected": false
                    },
                    {
                      "code": "subpartD",
                      "isSelected": false
                    },
                    {
                      "code": "subpartE",
                      "isSelected": false
                    },
                    {
                      "code": "subpartF",
                      "isSelected": false
                    }
                  ],
                  "description": "Grant applications and required forms for this program can be obtained from Grants.gov . Please visit the Grants.gov Web site at www.grants.gov to both find and apply for all Federal grant opportunities.  All qualified applications will be forwarded to an objective review committee which will make funding recommendations to the Associate Administrator for the Bureau of Health Professions. The Associate Administrator has the authority to make final selections for awards."
                },
                "formulaAndMatching": {
                  "types": {
                    "moe": false,
                    "formula": false,
                    "matching": false
                  }
                }
              },
              "fiscalYear": 2008,
              "eligibility": {
                "usage": {
                  "rules": {
                    "description": "Grants may not be used for new construction, patient services."
                  },
                  "loanTerms": {
                    "isApplicable": false
                  },
                  "restrictions": {
                    "isApplicable": false
                  },
                  "discretionaryFund": {
                    "isApplicable": false
                  }
                },
                "applicant": {
                  "types": [
                    "0009",
                    "0011",
                    "0015",
                    "0035"
                  ],
                  "description": "Eligible entities are health professions schools, academic health centers, State or local governments or other appropriate public or private nonprofit entities including faith-based and community based organizations that conduct training in approved or provisional residency programs. To be eligible, the applicant shall propose a project which is collaborative among two or more disciplines."
                },
                "limitation": {
                  "description": "Funds are available for expenditure during approved budget period.  Payment is made by an Electronic Transfer System or a Monthly Cash Request System.  Approved competing renewal awards are expected to initiate training activities during the first year of the project period.  New programs may utilize this first year for planning and development purposes, and commence training the second year of the project period. Each project period is a maximum of 36 months."
                },
                "beneficiary": {
                  "types": [
                    "16",
                    "4",
                    "5",
                    "7"
                  ],
                  "description": "Eligible entities are health professions schools, academic health centers, State or local governments or other appropriate public or private nonprofit entities. To be eligible, the applicant shall propose a project which is collaborative among two or more disciplines. Non-profit entities, including faith-based organizations and community-based organizations, that meet other eligibility requirements are eligible to apply.",
                  "isSameAsApplicant": false
                },
                "documentation": {
                  "description": "Applicants should review the individual HRSA Guidance documents issued under this CFDA program for any required proof or certifications which must be submitted prior to or simultaneous with submission of an application package.",
                  "isApplicable": true
                },
                "assistanceUsage": {
                  "types": [
                    "17"
                  ]
                }
              },
              "subjectTerms": [
                "0465028",
                "0685024"
              ],
              "programNumber": "93.181",
              "authorizations": {
                "list": [
                  {
                    "act": {
                      "description": " Public Health Service Act, Title VII, Part C, Section 755, as amended; Health Professions Education Partnerships Act of 1998, Public Law 105-392. \n"
                    },
                    "authorizationId": "43e32d439b9a422c9b8d875dd2b5a7de",
                    "authorizationTypes": {
                      "USC": false,
                      "act": true,
                      "statute": false,
                      "publicLaw": false,
                      "executiveOrder": false
                    }
                  }
                ]
              },
              "organizationId": "100008531",
              "assistanceTypes": [
                "0003003"
              ],
              "functionalCodes": [
                "0007007",
                "0007011",
                "0012006"
              ],
              "status": "published",
              "archived": true
            },
            "actionType": null,
            "id": "203b6a14c1434abe9754f3f6563d2920"
          },
          {
            "programId": "34ae8ab4f4b849259e9974dc0c6b503d",
            "requestType": {
              "publicValue": "Request Agency Change",
              "value": "agency_request"
            },
            "entryDate": 1506433385490,
            "createdBy": "CFDA_DHS_AGENCY_COORD",
            "modifiedDate": null,
            "modifiedBy": null,
            "reason": "DHS to HRSA request",
            "data": "{\"organizationId\": 100008531}",
            "completed": false,
            "program": {
              "title": "Presidential Residence Protection Security Grant",
              "website": "http://fema.gov/grants",
              "contacts": {
                "local": {
                  "flag": "appendix",
                  "description": "Applicants and recipients should contact their FEMA Headquarters Program Analyst with any questions or concerns.  Applicants or recipients that are unsure who their respective FEMA Headquarters Program Analyst is should contact the Centralized Scheduling and Information Desk (CSID). CSID can be reached by phone at (800) 368-6498 or by e-mail at askcsid@dhs.gov, Monday through Friday, 9:00 a.m. – 5:00 p.m. EST."
                },
                "headquarters": [
                  {
                    "zip": "20472",
                    "city": "Washington",
                    "email": "Robert.Kevan@fema.dhs.gov",
                    "phone": "202-733-9723",
                    "state": "DC",
                    "country": "US",
                    "fullName": "Robert Kevan",
                    "contactId": "74220f504462bf4469d9c743c7cd481d",
                    "streetAddress": "400 C Street SW\r\n"
                  }
                ]
              },
              "projects": {
                "isApplicable": false
              },
              "financial": {
                "accounts": [
                  {
                    "code": "07-0171-8-0-413"
                  }
                ],
                "treasury": {
                  "tafs": [
                    {
                      "accountCode": "70-0413",
                      "departmentCode": "70"
                    }
                  ]
                },
                "description": "This is a new program in FY 2017 so there are not previous program budgets.",
                "obligations": [
                  {
                    "values": [
                      {
                        "flag": "ena",
                        "year": 2016
                      },
                      {
                        "year": 2018,
                        "estimate": 20500000
                      },
                      {
                        "year": 2017,
                        "estimate": 20500000
                      }
                    ],
                    "description": "This is a new program in FY 2017 so there are not previous program budgets.",
                    "obligationId": "27c86bc7dd4c7afabb87fcba7e083dc3",
                    "isRecoveryAct": false,
                    "assistanceType": "0003003"
                  }
                ],
                "accomplishments": {
                  "isApplicable": false
                },
                "isFundedCurrentFY": true
              },
              "objective": "To Provide Federal funds to reimburse state and local law enforcement agencies for law enforcement agencies for law enforcement personnel costs incurred while protecting any non-governmental residence of the President of the United States that is designated or identified to be secured by the United States Secret Service. ",
              "assistance": {
                "appeal": {
                  "interval": "8"
                },
                "renewal": {
                  "interval": "8"
                },
                "approval": {
                  "interval": "8"
                },
                "deadlines": {
                  "flag": "yes",
                  "list": [
                    {
                      "start": "2017-08-16"
                    }
                  ],
                  "description": "Select Range and provide other Approval Information in the text box if necessary.\r\nPhase I (Covering Reimbursements for January 21, 2017 – May 31, 2017)                         Supporting Documentation Due: \tAugust 16, 2017 at 5:00 p.m. EDT\r\n\r\nDue with the Final Application\r\nAnticipated Funding Selection Date:\t\tSeptember 20, 2017\r\nAnticipated Award Date:\t\t\tNo later than September 30, 2017\r\n\r\nPhase II (Covering Reimbursements from June 1, 2017 – September 30, 2017)\r\nSupporting Documentation Due: \t\tOctober 31, 2017 at 5:00 p.m. EDT\r\nAnticipated Funding Selection Date:\t\tNovember 29, 2017\r\nAnticipated Amendment Date:\t\tNo later than December 15, 2017\r\n"
                },
                "awardProcedure": {
                  "description": "See NOFO for details. In general, the steps in determining an award to eligible applicants are described in the Application Evaluation Criteria, Review and Selection Process, and the Supplemental Financial Integrity Review."
                },
                "selectionCriteria": {
                  "description": "FEMA will review each application and make a determination as to the level of reimbursement, if any, after consideration of the information provided in response to the requirements set forth in this NOFO, and contingent upon available funding. \r\n\r\nFEMA may request to review source documents to verify allowability of costs prior to making awards. Failure to provide adequate source documentation may result in some or all of the reimbursement requests to be denied. \r\n\r\nThe following criteria will be used to determine whether claimed costs are allowable for reimbursement:\r\nTable 1: Application Evaluation Criteria\r\nEvaluation Criteria\tSource of Verification\r\nWere the costs incurred between January 21, 2017 and September 30, 2017?\tDetailed Budget Worksheet(s)\r\nWere the costs incurred by law enforcement personnel? \tInvestment Narrative, \r\nDetailed Budget Spreadsheet(s)\r\nWere the costs incurred for operational overtime?\tInvestment Narrative, \r\nDetailed Budget Spreadsheet(s)\r\nWere the costs incurred extraordinary? – meaning costs over and above normal expenditures of the law enforcement agency, which cumulatively present a financial burden on the law enforcement agency?\tInvestment Narrative, \r\nDetailed Budget Spreadsheet(s), \r\nDisclosure of Pending Applications\r\nWere the costs incurred directly attributable to the protection of a non-governmental residence of the President designated or identified to be secured by the USSS?\tInvestment Narrative, \r\nDetailed Budget Spreadsheet(s), \r\nUSSS Validation\r\nWere the costs incurred as the result of an official request by the Director of the USSS pursuant to section 3 or section 4 of the Presidential Protection Assistance Act of 1976 (Pub. L. No. 94-524)?\tCertifications, \r\nUSSS Validation\r\nDoes the applicant have any pending applications for Federally-funded grants or cooperative agreements that (1) include requests for funding to support the same Investment Narrative being proposed in the application under this NOFO, and (2) would cover any identical cost items outlined in the budget submitted to FEMA as part of the application under this NOFO?\tDisclosure of Pending Applications\r\nHas the Applicant been approved for overtime requests for the purposes outlined in this NOFO through any open FEMA Grant Award?\tFEMA Official Grant Files\r\n\r\nAwards will be made using the following allocation priorities: \r\n\r\nPriority 1: Priority for allocation of funding will be to law enforcement agencies that incurred extraordinary law enforcement operational overtime costs while the President, First Lady, or their minor child were at the designated residence.\r\n\r\nPriority 2: Additional funding may be allocated for operational overtime costs associated with transportation of the President, First Lady, or their minor child to and from the designated residence within the state.\r\n\r\nPriority 3: Remaining funding may be provided on a pro-rata basis for reimbursement of extraordinary law enforcement operational overtime costs incurred by law enforcement agencies for maintaining the security of the designated residences in the absence of the President, First Lady, or their minor child.\r\n",
                  "isApplicable": true
                },
                "applicationProcedure": {
                  "description": "Investment Justification that describes the extraordinary law enforcement activities engaged in as they relate to providing security for the designated residences of the President during the Period of Performance.\r\n\r\nDetailed Budget Spreadsheets that identifies each covered law enforcement agency each law enforcement officer for which personnel overtime reimbursement is requested\r\n\r\nDisclosure of Pending Applications for federally-funded grants or cooperative agreements that include requests for funding to support the same project being proposed in the application, and would cover any identical cost items outlined in the budget submitted to FEMA as part of the application under this solicitation. \r\n\r\nThe applicant must include in its application a signed letter from the head of each state or local law enforcement agency for which reimbursement is requested.  The certification letter must be addressed to the FEMA Administrator and certify that the protection activities were requested by the Director of the United States Secret Service, for all overtime for which reimbursement under this gran is requested.  The certifications must be include as separate attachments to the applications. \r\n",
                  "isApplicable": true
                },
                "preApplicationCoordination": {}
              },
              "compliance": {
                "audit": {
                  "description": "Recipients that expend $750,000 or more from all Federal funding sources during their fiscal year are required to submit an organization-wide financial and compliance audit report. The audit must be performed in accordance with the requirements of the U.S. Government Accountability Office’s (GAO) Generally Accepted Government Auditing Standards\r\n\r\nThe Department of Homeland Security Appropriations Act, 2017 charges the DHS OIG with auditing reimbursements made under the PRES Grant.  Evidence that supports the expenses submitted for reimbursement in the Detailed Budget Spreadsheets (e.g., signed and approved time cards that contain detailed descriptions of the services performed or other supporting documentation permitted under 2 C.F.R. § 200.430) must be maintained by the non-federal entity and be provided to DHS/FEMA upon request.\r\n",
                  "isApplicable": true
                },
                "records": {
                  "description": "All records are either GRS 1.2.020 (FEMA PRC 12-1 (Grant and cooperative agreement case files for Successful Applications) or GRS 1.2.021 (FEMA PRC 12-2 (Grant and cooperative agreement case files for Unsuccessful Applications) and are temporary. PRC 12-1 records must be maintained for 10 years after the last activity; PRC 12-2 records must be maintained for 3 years after the last activity."
                },
                "reports": [
                  {
                    "code": "program",
                    "isSelected": true,
                    "description": "Recipients are required to submit one Programmatic Report. The Programmatic Report is a qualitative narrative summary in the form of a word document on the impact of the reimbursements made to each law enforcement agencies. The Programmatic Report must be submitted only once, during Closeout."
                  },
                  {
                    "code": "cash",
                    "isSelected": false
                  },
                  {
                    "code": "progress",
                    "isSelected": false
                  },
                  {
                    "code": "expenditure",
                    "isSelected": true,
                    "description": "Recipients must report obligations and expenditures through the FFR (SF-425) to FEMA.  Recipients must file the FFR electronically using the Payment and Reporting Systems (PARS). The FFR must be submitted only once, during Closeout."
                  },
                  {
                    "code": "performanceMonitoring",
                    "isSelected": true,
                    "description": "Monitoring involves the review and analysis of the financial, programmatic, performance, compliance and administrative processes, policies, activities, and other attributes of each Federal assistance award and will identify areas where technical assistance, corrective actions, and other support may be needed. Recipients may be monitored through an on-site monitoring visit by DHS/FEMA staff."
                  }
                ],
                "documents": {
                  "description": "The U.S. Department of Homeland Security (DHS) Notice of Funding Opportunity (NOFO) for the Fiscal Year 2017 Presidential Residence Extraordinary Security Grant will be published on www.grants.gov. ",
                  "isApplicable": true
                },
                "CFR200Requirements": {
                  "questions": [
                    {
                      "code": "subpartB",
                      "isSelected": false
                    },
                    {
                      "code": "subpartC",
                      "isSelected": true
                    },
                    {
                      "code": "subpartD",
                      "isSelected": false
                    },
                    {
                      "code": "subpartE",
                      "isSelected": false
                    },
                    {
                      "code": "subpartF",
                      "isSelected": true
                    }
                  ],
                  "description": "Investment Justification that describes the extraordinary law enforcement activities engaged in as they relate to providing security for the designated residences of the President during the Period of Performance.\r\n\r\nDetailed Budget Spreadsheets that identifies each covered law enforcement agency each law enforcement officer for which personnel overtime reimbursement is requested\r\n\r\nDisclosure of Pending Applications for federally-funded grants or cooperative agreements that include requests for funding to support the same project being proposed in the application, and would cover any identical cost items outlined in the budget submitted to FEMA as part of the application under this solicitation. \r\n\r\nThe applicant must include in its application a signed letter from the head of each state or local law enforcement agency for which reimbursement is requested.  The certification letter must be addressed to the FEMA Administrator and certify that the protection activities were requested by the Director of the United States Secret Service, for all overtime for which reimbursement under this gran is requested.  The certifications must be include as separate attachments to the applications. \r\n"
                },
                "formulaAndMatching": {
                  "types": {
                    "moe": false,
                    "formula": false,
                    "matching": false
                  }
                }
              },
              "fiscalYear": 2017,
              "eligibility": {
                "usage": {
                  "rules": {
                    "description": "Operational Overtime activities are the only costs eligible for reimbursement under this grant."
                  },
                  "loanTerms": {
                    "isApplicable": false
                  },
                  "restrictions": {
                    "description": "Federal funds made available through this award may be used only for the purpose set forth in this award and must be consistent with the statutory authority for the award. Award funds may not be used for matching funds for any other Federal award, lobbying, or intervention in Federal regulatory or adjudicatory proceedings. In addition, Federal funds may not be used to sue the Federal Government or any other government entity. \r\n\r\nCosts incurred as a result of normal agency activities (e.g., salaries incurred during normal patrol hours for security operations) are not allowable for reimbursement.\r\n\r\nFunding shall not be used for hiring new or additional personnel.\r\n\r\nFunding shall not be used for purchasing equipment. \r\n",
                    "isApplicable": true
                  },
                  "discretionaryFund": {
                    "isApplicable": false
                  }
                },
                "applicant": {
                  "types": [
                    "0011",
                    "0040"
                  ],
                  "description": "Eligible applicants are limited to state and local law enforcement agencies, directly or through the State Administrative Agency, that conducted protection activities associated with any non-governmental residence of the President of the United States designated or identified to be secured by the United States Secret Service. \r\n\r\n"
                },
                "limitation": {
                  "awarded": "other",
                  "description": "January 21, 2017 through September 30, 2017.",
                  "awardedDescription": "Period of Performance Start Date: January 21, 2017 12:00am\r\n\r\nPeriod of Performance End Date: September 30, 2017 11:59:59pm\r\n\r\nFunding will be awarded as a reimbursement for activities already completed.\r\n"
                },
                "beneficiary": {
                  "types": [
                    "4",
                    "5"
                  ],
                  "description": "Eligible applicants are limited to state and local law enforcement agencies that conducted protection activities associated with any non-governmental residence of the President of the United States designated or identified to be secured by the United States Secret Service. ",
                  "isSameAsApplicant": false
                },
                "documentation": {
                  "description": "The Applicant (SAA) must include a signed letter from the head of each state or local law enforcement agency for which reimbursement is requested. The certification letter must be addressed to the FEMA Administrator and certify that the protection activities were requested by the Director of the USSS, for all overtime for which reimbursement under this grant is requested. The certifications must be included as separate attachments to the application. ",
                  "isApplicable": true
                },
                "assistanceUsage": {
                  "types": [
                    "21"
                  ]
                }
              },
              "subjectTerms": [
                "0647"
              ],
              "programNumber": "97.649",
              "authorizations": {
                "list": [
                  {
                    "act": {
                      "description": "Department of Homeland Security Appropriations Act, 2017"
                    },
                    "publicLaw": {
                      "number": "31",
                      "congressCode": "115"
                    },
                    "authorizationId": "42c7dac0ad418f5a495ff9018a690690",
                    "authorizationTypes": {
                      "USC": false,
                      "act": true,
                      "statute": false,
                      "publicLaw": true,
                      "executiveOrder": false
                    }
                  }
                ]
              },
              "organizationId": "100011942",
              "assistanceTypes": [
                "0003003"
              ],
              "functionalCodes": [
                "0006001"
              ],
              "alternativeNames": [
                "PRPA Grant"
              ],
              "status": "published",
              "archived": false
            },
            "actionType": null,
            "id": "a58d43da82e04eeba11eb8c286178ec7"
          }
        ]
      },
      "page": {
        "size": 4,
        "totalElements": 7,
        "totalPages": 2,
        "number": 0
      }
    });
  }
};

describe('src/app/assistance-listing/assistance-listing-workspace/feeds/feeds.page.ts', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [AuthorizationPipe,
        ProgramPage,
        FinancialObligationChart,
        HistoricalIndexLabelPipe,
        AssistanceProgramResult,
        FalWorkspacePage,
        AccessRestrictedPage,
        RejectFALComponent,
        FeedsPage,
        FALFormChangeRequestActionComponent,
        FALFormChangeRequestComponent,
        FALSubmitComponent,
        RequestLabelPipe,
        FALReviewComponent,
        FalRegionalAssistanceLocationsPage,
        RegionalAssistanceLocationResult,
        FALReviewComponent,
        ActionHistoryPipe,
        ActionHistoryLabelPipe,
        RequestTypeLabelPipe,
        FALRegionalAssistanceFormComponent,
        FALPublishComponent,
        FormatFederalHierarchyType,
        CfdaNumbersPage,
        CFDANumberManagementComponent],
      providers: [ActionHistoryLabelPipe, RequestTypeLabelPipe, FALFormErrorService, FALFormService, DictionaryService],
      imports: [
        PipesModule,
        CommonModule,
        SamUIKitModule,
        AppComponentsModule,
        routing,
        ReactiveFormsModule,
        FormsModule,
        FALComponentsModule,
        FALFormModule,
        RouterTestingModule.withRoutes([
          {path: 'my-feed', component: FeedsPage}
        ])
      ]
    }).overrideComponent(FeedsPage, {
      set: {
        providers: [
          {provide: ProgramService, useValue: MockProgramService},
          {provide: ActivatedRoute, useValue: {
            queryParams: {
              subscribe: (fn: (value: Data) => void) => fn({
                domain: "al",
                event:"request",
                pending:"true"
              })
            }
          }
          }
        ]
      }
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsPage);
    comp = fixture.componentInstance;
    Cookies.set('iPlanetDirectoryPro', 'anything');
    comp.domainFilterModelChangeHandler(["al"]);
    comp.eventFilterModelChangeHandler(["request"]);
    comp.pendingRequestsModelChangeHandler(["pending-requests"]);
    comp.requestTypeFilterModelChangeHandler(["archiv_request", "unarchive_request", "title_request", "agency_request", "program_number_request"]);

    fixture.detectChanges();
    comp.crumbs = [
      { breadcrumb:'Home', url:'/',},
      { breadcrumb: 'Workspace', url: '/workspace' },
      { breadcrumb: 'My feed'}
    ];
  });

  it('Should init & load data', () => {
    expect(comp.cookieValue).toBeDefined();
    expect(comp.requests).toBeDefined();
    expect(comp.programRequestList).toBeDefined();
    expect(comp.permissions).toBeDefined();
    expect(comp.domainLabel).toBeDefined();
    expect(comp.isAL).toBeDefined();
    expect(comp.isRequest).toBeDefined();
    expect(comp.isPendingRequest).toBeDefined();
    expect(comp.currentPage).toBeDefined();
    expect(comp.requestType).toBeDefined();
    expect(comp.keyword).toBeDefined();
    expect(comp.size).toBeDefined();
    expect(comp.totalPages).toBeDefined();
    expect(comp.totalElements).toBeDefined();
    expect(comp.initLoad).toBeDefined();
    expect(comp.defaultDomainOption).toBeDefined();
    expect(comp.defaultEventOption).toBeDefined();
    expect(comp.defaultPendingRequestsOption).toBeDefined();
  });
});
