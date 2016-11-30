import { Component } from '@angular/core';

@Component({
  providers: [ ],
  styleUrls: ['./reference-library.style.css'],
  templateUrl: './reference-library.template.html',
})
export class ReferenceLibraryComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim. Vitae aliquip mnesarchum`;

  detailObj: any = {
    Federal:{
      showDetail: false,
      title: "",
      detail: ""
    },
    Contract:{
      showDetail: false,
      title: "",
      detail: ""
    }
  };

  private data: any={
    Federal: [
        {
          title:"Uniform Grant Guidance (2 CFR 200)",
          detail:"Details for Uniform Grant Guidance: ",
        },
        {
          title:"Grants.gov Learning Center",
          detail:"Details for Grants.gov Learning Center: ",
        },
        {
          title:"Data Element Repository",
          detail:"Details for Data Element Repository: ",
        }
      ],
    Contract:[
        {
          title:"Federal Acquisition Regulation",
          detail:"Details for Data Element Repository: ",
        },
        {
          title:"Contracts Reference Example1",
          detail:"Details for Contracts Reference Example1: ",
        },
        {
          title:"Contracts Reference Example2",
          detail:"Details for Contracts Reference Example2: ",
        }
    ]
  };

  constructor() { }

  selectDetail(item, type){
    if(this.detailObj[type].title === item.title){
      this.detailObj[type].showDetail = false;
      this.detailObj[type].title = "";
    }else{
      this.detailObj[type].showDetail = true;
      this.detailObj[type].title = item.title;
      this.detailObj[type].detail = item.detail + this.detailLipsum;
    }
  }

  private getItemClass(item, type): string{
    if(this.detailObj[type].title !== item.title){
      return "fa-plus";
    }
    return "fa-minus";
  }

  private getTriClass(index, type): string{
    if(this.detailObj[type].title === this.data[type][index].title){
      return "tri-down";
    }
    return "no-tri-down";
  }

  private closeReferenceDetail(type){
    this.detailObj[type].showDetail = false;
    this.detailObj[type].title = "";
  }
}
