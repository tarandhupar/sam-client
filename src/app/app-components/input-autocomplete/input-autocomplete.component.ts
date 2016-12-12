import { Component,Directive, Input,ElementRef,Renderer,Output,OnInit,EventEmitter,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FHService } from 'api-kit';

@Component({
	selector: 'samInputAutocomplete',
	templateUrl:'input-autocomplete.template.html'
})

export class InputAutocompleteComponent implements OnInit {

  //@Input() orgRoot = "";
  @Input() autoComplete = [];
  @Input() lazyLoad: boolean = false;
  @ViewChild("autocompletelist") autocompletelist;
	//@Output() autocompleteSelection = new EventEmitter<any>();

  private searchTimer: NodeJS.Timer = null;
  autocompletePreselect = "";
  searchTerm = "";
  searchData = [];
  autocompleteIndex = 0;
  autocompletePage = 0;
  autocompletePageSize = 5;
  autocompleteLazyLoadMarker = 3;
  autoCompleteToggle = false;
  autocompleteEnd = false;
  autocompleteData = [];
  showAutocompleteMsg = false;
  autocompleteMsg = "";
  searchMessage = "";
  autocompleting = false;
  cancelBlur = false;
  dropdownLimit = 300;
  resetIconClass:string = "usa-agency-picker-search-reset";

	constructor(private oFHService:FHService){}

  //autocomplete
  autocompleteMouseover(idx){
    this.autocompleteIndex = idx;
    this.lazyLoadAutocomplete();
  }

  autocompleteBlur(evt){
    if(!this.cancelBlur){
      this.resetAutocomplete();
    }
    this.cancelBlur = false;
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
    this.autocompleteEnd = false;
  }

  runAutocomplete(){
    //only run for name searches
    if(this._isLetter(this.searchTerm)){
      this.autoComplete.length = 0;
      this.autocompleteEnd = false;
      this.autocompletePage = 0;
      var data = {
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':this.autocompletePageSize
      };
      /*if(this.orgRoot){
        data['parentOrganizationId'] = this.orgRoot;
      }*/
      this.autocompleteIndex=0;
      this.autocompleteLazyLoadMarker = 3;
      this.searchCall(data,false);
    } else {
      this.autocompleting = false;
      this.autoCompleteToggle = false;
    }
  }

  lazyLoadAutocomplete(){
    if(this.autocompleteIndex>=this.autocompleteLazyLoadMarker && !this.autocompleteEnd){
      this.autocompleteLazyLoadMarker += this.autocompletePageSize;
      //this.autocompletePage+=1;
      var data = {
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':this.autocompletePageSize
      };
      /*if(this.orgRoot){
        data['parentOrganizationId'] = this.orgRoot;
      }*/
      this.searchCall(data,false);
    }
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
    else if(this.autoCompleteToggle && evt['keyCode']==40 && this.autocompleteIndex < this.autoComplete.length-1){
      //console.log("down",this.autocompleteIndex);
      this.autocompleteIndex+=1;
      this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;
      this.lazyLoadAutocomplete();
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
      //this.setOrganizationFromSearch();
    }
  }

  //init
	ngOnInit() {
	}

  //what kind of data?
  autocompleteSelection(data){
    this.autocompletePreselect = data._id;
    //data["orgKey"] = data._id;
    this.autoComplete.length = 0;
    this.setSearchTerm(data);
    this.autoCompleteToggle = false;
    this.autocompleteIndex = 0;
    
    this.emitAutoselect();
  }

  //utility
  _isLetter(str) {
    return  str.match(/[^0-9]/);
  }

  _nameOrgSort(a,b){
    if(a["org"]["name"].toLowerCase() < b["org"]["name"].toLowerCase()) return -1;
    if(a["org"]["name"].toLowerCase() > b["org"]["name"].toLowerCase()) return 1;
    return 0;
  }

  _filterActiveOrgs(org){
    if(org["org"]['type']=="OFFICE" && org["org"]['modStatus'] && org["org"]['modStatus']!="active"){
      return false;
    }
    if(!org["org"]['name']){
      return false;
    }
    return true;
  }

  searchTermChange(event){
    this.autocompletePreselect = "";
    if(event.length>=3 && !this.autocompleting){
      console.log("we get here?");
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

  searchCall(data,lazyloadFlag){
    this.oFHService.search(data).subscribe( res => {
      if(res["_embedded"] && res["_embedded"]["results"]){
        var comp = this;

        this.autocompleteData = res["_embedded"]["results"].map(function(org){
          switch(org['type']){
            case "DEPARTMENT":
              org.name += comp.levelFormatter(1);
              break;
            case "AGENCY":
              org.name += comp.levelFormatter(2);
              break;
            case "OFFICE":
              org.name += comp.levelFormatter(3);
              break;
          }
          return org;
        });
        if(this.autocompletePage < res['page']['totalPages']-1){
          this.autocompletePage+=1;
        } else{
          this.autocompleteEnd = true;
        }
      }
      if(this.autocompleteData.length>0){
        this.showAutocompleteMsg = false;
        this.autocompleteMsg = "";
        if(lazyloadFlag){
          this.autoComplete.length=0;
        }
        this.autoComplete.push(...this.autocompleteData);
      } else {
        this.showAutocompleteMsg = true;
        this.autocompleteMsg = "No matches found";
      }
    });
  }

  setSearchTerm(data){
    this.searchTerm = data['name'];
  }

  emitAutoselect(){
    //this.organization.emit(this.selectedOrganizations);
  }

	serviceCall(orgId,hierarchy:boolean){
		//get Department level of user's organizationId
    if(orgId!=""){
      if(hierarchy){
        return this.oFHService.getOrganizationById(orgId);
      } else{
        return this.oFHService.getSimpleOrganizationById(orgId);
      }
    } else {
      return this.oFHService.getDepartments();
    }
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

  onResetClick(){
    this.autocompletePreselect = "";
    this.searchTerm = "";
    this.resetIconClass = "usa-agency-picker-search-reset";
  }
}
