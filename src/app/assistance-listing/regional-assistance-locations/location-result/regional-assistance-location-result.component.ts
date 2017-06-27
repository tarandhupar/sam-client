import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";
//import {RAOFormService} from "../regional-assistance-operations/regional-assistance-form.service";

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
        {label: "Choose An Action", value:"Choose An Action", name:"Choose An Action", disabled:"false"},
        {label: "Update", value:"Update", name:"Update"},
        {label: "Delete", value:"Delete", name:"Delete"}
      ]
    },
    defaultOption: "Choose An Action"

  };

  constructor(private router: Router) { }

  ngOnInit() {


  }

  // actionsDropdownSelect(event) {
  //   console.log('here is event ', event);
  //
  //   if(event === 'Update') {
  //     this.router.navigateByUrl('/fal/myRegionalOffices/' + this.data.id + '/edit');
  //   }
  //   if(event === 'Delete') {
  //     console.log('went inside the delete');
  //     this.modal1.openModal();
  //     console.log('after open modal');
  //   }
  //
  // }

  // onModalClose(event){
  //   console.log('event ', event);
  //
  //   //this.modal1.closeModal();
  // }
  //
  // deleteRAO(event){
  //
  //   console.log('delete event ', event);
  //   console.log('here is id ', this.data['id']);
  //
  //   // call the service and pass the id from data
  //   this.service.deleteRAO(this.data['id']).subscribe(
  //     data =>{
  //       console.log('deleted RAO ', data);
  //     },
  //     error => {
  //       console.log('error occurred while deleting');
  //     }
  //   )
  //
  // }
}

