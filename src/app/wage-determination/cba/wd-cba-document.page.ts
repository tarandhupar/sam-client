import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { WageDeterminationService } from "api-kit";

// TODO: Use only one common component for all WD documents later
@Component({
  moduleId: __filename,
  template: `
    <div class="usa-grid">
      <div class="usa-width-one-whole">
        <div class="sam-ui two column vertically padded grid" id="agreement">
          <div class="column">
            <a target="blank" class="sam-ui right floated mini dark blue button" tabindex="0" (click)="printDocument()">
              <em class="icon fa fa-print" aria-hidden="true"></em>
              Print
            </a>
          </div>
        </div>
        <pre id="cbawd-agreement" *ngIf="cbawd">
 REGISTER OF WAGE DETERMINATION UNDER  |  U.S. DEPARTMENT OF LABOR    
   THE SERVICE CONTRACT ACT            |EMPLOYMENT STANDARDS ADMINISTRATION
   By direction of the Secretary       |  WAGE AND HOUR DIVISION
          of Labor                     |         WASHINGTON D.C.  20210
                                       |
                                       |
                                       |
                                       | Wage Determination No.: {{cbawd.cbaNumber}}
Diane Koplewski          Division of   |           Revision No.: {{cbawd.revisionNumber}}
Director            Wage Determinations|  Date Of Last Revision: {{cbawd.publishedDate | date: 'MM/dd/yyyy'}}
_______________________________________|_______________________________________
State: {{cbawd.cbaLocation!=null ? cbawd.cbaLocation[0]?.state : ''}}

Area: {{cbawd.cbaLocation!=null ? cbawd.cbaLocation[0]?.county : ''}}

_______________________________________________________________________________

Employed on {{cbawd.organizationName}} contract for {{cbawd.contractServices}}.

Collective Bargaining Agreement between contractor: {{cbawd.contractorName}}, and 
union: {{cbawd.contractorUnion}} Local {{cbawd?.localUnionNumber}}, effective {{cbawd?.effectiveStartDate | date: 'MM/dd/yyyy'}} through 1/1/2018.

In accordance with Section 2(a) and 4(c) of the Service Contract Act, as amended, 
employees employed by the contractor(s) in performing services covered by the 
Collective Bargaining Agreement(s) are to be paid wage rates and fringe benefits 
set forth in the current collective bargaining agreement and modified extension 
agreement(s).
        </pre>
      </div>
    </div>
  `,
  styles:[`
    pre{
      width: 120%;
    }
     @media print{
       body *{
         visibility: hidden;
       }
       samsearchheader, samfooter{
         display: none;
       }
       body main pre{
         visibility: visible
       }
     }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [
    WageDeterminationService
  ]
})
export class CBADocumentPage implements OnInit {
  cbawd: any;

  constructor(
    private route:ActivatedRoute,
    private wgService:WageDeterminationService) {}

  ngOnInit() {
    this.loadWageDetermination();
  }

  private loadWageDetermination() {
    this.route.params.subscribe((params: Params) => {
      this.wgService.getCBAByReferenceNumber(params['cbanumber']).subscribe(
        data => {
          this.cbawd = data;
        },
        error => {
          console.log('an error has occurred with the service call');
        });
    });
  }

  printDocument() {
    window.print();
  }

}
