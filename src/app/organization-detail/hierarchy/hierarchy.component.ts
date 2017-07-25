import { Component, Input, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { Observable } from 'rxjs';
import { Location } from "@angular/common";
import { IAMService } from "api-kit";

@Component ({
  templateUrl: 'hierarchy.template.html'
})
export class OrgHierarchyPage {

  orgType: string = "";
  orgList: any = [];
  loadData: boolean = false;

  constructor(private _router: Router,
              private route: ActivatedRoute,
              private fhService: FHService,
              public flashMsgService: FlashMsgService,
              private location: Location,
              private iamService: IAMService) {
  }

  ngOnInit() {

    this.flashMsgService.hierarchyStatusUpdate.subscribe( status => {
      this.getHierarchyData(status);
    });
    this.loadData = true;
  }

  getHierarchyData(status){
    this.fhService.getDepartments().subscribe( data => {
      this.orgList = data._embedded;
    });
  }

}
