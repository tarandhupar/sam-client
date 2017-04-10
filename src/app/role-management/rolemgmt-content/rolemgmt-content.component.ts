import {Component,OnInit} from '@angular/core';
import * as moment from 'moment/moment';
@Component({
  selector: 'rolemgmt-content',
  templateUrl: './rolemgmt-content.template.html'
})
export class RoleMgmtContent implements OnInit{

  constructor(){

  }

  ngOnInit(){
    console.log(moment("2021-07-25T21:41:00.000-0400").format('MMM DD, YYYY Z'));
  }
  selectModel = 'desc';
  selectConfig = {
    options: [
      {value: 'desc', label: 'Newest First', name: 'sort-desc'},
      {value: 'asc', label: 'Oldest First', name: 'sort-asc'},      
    ]
  }

  onSelectChanged(event){
    console.log(event);
  }

  onPageChange(event){
    console.log(event);
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
      requestedBy : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Escalated",
      createdBy : "John Admin",
      createdDate : "2021-07-25T21:41:00.000-0400",
      escalatedTo : "GSA",
      UserMessage : "I am requesting access for this domain",
      AdministratorMessage : "I am escalating the request"
    },
    {
      domain : "Oppurtunities",
      requestedBy : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Pending",
      createdBy : "John Admin",
      createdEmail : "john.admin@gsa.gov",
      UserMessage : "I am requesting access for this domain",
    },
    {
      domain : "Award",
      requestedBy : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Rejected",
      createdBy : "John Admin",
      createdDate : "2021-07-25T21:41:00.000-0400",
      UserMessage : "I am requesting access for this domain",
      AdministratorMessage : "I Rejected this because",
    },
    {
      domain : "Award",
      requestedBy : "Alexandria Witherspoon",
      requestedDate : "2021-07-25T21:41:00.000-0400",
      status : "Approved",
      createdBy : "John Admin",
      createdDate : "2021-07-25T21:41:00.000-0400",
      UserMessage : "I am requesting access for this domain",
      AdministratorMessage : "I Approved this because",
    }
  ]
}
