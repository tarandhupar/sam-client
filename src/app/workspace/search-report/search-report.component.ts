import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'workspace-search-report',
  templateUrl: 'search-report.template.html'
})
export class SearchReportComponent {

  helpDetailType:string = "";
  configObj:any = {
    searches:{isExpand:false},
    reports:{isExpand:false}
  };


  toggleHelpDetail(type, isExpand){
    this.helpDetailType = type;
    this.configObj[type].isExpand = isExpand;
    if(isExpand) Object.keys(this.configObj).forEach(e => {if(e !== type) this.configObj[e].isExpand = false;});
  }
}
