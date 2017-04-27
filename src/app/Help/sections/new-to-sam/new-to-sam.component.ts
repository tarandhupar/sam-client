import { Component } from '@angular/core';
import { globals } from '../../../globals';

@Component({
  providers: [ ],
  templateUrl: './new-to-sam.template.html',
})
export class NewToSamComponent {

  detailLipsum:string = `Omnes inermis ius at, ad assum constituto referrentur eam. 
    Regione deserunt no vis, in his sale aeque. Saepe virtute impedit no nec, elitr 
    decore antiopam cu usu, sit Id labores vivendum vim.`;

  //Lipsum data for each image, will work as image content data set
  private imageGroupData:any = [
    {
      title:"Lipsum text title1",
      detail:"Detail Lipsum text1: "+this.detailLipsum,
      link:"Lipsum link",
      url:"help",
      img:"src/assets/img/placeholder.jpg"
    },
    {
      title:"Lipsum text title2",
      detail:"Detail Lipsum text2: "+this.detailLipsum,
      link:"Lipsum link",
      url:"help",
      img:"src/assets/img/placeholder.jpg"
    },
    {
      title:"Lipsum text title3",
      detail:"Detail Lipsum text3: "+this.detailLipsum,
      link:"Lipsum link",
      url:"help",
      img:"src/assets/img/placeholder.jpg"
    }
  ];

  // Array of Indices that point to current the image content in imageGroupData(i -> imageGroupData[i]) to avoid entering duplicate image contents
  // Each area will have multiple Image library components(3 Image library components for each area for now)
  // Each Image Library component needs an array 3 objects of image content data as input
  // Each object of image content data will be pointed using the index in imageGroupData
  private imageGroupIndexData:any = {
    area1:[0,2,1,0,1,2,1,2,0],
    area2:[0,1,2,0,2,1,1,0,2],
    area3:[1,2,0,2,1,0,0,2,1],
    area4:[0,2,1,0,2,1,1,0,2],
    area5:[2,1,0,0,1,2,2,0,1],
  };

  private curImageGroup:any;

  showImageLibrary: boolean = false;

  constructor() { }

  openImageLibrary(type){
    if(this.linkToggle()){
      this.showImageLibrary = true;
      this.curImageGroup = [];
      for(let index of this.imageGroupIndexData[type]){
        this.curImageGroup.push(this.imageGroupData[index]);
      }
    }
  }

  closeImageLibrary(){
    this.showImageLibrary = false;
    this.curImageGroup = {};
  }

  linkToggle():boolean{
    return globals.showOptional;
  }
}
