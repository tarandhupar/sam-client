import { Component } from '@angular/core';

@Component({
  providers: [ ],
  templateUrl: './new-to-sam.template.html',
})
export class NewToSamComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim.`;

  private data:any = [
    {
      title:"Lipsum text title1",
      detail:"Detail Lipsum text1: "+this.detailLipsum,
      link:"Lipsum link",
      url:"fakeUrl"
    },
    {
      title:"Lipsum text title2",
      detail:"Detail Lipsum text2: "+this.detailLipsum,
      link:"Lipsum link",
      url:"fakeUrl"
    },
    {
      title:"Lipsum text title3",
      detail:"Detail Lipsum text3: "+this.detailLipsum,
      link:"Lipsum link",
      url:"fakeUrl"
    }
  ];

  private showImageLibrary: boolean = false;

  constructor() { }

  openImageLibrary(){
    this.showImageLibrary = true;
  }

  closeImageLibrary(){
    this.showImageLibrary = false;
  }



}
