import { Component,Directive, Input,ElementRef,Renderer,Output,OnInit,EventEmitter,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FHService } from 'api-kit';

@Component({
	selector: 'agencyPicker',
	templateUrl:'agency-picker.template.html',
  styleUrls: [ 'agency-picker.style.scss' ]
})

/* 
* 
* 
*/
export class AgencyPickerComponent implements OnInit {
  @Input() multimode: boolean = true;
  @Input() getQSValue: string = "organizationId";
  @Input() orgId: string = "";
  @ViewChild("multiselect") multiselect;
	@Output() organization = new EventEmitter<any[]>();

  private searchTimer: NodeJS.Timer = null;
  searchTerm = "";
  searchData = [];
  autocompleteIndex = 0;
  autoCompleteToggle = false;
  autoComplete = [];
  autocompleteData = [];
  selectedOrganizations = [];
  selectedSingleOrganizationName = "";
	lockAgency = false;
	lockOffice = false;
	dictionary = {
		aDepartment:[],
		aAgency: [],
		aOffice: []
	};
	organizationId = '';
  defaultDpmtOption = {value:'', label: 'Please select an Department', name: ''};
  dpmtSelectConfig = {
    options: [
      this.defaultDpmtOption
    ],
    show: true,
    label: 'Department',
    name: 'Department',
    type: 'department',
    selectedOrg: ""
  };
  defaultAgencyOption = {value:'', label: 'Please select an Agency', name: ''};
  agencySelectConfig = {
    options: [
      this.defaultAgencyOption
    ],
    show: false,
    label: 'Agency',
    name: 'Agency',
    type: 'agency',
    selectedOrg: ""
  };
  defaultOfficeOption = {value:'', label: 'Please select an Office', name: ''};
  officeSelectConfig = {
    options: [
      this.defaultOfficeOption
    ],
    show: false,
    label: 'Office',
    name: 'Office',
    type: 'office',
    selectedOrg: ""
  };
  orgLevels = [
    this.dpmtSelectConfig, this.agencySelectConfig, this.officeSelectConfig
  ];
  showAutocompleteMsg = false;
  autocompleteMsg = "";
  fhSearchError = false;
  fhSearchMessage = "";
  selectorToggle = false;
  browseToggle=false;
  searchObjCache = {};
  autocompleting = false;
  readonlyDisplay = "";
  readonlyDisplayList = [];
  readOnlyToggle = true;
  browseSelection = {};
	constructor(private activatedRoute:ActivatedRoute, private oFHService:FHService){}
  autocompleteMouseover(idx){
    this.autocompleteIndex = idx;
  }
  onInputFocus(evt){

  }
  onInputBlur(evt){
    this.resetAutocomplete();
  }
  resetAutocomplete(){
    this.autoCompleteToggle = false;
    this.autoComplete.length = 0;
    this.autocompleteMsg = "";
    this.autocompleteData.length = 0;
  }
  //good
	ngOnInit() {
    if(this.orgId.length>0){
      this.organizationId = this.orgId;
    } else {
      this.activatedRoute.queryParams.subscribe(
        data => {
          this.organizationId = typeof data[this.getQSValue] === "string" ? decodeURI(data[this.getQSValue]) : "";
          this.initFederalHierarchyDropdowns('');
        });
    }
	}
  //good
  updateOrgSelection(arr){
    //nothing, binding is still intact
  }
  //good
  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
  //good
  setReadonlyDisplay(){
    this.readOnlyToggle = false;
    if(this.selectedOrganizations.length>0){
      if(!this.multimode){
        this.readonlyDisplay = this.selectedOrganizations.reduce(function(finalStr,val,idx){
          if(idx==0){
            return val.name
          } else {
            return finalStr + ", " + val.name;
          }
        },"");
      } else {
        this.readonlyDisplayList = this.selectedOrganizations.slice(0);
      }
    } else {
      this.readonlyDisplay = "";
      this.readonlyDisplayList.length = 0;
    }
    this.readOnlyToggle = true;
  }
  //good
  searchTermChange(event){
    if(event.length>=3 && !this.autocompleting){
      this.autoCompleteToggle = true;
      if (this.searchTimer) {
          clearTimeout(this.searchTimer);
      }
      this.autocompleting=true;
      this.searchTimer = setTimeout(
          () => {
            this.runAutocomplete();
            this.autocompleting = false;
          },
          250
      );
    } else if (event.length < 3 && this.autoComplete.length>0){
      this.autocompleteData.length = 0;
      this.autoComplete.length = 0;
      this.showAutocompleteMsg = false;
      this.autocompleteMsg = "";
      this.autoCompleteToggle = false;
    } else if (event.length < 3 && this.showAutocompleteMsg){
      this.showAutocompleteMsg = false;
      this.autocompleteMsg = "";
      this.autoCompleteToggle = false;
    }
  }

