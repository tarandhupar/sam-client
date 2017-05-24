import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'workspace-data-entry',
  templateUrl: 'data-entry.template.html'
})
export class DataEntryComponent {

  helpDetailType:any = ["",""];
  configObj:any = [
    {assistanceListings:{isExpand:false}, opportunities:{isExpand:false}},
    {entity:{isExpand:false}, exclusions:{isExpand:false}},
    {award:{isExpand:false}, subAward:{isExpand:false}},

  ];


  toggleHelpDetail(type, isExpand, index){
    this.helpDetailType[index] = type;
    this.configObj[index][type].isExpand = isExpand;
    if(isExpand) Object.keys(this.configObj[index]).forEach(e => {if(e !== type) this.configObj[index][e].isExpand = false;});
  }

  isDetailExpanded(index){
    let expanded = false;
    Object.keys(this.configObj[index]).forEach( e => {
      if(this.configObj[index][e].isExpand) expanded = true;
    });
    return expanded;
  }
}
