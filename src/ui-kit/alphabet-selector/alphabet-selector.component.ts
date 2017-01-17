import { Component, Input, Output, EventEmitter} from "@angular/core";
import { AlphabetSelectorService } from "api-kit";

@Component({
  selector: 'sam-alphabet-selector',
  templateUrl: 'alphabet-selector.template.html'
})
export class SamAlphabetSelectorComponent {

  @Input() sortLabel:string;
  @Output() resultUpdate:EventEmitter<any> = new EventEmitter<any>();

  alphabetArr:any;
  prefixLayerArr:any = [];
  currentPrefix:string;

  defaultLayerData:any;
  layersData:any = [];
  resultData:any = [];


  constructor(private alphabetSelectorService: AlphabetSelectorService){

  }

  ngOnInit(){
    this.fetchDefault();

    this.alphabetArr = this.generateAlphabetArray();
    this.prefixLayerArr.push(this.alphabetArr);
  }

  fetchDefault(){
    this.alphabetSelectorService.getDefault().subscribe(data => {
      this.defaultLayerData = data.resultSizeByAlphabet;
      this.layersData.push(this.defaultLayerData);
      console.log(this.layersData);
    }, error => {
      console.error('Fail to fetch default layer data for alphabet selector: ', error);
    });
  }

  fetchNextLayerData(){
    this.alphabetSelectorService.getPrefixData(this.currentPrefix,0).subscribe(data => {
      if(Object.keys(data.resultSizeByAlphabet).length !== 0){
        this.layersData.push(data.resultSizeByAlphabet);
      }
      console.log(this.layersData);
    }, error => {
      console.error('Fail to fetch next layer data for alphabet selector: ', error);
    });
  }


  generateAlphabetArray():any{
    return Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }

  selectPrefix(prefix){
    let selectedLayer = prefix.length;
    this.currentPrefix = prefix;

    //Adjust the prefix tree layers
    this.prefixLayerArr.length = selectedLayer;
    this.layersData.length = selectedLayer;

    //Check with api to see whether drill down is needed
    this.fetchNextLayerData();

    if(this.layersData.length === selectedLayer + 1){
      //Set up the drill down layer if needed
      let drillDownArr = this.generateAlphabetArray().map((v)=>{return prefix+(v.toLowerCase());});
      this.prefixLayerArr.push(drillDownArr);
    }

  }

  isInCurrentPrefix(prefix){
    return !!this.currentPrefix && this.currentPrefix.startsWith(prefix);
  }

  isValidPrefix(prefix:string){
    if(prefix.length === 1){
      return Object.keys(this.defaultLayerData).indexOf(prefix) !== -1;
    }

    for(var i = 0;i < prefix.length;i++){
      if(Object.keys(this.layersData[i]).indexOf(prefix.charAt(i).toUpperCase()) === -1){
        return false;
      }
    }

    return true;
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