  //refactor for messaging
  runAutocomplete(){
    //only run for name searches
    if(this.isLetter(this.searchTerm[0])){
      var data = {
        'limit':5,
        'name':this.searchTerm
      };
      this.autocompleteIndex=0;

      this.oFHService.search(data).subscribe( res => {
        if(res["_embedded"] && res["_embedded"]["hierarchy"]){
          this.autocompleteData = res["_embedded"]["hierarchy"];
        }
        if(this.autocompleteData.length>0){
          this.showAutocompleteMsg = false;
          this.autocompleteMsg = "";
          this.autoComplete.length=0;
          this.autoComplete.push(...this.autocompleteData.slice(0,5));
        } else {
          this.showAutocompleteMsg = true;
          this.autocompleteMsg = "No matches found";
        }
      });
      
    }
  }

  //what kind of data?
  autocompleteSelection(data){
    this.updateBrowse(data);
    this.autoComplete.length = 0;
    this.setSearchTerm(data);
    this.autoCompleteToggle = false;
    this.autocompleteIndex = 0;
  }

  //what kind of data is saved to cache?
  setSearchTerm(data){
    this.searchTerm = data['name'];
    this.searchObjCache = data;
  }

  //what kind of data is passed in? assumes orgLevels[idx].selectedOrganization is preset?
  updateBrowse(data){
    for(var idx in this.orgLevels){
      this.orgLevels[idx].selectedOrg = "";
    }
    //get full hierarchy of selection to get top level organization and get hierarchy to populate/select organization options
    var lvl = 0;
    if(data.type!="DEPARTMENT"){
      this.initDictionaries(data.elementId, true, false).subscribe( fullOrgPath => {
        this.oFHService.getFederalHierarchyById(fullOrgPath.elementId, true, true).subscribe( res => {
          //console.log(fullOrgPath,"org path");
          //console.log(res,"full org tree");
          var reachedEnd = false;
          var idx = 0;
          var path = fullOrgPath;
          while(!reachedEnd){
            this.orgLevels[idx].selectedOrg = path.elementId;
            if(idx!=0){
              this.orgLevels[idx].options.length = 0;
              var type = idx==1?"agency":"office";
              var formattedOptions = this.formatHierarchy(type,res["hierarchy"]);
              //console.log("formatted options",idx,res);
              this.orgLevels[idx].options.push(...formattedOptions);
              this.orgLevels[idx].show = true;
            } 
            //console.log(idx,path,res);
            if(path["hierarchy"] && path["hierarchy"][0]){
              if(idx!=0){
                res = res["hierarchy"].find(function(el,idx,arr){
                  if(el.elementId==path.elementId){
                    return true;
                  }
                });
              }
              path = path["hierarchy"][0];
            } else {
              if(res["hierarchy"]){
                res = res["hierarchy"].find(function(el,idx,arr){
                  if(el.elementId==path.elementId){
                    return true;
                  }
                });
              }
              
              if(res["hierarchy"]){
                this.orgLevels[idx+1].options.length = 0;
                var type = idx+1==1?"agency":"office";
                var formattedOptions = this.formatHierarchy(type,res["hierarchy"]);
                //console.log("formatted options",idx,res);
                this.orgLevels[idx+1].options.push(...formattedOptions);
                this.orgLevels[idx+1].show = true;
              }
              reachedEnd=true;
            }
            idx++;
          }
          lvl = idx-1; 

          this.browseSelection = {
            "level" : lvl,
            "org" : this.orgLevels[lvl].selectedOrg
          }
        });
      });
    } else { 
      this.orgLevels[0].selectedOrg = data.elementId; 
      this.loadChildOrganizations(0); 
    }
  }

