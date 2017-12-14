import {Component, Input, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";
import {RAOFormService} from "../regional-assistance-operations/regional-assistance-form.service";
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";

// Animation
import { trigger, state, style, animate, transition } from '@angular/core';

@Component({
  moduleId: __filename,
  selector: 'regional-assistance-location-result',
  templateUrl: 'regional-assistance-location-result.template.html',
  animations: [
    trigger('dropdown', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-10%) scale(.8)'
        }),
        animate('100ms ease-in')
      ]),
      transition('* => void', [
        animate('100ms ease-out', style({
          opacity: 0,
          transform: 'translateY(-10%) scale(.8)'
        }))
      ])
    ])
  ]
})
export class RegionalAssistanceLocationResult implements OnInit {
  @Input() data: any = {};
  @Input() qParams: any = {};
  @Input() permissions: any = null;
  @Output() recordDeleted = new EventEmitter();
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
        //{label: "Choose An Action", value:"Choose An Action", name:"Choose An Action"},
        {label: "Edit", value:"Update", name:"Update", icon:"fa fa-pencil", callback: ()=>{}},
        {label: "Delete", value:"Delete", name:"Delete", icon:"fa fa-pencil", callback: ()=>{}}
      ]
    },
    defaultOption: "Action"

  };

  openDropdown: boolean = false;

  constructor(private router: Router, private service: RAOFormService, private alertFooterService: AlertFooterService) { }

  ngOnInit() {
    if (this.data.createdDate !== null) {
      this.data.createdDate = moment(this.data.createdDate).format("MMM D, Y h:mm a");
    }
    if (this.data.modifiedDate !== null) {
      this.data.modifiedDate = moment(this.data.modifiedDate).format("MMM D, Y h:mm a");
    }

  }

  actionsDropdownSelect(event) {
    if(event === 'Update') {
      this.router.navigateByUrl('/fal/myRegionalAssistanceLocations/' + this.data.id + '/edit');
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
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.deleteFooterAlertModel)));
        // emits up to parent to recall api for updated data after delete
        this.recordDeleted.emit();

      },
      error => {
        console.error('error occurred while deleting');
      }
    )

  }
}
