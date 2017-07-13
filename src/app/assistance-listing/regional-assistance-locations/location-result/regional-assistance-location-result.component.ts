import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";
import {RAOFormService} from "../regional-assistance-operations/regional-assistance-form.service";
import {AlertFooterService} from "../../../alerts/alert-footer/alert-footer.service";

@Component({
  moduleId: __filename,
  selector: 'regional-assistance-location-result',
  templateUrl: 'regional-assistance-location-result.template.html'
})
export class RegionalAssistanceLocationResult implements OnInit {
  @Input() data: any = {};
  @Input() qParams: any = {};
  @Input() permissions: any = null;
  showhideStatus: boolean;
  showHideStatusText: string;
  randomColor: string;
  @ViewChild("modal1") modal1;

  // deletion alert obj
  deleteFooterAlertModel = {
    title: "Success",
    description: "Successfully Deleted.",
    type: "success",
    timer: 3000
  };

  statusCodeBgColor = [
    '#2e8540',
    '#cd2026',
    '#aeb0b5'
  ];
  actionsDropdown: any = {
    config: {
      "hint": "Actions",
      "name": "fal-change-request",
      "disabled": false,
      options: [
        {label: "Choose An Action", value:"Choose An Action", name:"Choose An Action"},
        {label: "Update", value:"Update", name:"Update"},
        {label: "Delete", value:"Delete", name:"Delete"}
      ]
    },
    defaultOption: "Choose An Action"

  };

  constructor(private router: Router, private service: RAOFormService, private alertFooterService: AlertFooterService) { }

  ngOnInit() {


  }

  actionsDropdownSelect(event) {
    if(event === 'Update') {
      this.router.navigateByUrl('/fal/myRegionalOffices/' + this.data.id + '/edit');
    }
    if(event === 'Delete') {
      this.modal1.openModal();
    }

  }

  onModalClose(event){

  }

  deleteRAO(event){

    // call the service and pass the id from data
    this.service.deleteRAO(this.data['id']).subscribe(
      data =>{
        this.modal1.closeModal();
        let url = 'fal/myRegionalOffices';
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.deleteFooterAlertModel)));
        this.router.navigate([url]);
      },
      error => {
        console.error('error occurred while deleting');
      }
    )

  }
}
