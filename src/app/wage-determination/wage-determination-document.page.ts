import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { WageDeterminationService } from "api-kit";


@Component({
  moduleId: __filename,
  template: `<pre *ngIf="wageDetermination">{{wageDetermination.document}}</pre>`,
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
