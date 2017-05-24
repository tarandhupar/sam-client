import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'workspace-administration',
  templateUrl: 'administration.template.html'
})
export class AdministrationComponent {

  helpDetailType:any = ["",""];
  configObj:any = [
    {profile:{isExpand:false}, aacRequest:{isExpand:false}},
    {fh:{isExpand:false}, rm:{isExpand:false}},
    {alerts:{isExpand:false}, analytics:{isExpand:false}},

  ];


  toggleHelpDetail(type, isExpand, index){
    this.helpDetailType[index] = type;
    this.configObj[index][type].isExpand = isExpand;
    if(isExpand) {
      this.configObj.forEach(e => {
        Object.keys(e).forEach(item => {if(item !== type) e[item].isExpand = false;});
      })
    }  }

  isDetailExpanded(index){
    let expanded = false;
    Object.keys(this.configObj[index]).forEach( e => {
      if(this.configObj[index][e].isExpand) expanded = true;
    });
    return expanded;
  }
}
