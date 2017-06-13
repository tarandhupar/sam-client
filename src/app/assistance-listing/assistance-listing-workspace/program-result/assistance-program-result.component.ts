import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';

@Component({
  moduleId: __filename,
  selector: 'assistance-program-result',
  templateUrl: 'assistance-program-result.template.html'
})
export class AssistanceProgramResult implements OnInit {
  @Input() data: any = {};
  @Input() qParams: any = {};
  @Input() permissions: any = null;
  showhideStatus: boolean;
  showHideStatusText: string;
  randomColor: string;
  statusCodeBgColor = [
    '#2e8540',
    '#cd2026',
    '#aeb0b5'
  ];
  changeRequestDropdown: any = {
    config: {
      "hint": "Actions",
      "name": "fal-change-request",
      "disabled": false,
    },
    defaultOption: "Make a Request"
  };

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.data.publishedDate !== null) {
      this.data.publishedDate = moment(this.data.publishedDate).format("MMM D, Y h:mm a");
    }
    if (this.data.modifiedDate !== null) {
      this.data.modifiedDate = moment(this.data.modifiedDate).format("MMM D, Y h:mm a");
    }
    if (this.data.status.code !== 'published') {
      this.showhideStatus = true;
    }
    this.showHideStatusText = this.showhideStatus ? "inline" : "none";
    this.toggleBgColor();
  }

  toggleBgColor() {
    if (this.data.status !== null && (typeof this.data.status.code !== 'undefined' && this.data.status.code !== null)) {
      if (this.data.status.code === 'draft' || this.data.status.code === 'revised') {
        this.randomColor = this.statusCodeBgColor[0];
      } else if (this.data.status.code === 'rejected') {
        this.randomColor = this.statusCodeBgColor[1];
      } else if (this.data.status.code === 'pending') {
        this.randomColor = this.statusCodeBgColor[2];
      }
    }
  }

  public onChangeRequestSelect(event) {
    if(event.value === 'archive_request') {
      this.router.navigateByUrl('programs/' + event.program.id + '/archive-request');
    }
  }
}