  //good
  updateSearchFromBrowse(){
    if(typeof this.browseSelection["level"]!=="undefined"){
      var selectedOrgId = this.orgLevels[this.browseSelection["level"]].selectedOrg;
      this.searchTerm = this.orgLevels[this.browseSelection["level"]].options.reduce(function(searchterm,val,idx,arr){
        if(val["value"]==selectedOrgId){
          searchterm = val.label;
        }
        return searchterm;
      },"");
       
    }
  }

  //needs refactor for messaging
  setOrganizationFromSearch(){
    if(this.searchTerm.length==0){
      this.fhSearchError = true;
      this.fhSearchMessage = "Search cannot be empty";
      return;
    } else {
      this.fhSearchError = false;
      this.fhSearchMessage = "";
    }
    var search = false;
    var data = {
      'limit':5
    };

    if(this.isLetter(this.searchTerm[0])){
      data["name"] = this.searchTerm;
      search = true;
    } else {
      data["ids"] = this.searchTerm;
      search = true;
    }
    if(this.searchObjCache["name"] && this.searchTerm == this.searchObjCache["name"]){
      this.searchData = [this.searchObjCache];
      this.searchResponseHandler();
      return;
    }
    if(search){
      this.oFHService.search(data).subscribe( res => {
        if(res["_embedded"] && res["_embedded"]["hierarchy"]){
          this.searchData = res["_embedded"]["hierarchy"];
        }
        this.searchResponseHandler();
      }); 
    } else {
      this.fhSearchError = true;
      this.fhSearchMessage = "Invalid search entered";
    }
  }

  //good
  searchResponseHandler(){
    if(this.searchData.length==0){
      this.fhSearchError = true;
      this.fhSearchMessage = "No matches found";
    } else if (this.searchData.length == 1){
      this.fhSearchError = true;
      this.fhSearchMessage = "Match found for: " + this.searchData[0]["name"];
      this.setOrganization(this.searchData[0]);
    } else {
      this.fhSearchError = true;
      this.fhSearchMessage = "Multiple Results found. Use Browse to refine your selection.";
      this.handleMultipleResultsFromSearch();
    }
  }

  handleMultipleResultsFromSearch(){
    this.orgLevels[0].selectedOrg = "";
    this.orgLevels[1].show = false;
    this.orgLevels[1].selectedOrg = "";
    this.orgLevels[1].options.length = 1;
    this.orgLevels[2].show = false;
    this.orgLevels[2].selectedOrg = "";
    this.orgLevels[2].options.length = 1;
    /* needs discussion on the right implementation
    console.log(this.searchData);
    var counts = [0,0,0];
    for(var idx in this.searchData){
      switch(this.searchData[idx].type){
        case "DEPARTMENT":
          counts[0]++;
          break;
        case "AGENCY":
          counts[1]++;
          break;
        case "OFFICE":
          counts[2]++;
          break; 
      }
    }
    if(counts[0]==1){
      console.log("single dpmt matched");
    }
    console.log(counts);
    */
  }
  //switch from search call
  setOrganizationFromBrowse(){
    //console.log(this.browseSelection);
    if(this.browseSelection["org"]){
      var data = {
        "ids":this.browseSelection["org"]
      }
      this.oFHService.search(data).subscribe( res => {
        this.setOrganization(res["_embedded"]["hierarchy"][0]);
      }); 
    } else {
      this.fhSearchMessage = "Please select an organization";
      this.fhSearchError = true;
    }
  }

