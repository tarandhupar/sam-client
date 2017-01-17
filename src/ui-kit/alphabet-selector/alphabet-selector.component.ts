import { Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'sam-alphabet-selector',
  templateUrl: 'alphabet-selector.template.html'
})
export class SamAlphabetSelectorComponent {

  @Input() sortLabel:string;

  alphabetArr:any;
  prefixLayerArr:any = [];
  currentPrefix:string;

  defaultLayerData:any = {A:200, E:200, F:20000, Z:1000};

  constructor(){

  }

  ngOnInit(){
    this.alphabetArr = this.generateAlphabetArray();
    this.prefixLayerArr.push(this.alphabetArr);
  }

  generateAlphabetArray():any{
    return Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }

  selectPrefix(prefix){
    let selectedLayer = prefix.length;
    this.currentPrefix = prefix;

    //Adjust the prefix tree layers
    this.prefixLayerArr.length = selectedLayer;

    //Check with api to see whether drill down is needed
    
    
    //Set up the drill down layer if needed
    let drillDownArr = this.generateAlphabetArray().map((v)=>{return prefix+(v.toLowerCase());});
    this.prefixLayerArr.push(drillDownArr);
  }

  isInCurrentPrefix(prefix){
    return !!this.currentPrefix && this.currentPrefix.startsWith(prefix);
  }

  isValidPrefix(prefix){
    return Object.keys(this.defaultLayerData).indexOf(prefix) != -1;
  }

  getPrefixClass(prefix){
    if(!this.isValidPrefix(prefix)){
      return "disabled-prefix";
    }

    if(this.isInCurrentPrefix(prefix)){
      return "current-prefix";
    }
    return "normal-prefix";
  }

  getVerticalLineClass(prefix){
    if(this.isInCurrentPrefix(prefix)){
      return "current-vertical-line";
    }
    return "normal-vertical-line";
  }
}
