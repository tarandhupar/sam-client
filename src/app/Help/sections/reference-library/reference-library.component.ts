import { Component } from '@angular/core';
import { globals } from '../../../globals';

@Component({
  providers: [ ],
  templateUrl: './reference-library.template.html',
})
export class ReferenceLibraryComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim.`;

  detailObj: any = {
    Federal:{
      showDetail: false,
      item: {}
    },
    Contract:{
      showDetail: false,
      item: {}
    }
  };

  private data: any={
    Federal: [
        {
          title:"Benefits.gov Learning Center",
          detail:"Benefits.gov Learning Center: "+this.detailLipsum,
          link:"View Benefits.gov",
          url:"http://www.Benefits.gov"
        },
        {
          title:"Grants.gov Learning Center",
          detail:"Details for Grants.gov Learning Center: "+this.detailLipsum,
          link:"View Grants.gov",
          url:"http://www.grants.gov/web/grants/learn-grants.html"
        },
        {
          title:"Data Element Repository",
          detail:"Details for Data Element Repository: "+this.detailLipsum,
          link:"View DER",
          url:"fakeUrl"
        }
      ],
    Contract:[
        {
          title:"Federal Acquisition Regulation",
          detail:"Details for Federal Acquisition Regulation: "+this.detailLipsum,
          link:"View FAR",
          url:"https://www.acquisition.gov/?q=browsefar"
        },
        {
          title:"SBA Commercial Market Representative",
          detail:"Details for SBA Commercial Market Representative: "+this.detailLipsum,
          link:"View SBA CMR",
          url:"https://www.sba.gov/contracting/resources-small-businesses/commercial-market-representatives"
        },
        {
          title:"Request DUNS Number",
          detail:"Details for Request DUNS Number: "+this.detailLipsum,
          link:"View DUNS Number",
          url:"http://fedgov.dnb.com/webform"
        }
    ]
  };

  constructor() { }

  selectDetail(item, type, event){
    if(this.detailObj[type].item.title === item.title){
      this.detailObj[type].showDetail = false;
      this.detailObj[type].item = {};
    }else{
      this.detailObj[type].showDetail = true;
      this.detailObj[type].item = item;
    }
    event.stopPropagation();
  }

  private getItemClass(item, type){
    if(this.detailObj[type].item.title !== item.title){
      return "fa-plus";
    }
    return "fa-minus";
  }

  private getTriClass(index, type): string{
    if(this.detailObj[type].item.title === this.data[type][index].title){
      return "tri-down";
    }
    return "no-tri-down";
  }

  private closeReferenceDetail(type){
    this.detailObj[type].showDetail = false;
    this.detailObj[type].item = {};
  }

  private getLayerClass(index,type): string{
    if(this.detailObj[type].item.title === this.data[type][index].title){
      return "reference-image-layer-select";
    }
    return "reference-image-layer-unselect";
  }

  private getBorderClass(index,type): string{
    if(this.detailObj[type].item.title === this.data[type][index].title){
      return "item-border-select";
    }
    return "item-border-unselect";
  }

  private largeScreen(): boolean{
    return window.innerWidth >= 1200;
  }

  private getImageContainerClass(): string{
    if(this.largeScreen()){
      return "reference-image-container"
    }
    return "reference-image-container-small"

  }

  private linkToggle():boolean{
    return globals.showOptional;
  }
}
