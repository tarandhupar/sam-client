import { Component } from '@angular/core';

@Component({
  providers: [ ],
  styleUrls: ['./reference-library.style.css'],
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
          title:"Uniform Grant Guidance (2 CFR 200)",
          detail:"Details for Uniform Grant Guidance: "+this.detailLipsum,
          link:"View the e-CFR",
          url:"fakeUrl"
        },
        {
          title:"Grants.gov Learning Center",
          detail:"Details for Grants.gov Learning Center: "+this.detailLipsum,
          link:"View the Grants.gov",
          url:"http://www.grants.gov/web/grants/learn-grants.html"
        },
        {
          title:"Data Element Repository",
          detail:"Details for Data Element Repository: "+this.detailLipsum,
          link:"View the DER",
          url:"fakeUrl"
        }
      ],
    Contract:[
        {
          title:"Federal Acquisition Regulation",
          detail:"Details for Federal Acquisition Regulation: "+this.detailLipsum,
          link:"View the FAR",
          url:"fakeUrl"
        },
        {
          title:"Contracts Reference Example1",
          detail:"Details for Contracts Reference Example1: "+this.detailLipsum,
          link:"View example1",
          url:"hfakeUrl"
        },
        {
          title:"Contracts Reference Example2",
          detail:"Details for Contracts Reference Example2: "+this.detailLipsum,
          link:"View example2",
          url:"fakeUrl"
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
}
