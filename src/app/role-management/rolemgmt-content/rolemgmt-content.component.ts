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
  @Input() totalPages;

  @Output() sortOrder : EventEmitter<any> = new EventEmitter<any>();
  @Output() pageNumber : EventEmitter<any> = new EventEmitter<any>();
  Pagelimit : number;
  paginationConfig = {
      currentPage: 1,      
  };
  pageNo = 1;
  constructor(){
    
    this.Pagelimit = 10;
    
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
    this.pageNo = 1;
    this.sortOrder.emit(event);
    //window.scrollTo(0,0);
    //console.log(event);
  }

  onPageChange(event){
    this.pageNo = event;
    this.pageNumber.emit(event);
    window.scrollTo(0,0);
    
  }

  formatDate(dateString) {
    if (dateString != '' && dateString != null) {
      return moment(dateString).format('MMM DD, YYYY');
    } else {
      return '--';
    }
  }

  

  
  
}
