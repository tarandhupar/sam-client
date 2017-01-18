import { Component, Input, Output, EventEmitter} from "@angular/core";
import { AlphabetSelectorService } from "api-kit";

@Component({
  selector: 'sam-alphabet-selector',
  templateUrl: 'alphabet-selector.template.html'
})
export class SamAlphabetSelectorComponent {

  @Input() sortLabel:string;
  @Input() currentPage:number = 1;
  @Output() resultUpdate:EventEmitter<any> = new EventEmitter<any>();
  @Output() paginationUpdate:EventEmitter<any> = new EventEmitter<any>();

  paginationConfig:any = {};
  alphabetArr:any;
  prefixLayerArr:any = [];
  currentPrefix:string = '';
  isNextLayerNeeded:boolean = false;

  defaultLayerData:any;
  layersData:any = [];
  resultData:any = [];



  constructor(private alphabetSelectorService: AlphabetSelectorService){

  }

  ngOnInit(){
    this.fetchDefault(1);

    this.alphabetArr = this.generateAlphabetArray();
    this.prefixLayerArr.push(this.alphabetArr);
    this.resultUpdate.emit(this.resultData);
  }

  ngOnChanges(){
    console.log("changes");
    if(this.currentPrefix === '' && this.resultData.length !== 0){
      console.log("get in");
      this.fetchDefault(this.currentPage);
      this.resultUpdate.emit(this.resultData);
      console.log("get out");
    }

    // if(this.currentPrefix === '') {
    //   console.log("in default");
    //   this.fetchDefault(this.currentPage);
    //   this.resultUpdate.emit(this.resultData);
    // }
    // }else{
    //   console.log("in prefix");
    //   this.fetchPrefixData(this.currentPage);
    //   this.resultUpdate.emit(this.resultData);
    //
    // }
  }

  fetchDefault(pageNum:number){
    this.alphabetSelectorService.getDefault(pageNum).subscribe(data => {
      this.defaultLayerData = data.resultSizeByAlphabet;
      this.layersData.push(this.defaultLayerData);
      this.resultData = data.resultData;
      this.updatePagination();
    }, error => {
      console.error('Fail to fetch default layer data for alphabet selector: ', error);
    });
  }

  fetchPrefixData(pageNum:number){
    this.alphabetSelectorService.getPrefixData(this.currentPrefix,pageNum).subscribe(data => {
      this.isNextLayerNeeded = false;
      if(Object.keys(data.resultSizeByAlphabet).length !== 0){
        this.layersData.push(data.resultSizeByAlphabet);
        this.isNextLayerNeeded = true;
      }
      this.resultData = data.resultData;
      this.updatePagination();
    }, error => {
      console.error('Fail to fetch prefix data for alphabet selector: ', error);
    });
  }

  updatePagination(){
    let totalFilterResults = 0;
    if(this.currentPrefix === ''){
      Object.keys(this.defaultLayerData).forEach(key=>totalFilterResults += this.defaultLayerData[key]);
    }else{
      let prefix = this.currentPrefix.toUpperCase();
      this.layersData.forEach(val=>{
        if(val.hasOwnProperty(prefix)){
          totalFilterResults = val[prefix];
        }
      });
    }

    this.paginationConfig.currentPage = 1;
    this.paginationConfig.totalPages = Math.ceil(totalFilterResults/10);
    this.paginationUpdate.emit(this.paginationConfig);

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
    this.fetchPrefixData(1);

    if(this.isNextLayerNeeded){
      //Set up the drill down layer if needed
      let drillDownArr = this.generateAlphabetArray().map((v)=>{return prefix+(v.toLowerCase());});
      this.prefixLayerArr.push(drillDownArr);
    }

    //Update the result list
    this.resultUpdate.emit(this.resultData);

  }

  getPrefixClass(prefix){
    if(!this.isValidPrefix(prefix)){
      return "disabled-prefix";
    }

    if(this.isInCurrentPrefix(prefix)){
      return "current-prefix";
    }

    if(this.isPreSelected(prefix)){
      return "pre-selected-prefix";
    }
    return "normal-prefix";
  }

  getVerticalLineClass(prefix){
    if(this.isInCurrentPrefix(prefix)){
      if(this.isOnEdge(prefix)){
        return "edge-current-vertical-line";
      }
      return "current-vertical-line";
    }
    return "normal-vertical-line";
  }

  isInCurrentPrefix(prefix){
    return !!this.currentPrefix && this.currentPrefix.startsWith(prefix);
  }

  isValidPrefix(prefix:string){
    for(let layer of this.layersData){
      if(layer.hasOwnProperty(prefix.toUpperCase())){
        return true;
      }
    }

    return false;
  }

  isPreSelected(prefix:string){
    if(this.currentPrefix.length < this.layersData.length){
      return Object.keys(this.layersData[this.layersData.length - 1])[0] === prefix.toUpperCase();
    }
    return false;
  }

  isOnEdge(prefix){
    return prefix.charAt(prefix.length-1).toUpperCase() === 'A' || prefix.charAt(prefix.length-1).toUpperCase() === 'Z';
  }



}
