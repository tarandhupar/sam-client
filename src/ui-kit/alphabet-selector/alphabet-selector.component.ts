import { Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'sam-alphabet-selector',
  templateUrl: 'alphabet-selector.template.html'
})
export class SamAlphabetSelectorComponent {

  @Input() data:any = {size:2000};
  @Input() sortLabel:string;
  @Input() dataSize:number = 0;

  @Output() onDataRangeChange: EventEmitter<any> = new EventEmitter<any>();

  groupCapacity:number;
  groupArr:any;
  currentRangeIndex:number = 0;

  constructor(){

  }

  ngOnInit(){
    this.setGroupArray();
    this.onDataRangeChange.emit(this.groupArr[this.currentRangeIndex]);
  }

  ngOnChanges(){
    this.currentRangeIndex = 0;
    this.setGroupArray();
    this.onDataRangeChange.emit(this.groupArr[this.currentRangeIndex]);
  }


  setGroupArray(){
    this.groupCapacity = this.generateGroupCapacity();
    this.groupArr = [];
    for(let i = 0;i < 26; i = i + this.groupCapacity){

      let startChar = String.fromCharCode(65 + i);
      let endChar = String.fromCharCode(90);
      if(i + this.groupCapacity < 26){
        endChar = String.fromCharCode(65 + i + this.groupCapacity - 1);
      }

      this.groupArr.push({start:startChar,end:endChar});
    }
  }

  generateGroupCapacity():number{
    /* Logic to calculate the capacity in a group based on data size*/

    /* Fake logic for now */
    let groupCap = 10;
    if(this.dataSize > 100000){
      groupCap = 1;
    } else if(this.dataSize > 10000){
      groupCap = 3;
    } else if(this.dataSize > 1000){
      groupCap = 5;
    }
    return groupCap;
  }

  isLastGroup(rangeObj):boolean{return rangeObj.end !== 'Z';}
  isSingleCharGroup(rangeObj):boolean{return rangeObj.end === rangeObj.start;}

  getRangeClass(rangeObj):string{
    if(this.groupArr[this.currentRangeIndex] === rangeObj){
      return "current-range-link";
    }
    return "normal-range-link";
  }

  changeCurRange(index){
    this.currentRangeIndex = index;
    /* API call to retrieve related data*/
    this.onDataRangeChange.emit(this.groupArr[this.currentRangeIndex]);
  }


}
