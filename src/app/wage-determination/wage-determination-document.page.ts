import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { WageDeterminationService } from "api-kit";


@Component({
  moduleId: __filename,
  template: `
    <div class="usa-grid">
      <div class="usa-width-whole">
        <pre *ngIf="wageDetermination">
          {{wageDetermination.document}}
        </pre>
      </div>
    </div>
  `,
  styles:[`
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
export class WageDeterminationDocumentPage implements OnInit {
  wageDetermination: any;

  constructor(
    private route:ActivatedRoute,
    private wgService:WageDeterminationService) {}

  ngOnInit() {
    this.loadWageDetermination();
  }

  private loadWageDetermination() {
    this.route.params.subscribe((params: Params) => {
      this.wgService.getWageDeterminationByReferenceNumberAndRevisionNumber(params['referencenumber'], params['revisionnumber']).subscribe(api => {
        this.wageDetermination = api;
      }, err => {
        console.log('Error logging', err);
      });
    });
  }
}
