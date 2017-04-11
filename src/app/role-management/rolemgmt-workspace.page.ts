import {Component, OnInit} from '@angular/core';

@Component({
  templateUrl: './rolemgmt-workspace.page.html'
})
export class RoleMgmtWorkspace implements OnInit{
  constructor(){

  }

  ngOnInit(){

  }

  StatusValue(event){
    console.log(event);
  }

  DomainValue(event){
    console.log(event);
  }

  AutoCompleteValue(event){
    console.log(event);
  }

  SortValue(event){
    console.log(event);
  }

  PageValue(event){
    console.log(event);
  }
}
