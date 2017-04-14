import {Component,OnInit,Output,EventEmitter,Input} from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'rolemgmt-content',
  templateUrl: './rolemgmt-content.template.html'
})
export class RoleMgmtContent implements OnInit{

  @Input() requestDetails = '';
  @Input() count; 
  @Input() currCount; 

  @Output() sortOrder : EventEmitter<any> = new EventEmitter<any>();
  @Output() pageNumber : EventEmitter<any> = new EventEmitter<any>();

  constructor(){

  }

  ngOnInit(){
   
  }
  Pagelimit : number = 10;

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
    totalPages: Math.ceil(this.count/this.Pagelimit),
  };

  
}