  //refactor
  loadChildOrganizations(lvl){
    var orgLevel = this.orgLevels[lvl];
    var selectionLvl = lvl;
    var dontResetDirectChildLevel = false;
    if(orgLevel.selectedOrg=="" && lvl>0){
      selectionLvl = lvl-1;
      orgLevel = this.orgLevels[selectionLvl];
      dontResetDirectChildLevel = true;
    }
    for(var idx = lvl+1; idx < this.orgLevels.length; idx++){
      this.orgLevels[idx]["selectedOrg"]="";
    }

    this.browseSelection = {
      "level":selectionLvl,
      "org": orgLevel["selectedOrg"]
    };

    for(idx in this.orgLevels){
      if(idx <= lvl+1 && this.orgLevels[idx]){
        this.orgLevels[idx]["show"]=true;
      } else {
        this.orgLevels[idx]["show"]=false;
      }
    }

    //empty agency & office dropdowns
    if(orgLevel.type=="department"){
      if(!dontResetDirectChildLevel){
        this.dictionary.aAgency = [];
        this.orgLevels[1]["options"].length = 1;;
        //this.agencySelectConfig["options"].length = 1;
      }
      this.dictionary.aOffice.length = 0;
      this.orgLevels[2]["options"].length = 1;
      //this.officeSelectConfig["options"].length = 1;
      this.orgLevels[2].show = false;
    } else if (orgLevel.type=="agency"){
      this.dictionary.aOffice.length = 0;
      this.orgLevels[2]["options"].length = 1;;
      //this.officeSelectConfig["options"].length = 1;
    }

    if(typeof orgLevel.selectedOrg !== 'undefined' && orgLevel.selectedOrg !== ''
        && orgLevel.selectedOrg !== null) {
        this.initDictionaries(orgLevel.selectedOrg, true, true).subscribe( oData => {
          this.processDictionaryResponse(oData,selectionLvl);
          this.updateSearchFromBrowse();
        });
        
    }
  }

  //work for 7 levels?
  processDictionaryResponse(data,lvl){
    if(lvl==0){
      var formattedData = this.formatHierarchy("agency",data.hierarchy);
      //no child agencies
      if(formattedData.length<=1){
        this.orgLevels[1].show=false;
      }
      this.dictionary.aAgency = data.hierarchy;
      this.agencySelectConfig.options = formattedData;
      this.officeSelectConfig.options.length = 1;
    } else if (lvl == 1){
      if(this.checkChildHierarchyExists(data,lvl)){

        var formattedData = this.formatHierarchy("office",data["hierarchy"][0]["hierarchy"]);
        this.dictionary.aOffice = data["hierarchy"][0].hierarchy;
        this.officeSelectConfig.options = formattedData;
      } else {
        this.officeSelectConfig.show = false;
      }
    }
  }

  //what kind of data is expected? appears to be full hiearchy
  checkChildHierarchyExists(data,lvl){
    var org = data;
    //console.log(org,lvl);
    for(var i = 0; i <= lvl; i++){
      //console.log("iterating",i, org);
      if(!org["hierarchy"]){
        return false;
      }
      org = org["hierarchy"][0];
    }
    return true;
  }

  //what if lower level selectedOrg is set but not the higher lvl?
  setOrganization(data){
   if(data.type=="DEPARTMENT"){
     this.orgLevels[0].selectedOrg = data.elementId;
   } 
   else if(data.type=="AGENCY"){
     this.orgLevels[1].selectedOrg = data.elementId;
   } 
   else if(data.type=="OFFICE"){
     this.orgLevels[2].selectedOrg = data.elementId;
   } 
   var obj = {};
   obj['name'] = data['name'];
   obj['value'] = data['elementId'];
   this.addToSelectedOrganizations(obj);
   this.autoComplete.length = 0;
   this.organization.emit(this.selectedOrganizations);
  }

  //good w/minor refactor
  addToSelectedOrganizations(data){
    var searchArray = this.selectedOrganizations.filter( x=> {
      return x.value == data.value;
    });
    
    if(searchArray.length==0 && this.multimode){
      this.selectedOrganizations.push(data);
    } else if (searchArray.length==0 && !this.multimode){
      this.selectedOrganizations.length = 0;
      this.selectedOrganizations.push(data);
      this.selectedSingleOrganizationName = data.name;
    }
  }

