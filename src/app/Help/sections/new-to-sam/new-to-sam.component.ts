import { Component } from '@angular/core';

@Component({
  providers: [ ],
  templateUrl: './new-to-sam.template.html',
})
export class NewToSamComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim.`;

  //Lipsum data for each image icon
  private imageGroupdata:any = [
    {
      title:"Lipsum text title1",
      detail:"Detail Lipsum text1: "+this.detailLipsum,
      link:"Lipsum link",
      url:"help"
    },
    {
      title:"Lipsum text title2",
      detail:"Detail Lipsum text2: "+this.detailLipsum,
      link:"Lipsum link",
      url:"help"
    },
    {
      title:"Lipsum text title3",
      detail:"Detail Lipsum text3: "+this.detailLipsum,
      link:"Lipsum link",
      url:"help"
    }
  ];

  private imageGroupIndexData:any = {
    area1:[[0,2,1],[0,1,2],[1,2,0]],
    area2:[[0,1,2],[0,2,1],[1,0,2]],
    area3:[[1,2,0],[2,1,0],[0,2,1]],
    area4:[[0,2,1],[0,2,1],[1,0,2]],
    area5:[[2,1,0],[0,1,2],[2,0,1]],
  };

  private curImageGroup:any;

  showImageLibrary: boolean = false;

  constructor() { }

  openImageLibrary(type){
    this.showImageLibrary = true;
    this.curImageGroup = [];
    for(let indexList of this.imageGroupIndexData[type]){
      let tempDataList: any = [];
      for(let indexItem of indexList){
        tempDataList.push(this.imageGroupdata[indexItem]);
      }
      this.curImageGroup.push(tempDataList);
    }
  }

  closeImageLibrary(){
    this.showImageLibrary = false;
    this.curImageGroup = {};
  }



}
