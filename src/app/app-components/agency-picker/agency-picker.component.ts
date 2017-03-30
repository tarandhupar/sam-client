import { Component, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FHService } from 'api-kit';

@Component({
  selector: 'agencyPicker',
  templateUrl:'agency-picker.template.html'
})
/**
 * AgencyPickerComponent - Connects to backend FH services to select a single/multiple organizations
 *
 * @Input() multimode: boolean - configure to select a single or multiple organizations
 * @Input() advancedMode: boolean - configure advanced mode
 * @Input() getQSValue: boolean - Looks up a query string value to prepopulate selection
 * @Input() orgId: string - Prepopulate picker with an organization id
 * @Input() hint: string - Hint text that will appear below the label
 * @Input() orgRoot: string - Sets a root organization on the picker, users can only search/browse organizations under this root
 * @Input() levelLimit:number - Sets a hard limit of organizations to drill down to e.g. 2 will only show down to agency
 * @Input() initial: array - sets the array of selected organization array
 * @Output() department - emits a single department object with value property (note: in case later we need organization label emitted)
 * @Output() organization - emits array/single (Depending on `multimode` setting) of selected organizations when user closes the selection area
 */
export class AgencyPickerComponent implements OnInit {
  @Input() label: string = "Multiple Organization(s):";
  @Input() multimode: boolean = true;
  @Input() advancedMode: boolean = false;
  @Input() getQSValue: string = "organizationId";
  @Input() orgId: string = "";
  @Input() hint: string = "";
  @Input() orgRoot = "";
  @Input() required = false;
  @Input() searchMessage = "";
  @Input() initial: any[] = [];
  @Input() levelLimit: number = null;

  @Output('department') onDepartmentChange = new EventEmitter<any>();
  @Output() organization = new EventEmitter<any[]>();

  @ViewChild("autocompletelist") autocompletelist;


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
  autoComplete = [];
  autocompleteData = [];
  selectedOrganizations = [];
  selectedSingleOrganizationName = "";
  lockHierarchy = [];
  organizationId = '';
  defaultDpmtOption = {
    value:'',
    label: 'Please select a Department/Ind. Agency',
    name: ''
  };

  dpmtSelectConfig = {
    options: [
      this.defaultDpmtOption
    ],
    show: true,
    label: 'Department/Ind. Agency',
    name: 'Department',
    type: 'department',
    selectedOrg: ""
  };

  defaultAgencyOption = {
    value:'',
    label: 'Please select a Sub-tier',
    name: ''
  };

  agencySelectConfig = {
    options: [
      this.defaultAgencyOption
    ],
    show: false,
    label: 'Sub-tier',
    name: 'Agency',
    type: 'agency',
    selectedOrg: ""
  };

