import { Component,Directive, Input,ElementRef,Renderer,Output,OnInit,EventEmitter,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FHService } from 'api-kit';

@Component({
	selector: 'agencyPicker',
	templateUrl:'agency-picker.template.html',
  styleUrls: [ 'agency-picker.style.scss' ]
})

/**
* AgencyPickerComponent - Connects to backend FH services to select a single/multiple organizations
* 
* @Input multimode: boolean - congfigure to select a single or multiple organizations
* @Input getQSValue: boolean - Looks up a query string value to prepopulate selection
* @Input() orgId: string - Prepopulate picker with an organization id
* @Output organization - emits array of selected organizations when user closes the selection area
*
*/
export class AgencyPickerComponent implements OnInit {
  @Input() label: string = "Multiple Organization(s):";
  @Input() multimode: boolean = true;
  @Input() getQSValue: string = "organizationId";
  @Input() orgId: string = "";
  @Input() hint: string = "";
  @ViewChild("autocompletelist") autocompletelist;
	@Output() organization = new EventEmitter<any[]>();

  private searchTimer: NodeJS.Timer = null;
  searchTerm = "";
  searchData = [];
  autocompleteIndex = 0;
  autocompletePage = 0;
  autocompleteLazyLoadMarker = 3;
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
    this.dpmtSelectConfig, this.agencySelectConfig, this.officeSelectConfig, 
    Object.assign({},this.officeSelectConfig), Object.assign({},this.officeSelectConfig),Object.assign({},this.officeSelectConfig),
    Object.assign({},this.officeSelectConfig)
  ];
  showAutocompleteMsg = false;
  autocompleteMsg = "";
  searchError = false;
  searchMessage = "";
  selectorToggle = false;
  browseToggle=false;
  searchObjCache = {};
  autocompleting = false;
  readonlyDisplay = "";
  readonlyDisplayList = [];
  readOnlyToggle = true;
  browseSelection = {};
  cancelBlur = false;
  resetIconClass:string = "usa-agency-picker-search-reset";

	constructor(private activatedRoute:ActivatedRoute, private oFHService:FHService){}

  autocompleteMouseover(idx){
    this.autocompleteIndex = idx;
    this.lazyLoadAC();
  }

  onInputBlur(evt){  
    if(!this.cancelBlur){
      this.resetAutocomplete();
    }
    this.cancelBlur = false;
    this.searchError = false;
    this.searchMessage = "";
  }

  cancelBlurMethod(){
    this.cancelBlur=true;
  }

  resetAutocomplete(){
    this.autoCompleteToggle = false;
    this.autoComplete.length = 0;
    this.autocompleteMsg = "";
    this.autocompleteData.length = 0;
  }

	ngOnInit() {
    this.orgLevels[2].label += " (L3)";
    this.orgLevels[3].label += " (L4)";
    this.orgLevels[4].label += " (L5)";
    this.orgLevels[5].label += " (L6)";
    this.orgLevels[6].label += " (L7)";
    if(this.orgId.length>0){
      this.organizationId = this.orgId;
    } else {
      this.activatedRoute.queryParams.subscribe( data => {
        this.organizationId = typeof data[this.getQSValue] === "string" ? decodeURI(data[this.getQSValue]) : "";
        this.initFederalHierarchyDropdowns('');
      });
    }
	}

  updateOrgSelection(arr){
    //nothing, binding is still intact
  }

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  setReadonlyDisplay(){
    this.readOnlyToggle = false;
    if(this.selectedOrganizations.length>0){
      this.readonlyDisplayList = this.selectedOrganizations.slice(0);
    } else {
      this.readonlyDisplay = "";
      this.readonlyDisplayList.length = 0;
    }
    this.readOnlyToggle = true;
  }

  removeOrg(value){
    this.selectedOrganizations = this.selectedOrganizations.filter(function(obj){
      return obj.value != value;
    });
    this.setReadonlyDisplay();
  }

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
    if(this.searchTerm.length>0){
      this.resetIconClass = "usa-agency-picker-search-reset-active";
    } else {
      this.resetIconClass = "usa-agency-picker-search-reset";
    }
  }

  runAutocomplete(){
    //only run for name searches
    if(this.isLetter(this.searchTerm[0])){
      this.autocompletePage = 0;
      var data = {
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':5
      };
      this.autocompleteIndex=0;
      this.autocompleteLazyLoadMarker = 3;

      this.oFHService.search(data).subscribe( res => {
        if(res["_embedded"] && res["_embedded"]["results"]){
          this.autocompleteData = res["_embedded"]["results"];//.slice(0,5);
          for(var idx in this.autocompleteData){
            switch(this.autocompleteData[idx].type){
              case "DEPARTMENT":
                this.autocompleteData[idx].name += this.levelFormatter(1);
                break;
              case "AGENCY":
                this.autocompleteData[idx].name += this.levelFormatter(2);
                break;
              case "OFFICE":
                this.autocompleteData[idx].name += this.levelFormatter(3);
                break;
            }
          }
        }
        if(this.autocompleteData.length>0){
          this.showAutocompleteMsg = false;
          this.autocompleteMsg = "";
          this.autoComplete.length=0;
          this.autoComplete.push(...this.autocompleteData);
        } else {
          this.showAutocompleteMsg = true;
          this.autocompleteMsg = "No matches found";
        }
      });
    } else {
      this.autocompleting = false;
      this.autoCompleteToggle = false;
    }
  }

  lazyLoadAC(){
    if(this.autocompleteIndex>=this.autocompleteLazyLoadMarker){
      this.autocompleteLazyLoadMarker += 5;
      this.autocompletePage+=1;
      var data = {
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':5
      };
      this.oFHService.search(data).subscribe( res => {
        if(res["_embedded"] && res["_embedded"]["results"]){
          this.autocompleteData = res["_embedded"]["results"].slice(0,5);
          for(var idx in this.autocompleteData){
            switch(this.autocompleteData[idx].type){
              case "DEPARTMENT":
                this.autocompleteData[idx].name += this.levelFormatter(1);
                break;
              case "AGENCY":
                this.autocompleteData[idx].name += this.levelFormatter(2);
                break;
              case "OFFICE":
                this.autocompleteData[idx].name += this.levelFormatter(3);
                break;
            }
          }
        }
        if(this.autocompleteData.length>0){
          this.showAutocompleteMsg = false;
          this.autocompleteMsg = "";
          //this.autoComplete.length=0;
          this.autoComplete.push(...this.autocompleteData);
        } else {
          this.showAutocompleteMsg = true;
          this.autocompleteMsg = "No matches found";
        }
      });
    }
  }

  //what kind of data?
  autocompleteSelection(data){
    data["orgKey"] = data._id;
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

  //need to refactor
  updateBrowse(data){
    for(var idx in this.orgLevels){
      this.orgLevels[idx].selectedOrg = "";
    }
    //get full hierarchy of selection to get top level organization and get hierarchy to populate/select organization options
    var lvl = 0;
    if(data.type!="DEPARTMENT"){
      this.serviceCall(data.orgKey, true, false).subscribe( fullOrgPath => {
        var orgPathArr = fullOrgPath['_embedded'][0]['org']['fullParentPath'].split(".");
        for(var orgidx in orgPathArr){
          this.orgLevels[orgidx].selectedOrg = orgPathArr[orgidx];
          this.serviceCall(orgPathArr[orgidx],false,false).subscribe( orglvldata => {
            orglvldata = orglvldata['_embedded']['0']['org'];
            var orglvl = orglvldata['level'];//not zero based
            var orgType = orglvldata['type'].toLowerCase() == "department" ? "agency": "office";
            orglvldata['hierarchy'] = orglvldata['hierarchy'].filter(function(org){
              if(org["org"]['type']=="OFFICE" && org["org"]['modStatus'] && org["org"]['modStatus']!="active"){
                return false;
              }
              if(!org["org"]['name']){
                return false;
              }
              return true;
            }).sort(function(a,b){
              if(a["org"]["name"].toLowerCase() < b["org"]["name"].toLowerCase()) return -1;
              if(a["org"]["name"].toLowerCase() > b["org"]["name"].toLowerCase()) return 1;
              return 0;
            });
            if(orglvldata['hierarchy'].length>300){
              orglvldata['hierarchy'].length = 300;// = orglvldata['hierarchy'].slice(0,300);
            }
            
            if(orglvldata['hierarchy'].length>0){
              var formattedData = this.formatHierarchy(orgType,orglvldata['hierarchy']);
              this.orgLevels[orglvl].options = formattedData;
              this.orgLevels[orglvl].show = true;
            } else{
              this.orgLevels[orglvl].options.length = 1;
              this.orgLevels[orglvl].show = false;
            }
          });
        }
      });
    } else { 
      this.orgLevels[0].selectedOrg = data.orgKey; 
      this.loadChildOrganizations(0); 
    }
  }

  updateSearchFromBrowse(){
    if(typeof this.browseSelection["level"]!=="undefined"){
      var selectedOrgId = this.orgLevels[this.browseSelection["level"]].selectedOrg;
      var searchTerm = this.orgLevels[this.browseSelection["level"]].options.reduce(function(searchterm,val,idx,arr){
        if(val["value"]==selectedOrgId){
          searchterm = val.label;
        }
        return searchterm;
      },"");
      //searchTerm = searchTerm.replace(/\s\(\S+\)$/,"");
      this.searchTerm = searchTerm;
    }
  }

  //needs refactor for messaging
  setOrganizationFromSearch(){
    var selected
    for(var idx in this.orgLevels){
      this.orgLevels[idx].selectedOrg = "";
    }
    if(this.searchTerm.length==0){
      this.searchError = true;
      this.searchMessage = "Search cannot be empty";
      return;
    } else {
      this.searchError = false;
      this.searchMessage = "";
    }
    var data = {
      'limit':5
    };

    if(this.isLetter(this.searchTerm[0])){
      data["keyword"] = this.searchTerm.replace(/\s\(\S+\)$/,"");
      this.oFHService.search(data).subscribe( res => {
        this.searchData = res["_embedded"]["results"];
        this.searchResponseHandler();
      }); 
    } else {
      data["ids"] = this.searchTerm;
      this.oFHService.getOrganizationById(this.searchTerm).subscribe(res=>{
        if(res["_embedded"].length===1){
          res = res["_embedded"][0]['org'];
          this.setOrganization(res);
          this.updateBrowse(res);
        } else {
          console.log("error",res);
        }
        //this.setOrganizationFromBrowse();
      });
    }
  }

  searchResponseHandler(){
    var idx = this.checkSearchDataMatch()
    if(this.searchData.length==0){
      this.searchError = true;
      this.searchMessage = "No matches found";
    } else if (this.searchData.length == 1 || idx !==-1){
      this.searchError = false;
      this.searchMessage = "";//"Match found for: " + this.searchData[0]["name"];
      //console.log(idx, this.searchData);
      this.oFHService.getOrganizationById(this.searchData[idx]['_id']).subscribe(data =>{
        this.setOrganization(data["_embedded"][0]["org"]);
        this.updateBrowse(data["_embedded"][0]["org"]);
      });
    } else {
      this.searchError = true;
      this.searchMessage = "Multiple Results found. Use Browse to refine your selection.";
      this.handleMultipleResultsFromSearch();
    }
  }

  //todo, search needs a way to return the level
  checkSearchDataMatch(){
    for(var i = 0;i < this.searchData.length;i++){
      var lvl;
      switch(this.searchData[i].type){
        case "DEPARTMENT":
          lvl = 1;
          break;
        case "AGENCY":
          lvl = 2;
          break;
        case "OFFICE":
          lvl = 3;
          break;
      }
      if(this.searchData[i].name+this.levelFormatter(lvl)===this.searchTerm){
        return i;
      }
    }
    return -1;
  }

  handleMultipleResultsFromSearch(){
    this.resetBrowse();
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
    var selectedOrg;
    for(var idx in this.orgLevels){
      if(this.orgLevels[idx]['selectedOrg']){
        selectedOrg = this.orgLevels[idx]['selectedOrg'];
      }
    }
    if(selectedOrg){
      this.oFHService.getOrganizationById(selectedOrg).subscribe( res => {
        this.setOrganization(res["_embedded"][0]['org']);
        this.searchError = false;
        this.searchMessage = "";
      }); 
    } else {
      this.searchMessage = "Please select an organization";
      this.searchError = true;
    }
  }

  //todo: potential refactor
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
      var hide = false;
      if(dontResetDirectChildLevel && idx > lvl){
        hide = true;
      }
      if(!hide && idx <= lvl && this.orgLevels[idx]){
        this.orgLevels[idx]["show"]=true;
      } else {
        this.orgLevels[idx]["show"]=false;
        this.orgLevels[idx]["options"].length = 1;
      }
    }

    if(typeof orgLevel.selectedOrg !== 'undefined' && orgLevel.selectedOrg !== ''
        && orgLevel.selectedOrg !== null) {
      this.serviceCall(orgLevel.selectedOrg, true, true).subscribe( oData => {
        oData = oData._embedded[0].org;
        oData["hierarchy"] = oData["hierarchy"].filter(function(org){
          if(org["org"]['type']=="OFFICE" && org["org"]['modStatus'] && org["org"]['modStatus']!="active"){
            return false;
          }
          if(!org["org"]['name']){
            return false;
          }
          return true;
        }).sort(function(a,b){
          if(a["org"]["name"].toLowerCase() < b["org"]["name"].toLowerCase()) return -1;
          if(a["org"]["name"].toLowerCase() > b["org"]["name"].toLowerCase()) return 1;
          return 0;
        });
        if(oData["hierarchy"].length > 300){
          oData["hierarchy"].length = 300;
        }
        this.processDictionaryResponse(oData,selectionLvl);
      });  
    }
  }

  processDictionaryResponse(data,lvl){
    if(lvl==0){
      var formattedData = this.formatHierarchy("agency",data.hierarchy);
      //no child agencies
      if(formattedData.length <= 1){
        this.orgLevels[1].show=false;
      } else {
        this.dictionary.aAgency = data.hierarchy;
        this.orgLevels[1].options = formattedData;
        this.orgLevels[1].show = true;
      }
      this.orgLevels[2].options.length = 1;
      this.orgLevels[3].options.length = 1;
      this.orgLevels[4].options.length = 1;
      this.orgLevels[5].options.length = 1;
      this.orgLevels[6].options.length = 1;
    } else if (lvl >= 1){
      if(data['hierarchy'] && data['hierarchy'].length>0){
        var formattedData = this.formatHierarchy("office",data["hierarchy"]);
        this.dictionary.aOffice = data["hierarchy"];
        this.orgLevels[lvl+1].options = formattedData;
        this.orgLevels[lvl+1].show = true;
      } else {
        this.orgLevels[lvl+1].show = false;
      }
    }
  }

  checkChildHierarchyExists(data,lvl){
    var org = data;
    for(var i = 0; i <= lvl; i++){
      if(!org["hierarchy"]){
        return false;
      }
      org = org["hierarchy"][0];
    }
    return true;
  }

  setOrganization(data){
   var level = 1;
   level = data["level"];
   this.orgLevels[level-1].selectedOrg = data.orgKey;
   var obj = {};
   obj['name'] = data['name'] + this.levelFormatter(level);
   obj['value'] = data['elementId'] ? data['elementId'] : data['orgKey'];
   this.addToSelectedOrganizations(obj);
   this.autoComplete.length = 0;
   this.organization.emit(this.selectedOrganizations);
   this.setReadonlyDisplay();
  }

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

  emitSelectedOrganizations(){
    this.organization.emit(this.selectedOrganizations);
  }

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

  toggleBrowseArea(){
    this.browseToggle = this.browseToggle ? false : true;
  }

  //autocomplete handling
  keydownHandler(evt){
    //esc
    if (this.autoCompleteToggle && evt['keyCode'] == 27){
      this.resetAutocomplete();
    }
    //up 
    else if(this.autoCompleteToggle && evt['keyCode'] == 38 && this.autocompleteIndex>0){
      //console.log("up",this.autocompleteIndex);
      evt.preventDefault();
      this.autocompleteIndex-=1;
      this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;      
    }
    //down
    else if(this.autoCompleteToggle && evt['keyCode']==40 && this.autocompleteIndex <= this.autoComplete.length-1){
      //console.log("down",this.autocompleteIndex);
      this.autocompleteIndex+=1;
      this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;
      this.lazyLoadAC();
    } 
    //down
    else if(!this.autoCompleteToggle && evt['keyCode'] == 40){
      this.autoCompleteToggle = true;
      this.runAutocomplete();
    } 
    //enter
    else if (this.autoCompleteToggle && evt['keyCode'] == 13){
      if(this.autoComplete[this.autocompleteIndex]){
        this.autocompleteSelection(this.autoComplete[this.autocompleteIndex]);
      }
    }
    //enter
    else if (!this.autoCompleteToggle && evt['keyCode'] == 13){
      this.setOrganizationFromSearch();
    }
  }

	serviceCall(orgId, includeParent, includeChildren){
		//get Department level of user's organizationId
    if(orgId!=""){
      return this.oFHService.getOrganizationById(orgId);
    } else {
      return this.oFHService.getDepartments();
    }
	}

  //refactor preset organziationId handling
	initFederalHierarchyDropdowns(userRole){
		this.serviceCall("",true,false).subscribe( res => {
			//this.dictionary.aDepartment = res._embedded.hierarchy;
      res._embedded = res._embedded.sort(function(a,b){
        if(a["org"]["name"].toLowerCase() < b["org"]["name"].toLowerCase()) return -1;
        if(a["org"]["name"].toLowerCase() > b["org"]["name"].toLowerCase()) return 1;
        return 0;
      });
      var formattedData = this.formatHierarchy("department",res._embedded);
      this.dpmtSelectConfig.options = formattedData;
      
      if(this.organizationId.length > 0) {
        this.oFHService.getOrganizationById(this.organizationId).subscribe(res => {
          this.setOrganization(res);
          this.updateBrowse(res);
          this.searchTerm = res.name;
          this.setReadonlyDisplay();
          if(res.type=="AGENCY"){
            this.orgLevels[1].show=true;
            if(this.checkChildHierarchyExists(res,0)){
              this.orgLevels[2].show=true;
            }
          }
          if(res.type=="OFFICE"){
            this.orgLevels[1].show=true;
            this.orgLevels[2].show=true;
          }
        });
      }
      
		});
	}

  //switch case may not be needed, refactor other places where this is called
  formatHierarchy(type,data){
    var formattedData = [];
    var level = 1;
    switch(type){
      case "department":
        formattedData.push(this.defaultDpmtOption);
        break;
      case "agency":
        formattedData.push(this.defaultAgencyOption);
        level = 2;
        break;
      case "office":
        formattedData.push(this.defaultOfficeOption);
        level = 3;
        break;
    }

    for(var idx in data){
      var obj = {};
      if(data[idx]["org"]){
        level = data[idx]["org"]["level"];
        obj['value'] = data[idx]["org"]["orgKey"];
        obj['label'] = data[idx]["org"]["name"] + this.levelFormatter(level);
        obj['name'] = data[idx]["org"]["orgKey"];
      } else {
        obj['value'] = data[idx]["elementId"];
        obj['label'] = data[idx]["name"]+ this.levelFormatter(level);
        obj['name'] = data[idx]["elementId"];
      }
      if(obj['label']){
        formattedData.push(obj);
      }
    }
    return formattedData;
  }

  levelFormatter(lvl){
    switch(lvl){
      case 1:
        return " (D)";
      case 2:
        return " (A)";
      case 3:
        return " (L3)";
      case 4:
        return " (L4)";
      case 5:
        return " (L5)";
      case 6:
        return " (L6)";
      case 7:
        return " (L7)";
    }
  }
  
  clearSelectedOrgs(){
    this.selectedSingleOrganizationName="";
    this.selectedOrganizations.length = 0;
    this.emitSelectedOrganizations();
  }
  
  resetBrowse(){
    for(var idx in this.orgLevels){
      this.orgLevels[idx].selectedOrg = "";
      //sub-tier and office need full reset only
      if(parseInt(idx) > 0){
        this.orgLevels[idx].show = false;
        this.orgLevels[idx].options.length = 1;  
      }
    }
  }
  onResetClick(){
    this.searchTerm = "";
    this.resetIconClass = "usa-agency-picker-search-reset";
  }
}
