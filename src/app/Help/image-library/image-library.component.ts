import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'imageLibrary',
  templateUrl: 'image-library.template.html'
})
export class ImageLibraryComponent {

  @Input() name:string;
  @Input() data:any;
  @Input() showDetailTitle:boolean = true;
  @Input() isExternalLink:boolean = true;
  @Input() hasLayer:boolean = true;
  @Input() isReleaseDetail:boolean = false;

  detailObj: any = {
    showDetail: false,
    item: {}
  };

  innerWidth: number = window.innerWidth;

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
      return "image-filter-layer-select";
    }
    return "image-filter-layer-unselect";
  }

  private getBorderClass(index): string{
    if(this.detailObj.item.title === this.data[index].title){
      return "item-border-select";
    }
    return "item-border-unselect";
  }

  private largeScreen(): boolean{
    return this.innerWidth >= 1200;
  }

  private getImageContainerClass(): string{
    if(this.largeScreen()){
      return "images-container"
    }
    return "images-container-small"

  }

  private getLinkClass(): string{
    return this.isExternalLink? "usa-external_link":"";
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

}
