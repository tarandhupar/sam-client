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
    posX: -1,
    posY: -1,
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


  selectDetail(i, j, event){
    if(this.isCurrent(i,j) && this.detailObj.showDetail){
      this.detailObj.showDetail = false;
    }else{
      this.detailObj.showDetail = true;
      this.detailObj.posX = i;
      this.detailObj.posY = j;
      this.detailObj.item = this.data[this.detailObj.posX][this.detailObj.posY];
    }
    event.stopPropagation();
  }

  private getItemClass(i, j){
    if(this.isCurrent(i,j) && this.detailObj.showDetail){
      return "fa-minus";
    }
    return "fa-plus";
  }

  private getTriClass(i, j): string{
    if(this.isCurrent(i ,j) && this.detailObj.showDetail){
      return "tri-down";
    }
    return "no-tri-down";
  }

  private closeReferenceDetail(){
    this.detailObj.showDetail = false;
    this.detailObj.item = {};
  }

  private getLayerClass(i, j): string{
    if(this.isCurrent(i ,j) && this.detailObj.showDetail){
      return "image-filter-layer-select";
    }
    return "image-filter-layer-unselect";
  }

  private getBorderClass(i, j): string{
    if(this.isCurrent(i ,j) && this.detailObj.showDetail){
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
    return this.detailObj.showDetail && this.detailObj.posX === i;
  }

  private isCurrent(i,j):boolean{
    return i === this.detailObj.posX && j === this.detailObj.posY;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

}