  //handler for multiselect
  emitSelectedOrganizations(){
    this.organization.emit(this.selectedOrganizations);
  }

  //good, may need to revisit when readonly display is upated
  toggleSelectorArea(){
    this.selectorToggle = this.selectorToggle ? false : true;
    if(this.selectorToggle == false){
      this.setReadonlyDisplay();
    }
  }

  close(){
    this.selectorToggle = false;
    this.setReadonlyDisplay();
  }
  //good
  toggleBrowseArea(){
    this.browseToggle = this.browseToggle ? false : true;
  }
  keydownHandler(evt){
    //esc
    if (this.autoCompleteToggle && evt['keyCode'] == 27){
      this.resetAutocomplete();
    }
    //up 
    else if(this.autoCompleteToggle && evt['keyCode'] == 38 && this.autocompleteIndex>0){
      //console.log("up",this.autocompleteIndex);
      this.autocompleteIndex-=1;
    }
    //down
    else if(this.autoCompleteToggle && evt['keyCode']==40 && this.autocompleteIndex<=this.autocompleteData.length){
      //console.log("down",this.autocompleteIndex);
      this.autocompleteIndex+=1;
    } 
    //down
    else if(!this.autoCompleteToggle && evt['keyCode']==40){
      this.autoCompleteToggle = true;
      this.runAutocomplete();
    } 
    //enter
    else if (this.autoCompleteToggle && evt['keyCode']==13){
      if(this.autocompleteData[this.autocompleteIndex]){
        this.autocompleteSelection(this.autocompleteData[this.autocompleteIndex]);
      }
    }
    //enter
    else if (!this.autoCompleteToggle && evt['keyCode']==13){
      this.setOrganizationFromSearch();
    }
  }
  //rename function
	initDictionaries(ordId, includeParent, includeChildren){
		//get Department level of user's organizationId
    return this.oFHService.getFederalHierarchyById(ordId, includeParent, includeChildren);
	}

  //refactor preset organziationId handling
	initFederalHierarchyDropdowns(userRole){
		this.initDictionaries("",true,false).subscribe( res => {
			this.dictionary.aDepartment = res._embedded.hierarchy;
      var formattedData = this.formatHierarchy("department",res._embedded.hierarchy);
      this.dpmtSelectConfig.options = formattedData;
      
      if(this.organizationId.length > 0) {
        this.oFHService.getFederalHierarchyById(this.organizationId, false, true).subscribe(res => {
          //inferring department match
          this.setOrganization(res);
          this.updateBrowse(res);
          this.searchTerm = res.name;
          this.setReadonlyDisplay();
          if(res.type=="AGENCY"){
            this.agencySelectConfig.show=true;
            if(this.checkChildHierarchyExists(res,0)){
              this.officeSelectConfig.show=true;
            }
          }
          if(res.type=="OFFICE"){
            this.agencySelectConfig.show=true;
            this.officeSelectConfig.show=true;
          }
          
        });
      }
      
		});
	}

  //switch case may not be needed, refactor other places where this is called
  formatHierarchy(type,data){
    var formattedData = [];
    switch(type){
      case "department":
        formattedData.push(this.defaultDpmtOption);
        break;
      case "agency":
        formattedData.push(this.defaultAgencyOption);
        break;
      case "office":
        formattedData.push(this.defaultOfficeOption);
        break;
    }

    for(var idx in data){
      var obj = {};
      obj['value'] = data[idx].elementId;
      obj['label'] = data[idx].name;
      obj['name'] = data[idx].elementId;
      formattedData.push(obj);
    }
    return formattedData;
  }

  removeSelectedOrgs(){
    var selectedValues = this.multiselect.selectedValues;
    var filteredArray = this.multiselect.myOptions.filter(function( obj ) {
      for(var idx in selectedValues){
        if(selectedValues[idx] == obj.value){
          return false;
        }
      }
      return true;
    });
    this.multiselect.myOptions.length = 0;
    [].push.apply(this.multiselect.myOptions,filteredArray);
    this.emitSelectedOrganizations();
  }
}