  defaultOfficeOption = {
    value:'',
    label: 'Please select an Office',
    name: ''
  };

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
    this.dpmtSelectConfig,
    this.agencySelectConfig,
    this.officeSelectConfig,
    Object.assign({}, this.officeSelectConfig),
    Object.assign({}, this.officeSelectConfig),
    Object.assign({}, this.officeSelectConfig),
    Object.assign({}, this.officeSelectConfig)
  ];

  showAutocompleteMsg = false;
  autocompleteMsg = "";
  selectorToggle = false;
  browseToggle = false;
  autocompleting = false;
  readonlyDisplay = "";
  readonlyDisplayList = [];
  readOnlyToggle = true;
  cancelBlur = false;
  dropdownLimit = 300;
  resetIconClass:string = "usa-agency-picker-search-reset";

  constructor(private activatedRoute:ActivatedRoute, private oFHService:FHService) {}

  /**
   * Autocomplete
   */
  autocompleteMouseover(idx) {
    this.autocompleteIndex = idx;
    this.lazyLoadAutocomplete();
  }

  autocompleteBlur(evt) {
    if(!this.cancelBlur) {
      this.resetAutocomplete();
    }

    this.cancelBlur = false;
  }

  cancelBlurMethod() {
    this.cancelBlur = true;
  }

  resetAutocomplete() {
    this.autoCompleteToggle = false;
    this.autoComplete.length = 0;
    this.autocompleteMsg = "";
    this.autocompleteData.length = 0;
    this.autocompleteEnd = false;
  }

  runAutocomplete() {
    //only run for name searches
    if(this._isLetter(this.searchTerm)) {
      this.autoComplete.length = 0;
      this.autocompleteEnd = false;
      this.autocompletePage = 0;
      let data = {
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':this.autocompletePageSize
      };

      if(this.orgRoot) {
        data['parentOrganizationId'] = this.orgRoot;
      }

      this.autocompleteIndex = 0;
      this.autocompleteLazyLoadMarker = 3;
      this.searchCall(data, false);
    } else {
      this.autocompleting = false;
      this.autoCompleteToggle = false;
    }
  }

  lazyLoadAutocomplete() {
    if(this.autocompleteIndex>= this.autocompleteLazyLoadMarker && !this.autocompleteEnd) {
      this.autocompleteLazyLoadMarker += this.autocompletePageSize;

      let data = {
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':this.autocompletePageSize
      };

      if(this.orgRoot) {
        data['parentOrganizationId'] = this.orgRoot;
      }

      this.searchCall(data, false);
    }
  }

  /**
   * Autocomplete Handler
   */
  keydownHandler(evt) {
    //esc
    if(this.autoCompleteToggle && evt['keyCode'] == 27) {
      this.resetAutocomplete();
    }
    //up
    else if(this.autoCompleteToggle && evt['keyCode'] == 38 && this.autocompleteIndex>0) {
      evt.preventDefault();
      this.autocompleteIndex-= 1;
      this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;
    }
    //down
    else if(this.autoCompleteToggle && evt['keyCode']== 40 && this.autocompleteIndex < this.autoComplete.length-1) {
      this.autocompleteIndex+= 1;
      this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;
      this.lazyLoadAutocomplete();
    }
    //down
    else if(!this.autoCompleteToggle && evt['keyCode'] == 40) {
      this.autoCompleteToggle = true;
      this.runAutocomplete();
    }
    //enter
    else if(this.autoCompleteToggle && evt['keyCode'] == 13) {
      if(this.autoComplete[this.autocompleteIndex]) {
        this.autocompleteSelection(this.autoComplete[this.autocompleteIndex]);
      }
    }
    //enter
    else if(!this.autoCompleteToggle && evt['keyCode'] == 13) {
      this.setOrganizationFromSearch();
    }
  }

  ngOnChanges(changes) {
    if (changes.initial && this.initial.length > 0) {
      let comp = this;
      this.initial.forEach(function(element) {
        comp.serviceCall(element, true).subscribe(data => {
          if(data['_embedded'][0]){
            let org = data._embedded[0]['org'];
            comp.addToSelectedOrganizations({
              name: org.name,
              value: org.orgKey
            });
          }
        });
      });
    }
  }

  /**
   * Init
   */
  ngOnInit() {
    if(this.advancedMode) {
      this.selectorToggle = true;
    }

    if(this.orgRoot && isNaN(Number(this.orgRoot))) {
      console.error("Invalid organization root entered: " + this.orgRoot);
      return;
    }

    this.orgLevels[2].label += " (L3)";
    this.orgLevels[3].label += " (L4)";
    this.orgLevels[4].label += " (L5)";
    this.orgLevels[5].label += " (L6)";
    this.orgLevels[6].label += " (L7)";
    
    if(this.orgId) {
      this.organizationId = this.orgId;
      this.initDropdowns();
    } else {
      this.activatedRoute.queryParams.subscribe(data => {
        this.organizationId = typeof data[this.getQSValue] === "string" ? decodeURI(data[this.getQSValue]) : "";
        this.initDropdowns();
      });
    }
  }

  autocompleteSelection(data) {
    this.autocompletePreselect = data._id;

    data["orgKey"] = data._id;
    this.updateBrowse(data);
    this.autoComplete.length = 0;
    this.setSearchTerm(data);
    this.autoCompleteToggle = false;
    this.autocompleteIndex = 0;
    this.setOrganizationFromSearch();
  }

  /**
   * Utilities
   */
  _isLetter(str) {
    return  str.match(/[^0-9]/);
  }

  _nameOrgSort(a, b) {
    if(a["org"]["name"].toLowerCase() < b["org"]["name"].toLowerCase()) return -1;
    if(a["org"]["name"].toLowerCase() > b["org"]["name"].toLowerCase()) return 1;
    return 0;
  }

  _filterActiveOrgs(org) {
    if(org["org"]['type']=="OFFICE" && org["org"]['modStatus'] && org["org"]['modStatus']!="active")
      return false;
    if(!org["org"]['name'])
      return false;

    return true;
  }

  searchTermChange(event) {
    this.autocompletePreselect = "";

    if(event.length >= 3 && !this.autocompleting) {
      this.autoCompleteToggle = true;

      if(this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      this.autocompleting = true;
      this.searchTimer = setTimeout(() => {
        this.runAutocomplete();
        this.autocompleting = false;
      }, 250);
    } else if(event.length < 3 && this.autoComplete.length > 0) {
      this.autocompleteData.length = 0;
      this.autoComplete.length = 0;
      this.showAutocompleteMsg = false;
      this.autocompleteMsg = "";
      this.autoCompleteToggle = false;
    } else if(event.length < 3 && this.showAutocompleteMsg) {
      this.showAutocompleteMsg = false;
      this.autocompleteMsg = "";
      this.autoCompleteToggle = false;
    }

    if(this.searchTerm.length > 0) {
      this.resetIconClass = "usa-agency-picker-search-reset-active";
    } else {
      this.resetIconClass = "usa-agency-picker-search-reset";
    }
  }

  searchCall(data, lazyloadFlag) {
    this.oFHService.search(data).subscribe(res => {
      if(res["_embedded"] && res["_embedded"]["results"]) {
        let comp = this;

        this.autocompleteData = res["_embedded"]["results"].map(function(org) {
          switch(org['type']) {
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

        if(this.autocompletePage < res['page']['totalPages'] - 1) {
          this.autocompletePage+= 1;
        } else {
          this.autocompleteEnd = true;
        }
      }

      if(this.autocompleteData.length > 0) {
        this.showAutocompleteMsg = false;
        this.autocompleteMsg = "";

        if(lazyloadFlag) {
          this.autoComplete.length = 0;
        }

        this.autoComplete.push(...this.autocompleteData);
      } else {
        this.showAutocompleteMsg = true;
        this.autocompleteMsg = "No matches found";
      }
    });
  }

  setSearchTerm(data) {
    this.searchTerm = data['name'];
  }

  //need to refactor
  updateBrowse(data) {
    let lvl = 0,
        idx;

    for(idx in this.orgLevels) {
      this.orgLevels[idx].selectedOrg = "";
    }

    //get full hierarchy of selection to get top level organization and get hierarchy to populate/select organization options
    if(data.type != "DEPARTMENT") {
      this.serviceCall(data.orgKey, false).subscribe(fullOrgPath => {
        let orgPathArr = fullOrgPath['_embedded'][0]['org']['fullParentPath'].split("."),
            orgidx;

        if(this.levelLimit) {
          orgPathArr.length = this.levelLimit;
        }

        for(orgidx in orgPathArr) {
          this.orgLevels[orgidx].selectedOrg = orgPathArr[orgidx];

          this.serviceCall(orgPathArr[orgidx], true).subscribe(orglvldata => {
            let orglvl,
                orgType,
                formattedData;

            orglvldata = orglvldata['_embedded']['0']['org'];
            orglvl = orglvldata['level']; //not zero based
            orgType = orglvldata['type'].toLowerCase() == "department" ? "agency": "office";
            orglvldata['hierarchy'] = orglvldata['hierarchy']
              .filter(this._filterActiveOrgs)
              .sort(this._nameOrgSort);

            if(orglvldata['hierarchy'].length>this.dropdownLimit) {
              orglvldata['hierarchy'].length = this.dropdownLimit;
            }

            if(orglvldata['hierarchy'].length > 0) {
              if(!this.levelLimit || this.levelLimit > parseInt(orglvl)) {
                formattedData = this.formatHierarchy(orgType, orglvldata['hierarchy']);
                if(this.lockHierarchy && orglvl < this.lockHierarchy.length){
                  let lockHierarchy = this.lockHierarchy;
                  this.orgLevels[orglvl].options = formattedData.filter((org) => {
                    if(org["value"] && lockHierarchy.indexOf(""+org["value"])!=-1)
                      return true;
                    return false;
                  });
                  this.orgLevels[orglvl].selectedOrg = this.lockHierarchy[orglvl];
                } else {
                  this.orgLevels[orglvl].options = formattedData;
                }
                this.orgLevels[orglvl].show = true;
              } else {
                this.orgLevels[orglvl].show = false;
              }
            } else {
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

  //needs refactor for messaging
  setOrganizationFromSearch() {
    let data = { limit: 5 },
        idx;

    if(this.autocompletePreselect.length > 0) {
      this.serviceCall(this.autocompletePreselect, false).subscribe(res => {
        this.setOrganization(res["_embedded"][0]["org"]);
        this.updateBrowse(res["_embedded"][0]["org"]);
      });

      return;
    }

    for(idx in this.orgLevels) {
      //this.orgLevels[idx].selectedOrg = "";
    }

    if(this.searchTerm.length == 0) {
      this.searchMessage = "Search cannot be empty";
      return;
    } else {
      this.searchMessage = "";
    }

    if(this._isLetter(this.searchTerm)) {
      data["keyword"] = this.searchTerm.replace(/\s\(\S+\)$/, "");

      if(this.orgRoot) {
        data['parentOrganizationId'] = this.orgRoot;
      }

      this.oFHService.search(data).subscribe(res => {
        this.searchData = res["_embedded"]["results"];
        this.searchResponseHandler();
      });
    } else {
      data["ids"] = this.searchTerm;
      this.serviceCall(this.searchTerm, false).subscribe(res => {
        if(res["_embedded"].length === 1) {
          res = res["_embedded"][0]['org'];

          if(this.orgRoot && res['fullParentPath'].split(".").indexOf(this.orgRoot) == -1) {
            this.searchMessage = "Organization doesn't belong to root organization";
            return;
          }

          this.setOrganization(res);
          this.updateBrowse(res);
        } else {
          console.error("error", res);
        }
      }, err => {
        this.searchMessage = `No organization found for '${this.searchTerm}'`;
      });
    }
  }

  searchResponseHandler() {
    let idx = this.checkSearchDataMatch();

    if(this.searchData.length == 0) {
      this.searchMessage = "No matches found";
    } else if(this.searchData.length == 1 || idx !== -1) {
      this.searchMessage = "";
      this.oFHService.getOrganizationById(this.searchData[idx]['_id'], true).subscribe(data => {
        this.setOrganization(data["_embedded"][0]["org"]);
        this.updateBrowse(data["_embedded"][0]["org"]);
      });
    } else {
      this.searchMessage = "Multiple Results found. Use Browse to refine your selection.";
      this.handleMultipleResultsFromSearch();
    }
  }

  //TODO: search needs a way to return the level
  checkSearchDataMatch() {
    let i,
        lvl,
        skip = false,
        isSkip;

    for(i = 0; i < this.searchData.length; i++) {
      switch(this.searchData[i].type) {
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

      //will need an update once API is updated to return all parent orgs (only returns direct parent)
      //skip match if orgroot is set and result doesn't belong to orgroot
      isSkip = (
        this.orgRoot && (
          this.orgRoot!= this.searchData[i]._id || (
            this.searchData[i].parentOrganizationHierarchy &&
            this.searchData[i].parentOrganizationHierarchy['organizationId'] != this.orgRoot
          )
        )
      );

      if(isSkip) {
        skip = true;
      }

      if(!skip && this.searchData[i].name + this.levelFormatter(lvl) === this.searchTerm) {
        return i;
      }
    }

    return -1;
  }

  handleMultipleResultsFromSearch() {
    this.resetBrowse();
    /* needs discussion on the right implementation
    console.log(this.searchData);

    let counts = [0, 0, 0],
        idx;

    for(idx in this.searchData) {
      switch(this.searchData[idx].type) {
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

    if(counts[0] == 1) {
      console.log("single dpmt matched");
    }

    console.log(counts);
    */
  }

  //switch from search call
  setOrganizationFromBrowse() {
    let selectedOrg,
        idx;

    for(idx in this.orgLevels) {
      if(this.orgLevels[idx]['selectedOrg']) {
        selectedOrg = this.orgLevels[idx]['selectedOrg'];
      }
    }

    if(selectedOrg) {
      this.oFHService.getOrganizationById(selectedOrg, true).subscribe(res => {
        this.setOrganization(res["_embedded"][0]['org']);
        this.searchMessage = "";
      });
    } else {
      this.searchMessage = "Please select an organization";
    }
  }

  //todo: potential refactor
  loadChildOrganizations(lvl) {
    let orgLevel,
        selectionLvl,
        dontResetDirectChildLevel,
        idx,
        hide,
        isRun;

    if(this.levelLimit && lvl >= this.levelLimit - 1) {
      return;
    }

    orgLevel = this.orgLevels[lvl];
    selectionLvl = lvl;
    dontResetDirectChildLevel = false;

    switch(selectionLvl)  {
      // Department
      case 0:
        this.onDepartmentChange.emit({
          value: orgLevel.selectedOrg
        });

        break;
    }

    //handle when user selects the empty org option, select parent org
    if(orgLevel.selectedOrg == "" && lvl > 0) {
      selectionLvl = lvl - 1;
      orgLevel = this.orgLevels[selectionLvl];
      dontResetDirectChildLevel = true;
    }

    //reset child selections
    for(idx = lvl + 1; idx < this.orgLevels.length; idx++) {
      this.orgLevels[idx]["selectedOrg"] = "";
    }

    //reset/hide dropdown at different levels
    for(idx in this.orgLevels) {
      hide = false;

      if(dontResetDirectChildLevel && idx > lvl) {
        hide = true;
      }

      if(!hide && idx <= lvl && this.orgLevels[idx]) {
        this.orgLevels[idx]["show"] = true;
      } else {
        this.orgLevels[idx]["show"] = false;
        this.orgLevels[idx]["options"].length = 1;
      }
    }

    //run call
    isRun = typeof orgLevel.selectedOrg !== 'undefined' &&
            orgLevel.selectedOrg !== ''
            && orgLevel.selectedOrg !== null;

    if(isRun) {
      this.serviceCall(orgLevel.selectedOrg, true).subscribe(oData => {
        //filter and sort if too many results
        oData = oData._embedded[0].org;
        oData["hierarchy"] = oData["hierarchy"]
          .filter(this._filterActiveOrgs)
          .sort(this._nameOrgSort);

        if(oData["hierarchy"].length > this.dropdownLimit) {
          oData["hierarchy"].length = this.dropdownLimit;
        }

        this.processDictionaryResponse(oData, selectionLvl);
      });
    }
  }

  processDictionaryResponse(data, lvl) {
    let formattedData;

    if(lvl == 0) {
      formattedData = this.formatHierarchy("agency", data.hierarchy);

      //no child agencies
      if(formattedData.length <= 1) {
        this.orgLevels[1].show = false;
      } else {
        this.orgLevels[1].options = formattedData;
        this.orgLevels[1].show = true;
      }

      this.orgLevels[2].options.length = 1;
      this.orgLevels[3].options.length = 1;
      this.orgLevels[4].options.length = 1;
      this.orgLevels[5].options.length = 1;
      this.orgLevels[6].options.length = 1;
    } else if(lvl >= 1) {
      if(data['hierarchy'] && data['hierarchy'].length > 0) {
        formattedData = this.formatHierarchy("office", data["hierarchy"]);
        this.orgLevels[lvl + 1].options = formattedData;
        this.orgLevels[lvl + 1].show = true;
      } else {
        this.orgLevels[lvl + 1].show = false;
      }
    }
  }

  setOrganization(data) {
    let level = 1,
        obj = {};

   level = data["level"]; //not zero based
   this.orgLevels[level - 1].selectedOrg = data.orgKey;

   obj['name'] = data['name'] + this.levelFormatter(level);
   obj['value'] = data['elementId'] ? data['elementId'] : data['orgKey'];

   this.searchMessage = "";
   this.addToSelectedOrganizations(obj);
   this.autoComplete.length = 0;
   this.organization.emit(this.multimode ? this.selectedOrganizations : this.selectedOrganizations[0]);
  }

  removeOrg(value) {
    this.selectedOrganizations = this.selectedOrganizations.filter(obj => (obj.value != value));

    if(this.multimode) {
      this.organization.emit(this.selectedOrganizations);
    }
  }

  addToSelectedOrganizations(data) {
    let searchArray = this.selectedOrganizations.filter(x => (x.value == data.value));

    if(searchArray.length == 0 && this.multimode) {
      this.selectedOrganizations.push(data);
    } else if(searchArray.length == 0 && !this.multimode) {
      this.selectedOrganizations.length = 0;
      this.selectedOrganizations.push(data);
      this.selectedSingleOrganizationName = data.name;
    }
  }

  emitSelectedOrganizations() {
    this.organization.emit(this.selectedOrganizations);
  }

  toggleSelectorArea() {
    this.selectorToggle = this.selectorToggle ? false : true;
  }

  close() {
    this.selectorToggle = false;
  }

  toggleBrowseArea() {
    this.browseToggle = this.browseToggle ? false : true;
  }

  serviceCall(orgId, hierarchy: boolean) {
    //get Department level of user's organizationId
    if(orgId != "") {
      return this.oFHService.getOrganizationById(orgId, hierarchy ? true : false);
    } else {
      return this.oFHService.getDepartments();
    }
  }

  //refactor preset organziationId handling
  initDropdowns() {
    let root = this.orgRoot ? this.orgRoot : "",
        formattedData;

		this.serviceCall(root, true).subscribe(res => {
      let orgPath = res._embedded[0]['org']['fullParentPath'].split(".");
      
      //lock the hierachy to the defined orgroot
      if(this.orgRoot){
        if(this.levelLimit) {
          orgPath.length = this.levelLimit;
        }
        this.lockHierarchy = orgPath;
        //set dropdowns to have only selections belonging to orgroot
        for(let idx in orgPath) {
          let level = parseInt(idx) + 1;
          let label = res._embedded[0]['org'][`l${level}Name`] + this.levelFormatter(level);

          if(!this.levelLimit || level < this.levelLimit) {
            this.orgLevels[idx].options = [{
              'value': orgPath[idx],
              'label': label,
              'name': orgPath[idx]
            }];

            this.orgLevels[idx].selectedOrg = orgPath[idx]
            this.orgLevels[idx].show = true;
          }
        }

        //if there are children, populate the next level dropdowns
        if(res._embedded[0]['org']['hierarchy'].length > 0) {
          if(!this.levelLimit || orgPath.length < this.levelLimit) {
            let type = res._embedded[0]['org']['type'] == "DEPARTMENT" ? "agency" : "office";//children types can only be one of these
            formattedData = this.formatHierarchy(type, res._embedded[0]['org']['hierarchy']);
            this.orgLevels[orgPath.length].options = formattedData;
            this.orgLevels[orgPath.length].show = true;
          }
        }
      }
      //populate deparment dropdowns otherwise 
      else {
        res._embedded = res._embedded.sort(this._nameOrgSort);
        formattedData = this.formatHierarchy("department", res._embedded);
        this.orgLevels[0].options = formattedData;
      }
      //if organizationId is preset (QS or through an input)
      if(this.organizationId){
        this.serviceCall(this.organizationId, false).subscribe(res => {
          this.updateBrowse(res['_embedded'][0]["org"]);
          this.searchTerm = res['_embedded'][0]["org"]["name"];
        });
      }
		});
  }

  formatHierarchy(type, data) {
    data = data.map((el,idx)=>{
      let level = el["org"]["level"];
      let obj = {
        value: el['org']['orgKey'],
        label: el["org"]["name"] + this.levelFormatter(level),
        name: el["org"]["orgKey"],
        
      };
      return obj;
    });
    
    //add defaults
    switch(type) {
      case "department":
        data.unshift(this.defaultDpmtOption);
        break;
      case "agency":
        data.unshift(this.defaultAgencyOption);
        break;
      case "office":
        data.unshift(this.defaultOfficeOption);
        break;
    }
    return data;
  }

  levelFormatter(lvl) {
    const lvls = [
      'D',
      'A',
      'L3',
      'L4',
      'L5',
      'L6',
      'L7',
    ];
    return ` (${lvls[lvl-1]})`;
  }

  clearSelectedOrgs() {
    this.selectedSingleOrganizationName = "";
    this.selectedOrganizations.length = 0;
    this.emitSelectedOrganizations();
  }

  resetBrowse() {
    let idx;

    for(idx in this.orgLevels) {
      //if orgroot is set, only reset orgs below orgroot (defined in lockHierarchy)
      if(this.lockHierarchy.length == 0 || this.lockHierarchy.length > 0 && parseInt(idx) > this.lockHierarchy.length - 1) {
        this.orgLevels[idx].selectedOrg = "";
        //sub-tier and office need full reset only
        if(parseInt(idx) > this.lockHierarchy.length) {
          this.orgLevels[idx].show = false;
          this.orgLevels[idx].options.length = 1;
        }
      }
    }
  }

  onResetClick() {
    this.autocompletePreselect = "";
    this.searchTerm = "";
    this.resetIconClass = "usa-agency-picker-search-reset";
  }
}
