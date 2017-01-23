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

  formatted: boolean = false;
  innerWidth: number = window.innerWidth;

  constructor() { }

  ngOnInit(){
    if(!this.formatted){
      this.formatData();
      this.formatted = true;
    }
  }

  formatData(){
    let formatData = [];

    // Split the data to fit in 3 data item a row
    while (this.data.length > 0)
      formatData.push(this.data.splice(0, 3));

    this.data = formatData;
  }


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

  private getTriClass(i, j): string{
    if(this.detailObj.item.title === this.data[i][j].title){
      return "tri-down";
    }
    return "no-tri-down";
  }

  private closeReferenceDetail(){
    this.detailObj.showDetail = false;
    this.detailObj.item = {};
  }

  private getLayerClass(i, j): string{
    if(this.detailObj.item.title === this.data[i][j].title){
      return "image-filter-layer-select";
    }
    return "image-filter-layer-unselect";
  }

  private getBorderClass(i, j): string{
    if(this.detailObj.item.title === this.data[i][j].title){
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

  private toggleDetail(i): boolean{
    if(!this.detailObj.showDetail){
      return false;
    }

    for(let item of this.data[i]){
      if(item.title === this.detailObj.item.title){
        return true;
      }
    }
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

}
