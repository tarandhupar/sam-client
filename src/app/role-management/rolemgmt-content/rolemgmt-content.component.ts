import {Component,OnInit,Output,EventEmitter} from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'rolemgmt-content',
  templateUrl: './rolemgmt-content.template.html'
})
export class RoleMgmtContent implements OnInit{
  @Output() sortOrder : EventEmitter<any> = new EventEmitter<any>();
  @Output() pageNumber : EventEmitter<any> = new EventEmitter<any>();

  constructor(){

  }

  ngOnInit(){

  }
  selectModel = 'desc';
  selectConfig = {
    options: [
      {value: 'desc', label: 'Newest First', name: 'sort-desc'},
      {value: 'asc', label: 'Oldest First', name: 'sort-asc'},
    ]
  }

  onSelectChanged(event){
    this.sortOrder.emit(event);
    window.scrollTo(0,0);
    //console.log(event);
  }

  onPageChange(event){
    this.pageNumber.emit(event);
    window.scrollTo(0,0);
    //console.log(event);
  }

  formatDate(dateString) {
    if (dateString != '' && dateString != null) {
      return moment(dateString).format('MMM DD, YYYY');
    } else {
      return '--';
    }
  }

  paginationConfig = {
    currentPage: 1,
    totalPages: 2
  };

  data = [
    {
      domain : "Federal Assistance Listing",
      requestorName : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Escalated",
      supervisorName : "John Admin",
      createdDate : "2021-07-25T21:41:00.000-0400",
      escalatedTo : "GSA",
      UserMessage : "I am requesting access for this domain",
      AdministratorMessage : "I am escalating the request",
      id : 1,
    },
    {
      domain : "Oppurtunities",
      requestorName : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Pending",
      supervisorName : "John Admin",
      supervisorEmail : "john.admin@gsa.gov",
      UserMessage : "I am requesting access for this domain",
      id : 2,
    },
    {
      domain : "Award",
      requestorName : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Rejected",
      supervisorName : "John Admin",
      createdDate : "2021-07-25T21:41:00.000-0400",
      UserMessage : "I am requesting access for this domain",
      AdministratorMessage : "I Rejected this because",
      id : 3,
    },
    {
      domain : "Award",
      requestorName : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Approved",
      supervisorName : "John Admin",
      createdDate : "2021-07-25T21:41:00.000-0400",
      UserMessage : "I am requesting access for this domain",
      AdministratorMessage : "I Approved this because",
      id : 4,
    }
  ]
}
