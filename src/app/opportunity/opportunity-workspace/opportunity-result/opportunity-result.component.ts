import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';

@Component({
  moduleId: __filename,
  selector: 'opportunity-result',
  templateUrl: 'opportunity-result.template.html',
})
export class OpportunityResult implements OnInit {
  @Input() data: any = {};
  @Input() qParams: any = {};
  @Input() permissions: any = null;

  constructor(private router: Router) { }

  ngOnInit() {
    if(this.data.id) {
      this.data.id = this.data.id.trim();
    }
    if (this.data.postedDate !== null) {
      this.data.postedDate = moment(this.data.postedDate).format("MMM D, Y h:mm a");
    }
    if (this.data.data.archive && this.data.data.archive !== null && this.data.data.archive.date !== null) {
      this.data.data.archive.date = moment(this.data.data.archive.date).format("MMM D, Y h:mm a");
    }
    if (this.data.data.solicitation && this.data.data.solicitation !== null && this.data.data.solicitation.deadlines && this.data.data.solicitation.deadlines.response && this.data.data.solicitation.deadlines.response !== null) {
      this.data.data.solicitation.deadlines.response = moment(this.data.data.solicitation.deadlines.response).format("MMM D, Y h:mm a");
    }
  }

}

