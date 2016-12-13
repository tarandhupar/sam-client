import { Component, Input } from '@angular/core';

@Component({
  selector: 'imageLibrary',
  templateUrl: 'image-library.template.html'
})
export class ImageLibraryComponent {

  @Input() name:string;
  @Input() data:any;

  detailObj: any = {
    showDetail: false,
    item: {}
  };

  constructor() { }

  selectDetail(item, event){
    if(this.detailObj.item.title === item.title){
      this.detailObj.showDetail = false;
      this.detailObj.item = {};
    }else{
      this.detailObj.showDetail = true;
      this.detailObj.item = item;
    }
    event.stopPropagation();
  }

  private getItemClass(item){
    if(this.detailObj.item.title !== item.title){
      return "fa-plus";
    }
    return "fa-minus";
  }

  private getTriClass(index): string{
    if(this.detailObj.item.title === this.data[index].title){
      return "tri-down";
    }
    return "no-tri-down";
  }

  private closeReferenceDetail(){
    this.detailObj.showDetail = false;
    this.detailObj.item = {};
  }

  private getLayerClass(index): string{
    if(this.detailObj.item.title === this.data[index].title){
      return "reference-image-layer-select";
    }
    return "reference-image-layer-unselect";
  }

  private getBorderClass(index): string{
    if(this.detailObj.item.title === this.data[index].title){
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

}
