import { Component,OnInit } from '@angular/core';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { SearchService } from 'api-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import {WageDeterminationService} from "../../api-kit/wage-determination/wage-determination.service";
import { AlertFooterService } from '../alerts/alert-footer';

@Component({
  moduleId: __filename,
  selector: 'search',
  providers: [CapitalizePipe],
  templateUrl: 'search.template.html'
})

export class SearchPage implements OnInit{
  keyword: string = "";
  index: string = "";
  organizationId:string = '';
  pageNum = 0;
  totalCount: any= 0;
  totalPages: any= 0;
  showPerPage = 10;
  data = [];
  featuredData = [];
  oldKeyword: string = "";
  initLoad = true;
  showOptional:any = (SHOW_OPTIONAL=="true");
  qParams:any = {};
  isActive: boolean = false;

  // Active Checkbox config
  checkboxModel: any = ['true'];
  checkboxConfig = {
    options: [
      {value: 'true', label: 'Active', name: 'checkbox-active'},
    ],
    name: 'active-filter'
  };

  // Wage Determination Radio Component
  wdTypeModel: any = null;
  wdTypeConfig = {
    options:  [
      {value: 'sca', label: 'Service Contract Act (SCA)', name: 'radio-sca'},
      {value: 'dbra', label: 'Davis-Bacon Act (DBA)', name: 'radio-dba'}
    ],
    name: 'wageDeterminationRad',
    label: '',
    errorMessage: '',
    hint: ''
  };

  // Select State Component
  wdStateModel = '';
  selectStateConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select State',
    name: 'state',
  };

  // Select County Component
  wdCountyModel = '';
  selectCountyConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select County',
    name: 'county',
  };

  // Select Construct Type Component drop-down
  wdConstructModel = '';
  selectConstructConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select Construction Type',
    name: 'constructionType',
  };

  // Select SCA Previously Performed Radio Buttons
  wdPreviouslyPerformedModel = '';
  wdPreviouslyPerformedConfig = {
    options:  [
      {value: 'prevPerfYesLocality', label: 'Yes, in the same locality', name: 'prevYesLocality'},
      {value: 'prevPerfYesDifferentLocality', label: 'Yes, but in a different locality', name: 'prevYesDifferentLocality'},
      {value: 'prevPerfNo', label: 'No, not performed before', name: 'prevNo'}
    ],
    name: 'previousPerformedRad',
    label: 'Were these services previously performed under an SCA-Covered contract?',
    errorMessage: '',
    hint: ''
  };

  // Select SCA Subject to CBA - Radio Buttons
  wdSubjectToCBAModel = '';
  wdSubjectToCBAConfig = {
    options:  [
      {value: 'yesBasedCBA', label: 'Yes, and the current contract is based on a CBA', name: 'cbaYesBased'},
      {value: 'yesUnbasedCBA', label: 'Yes, but the current contract is not based on a CBA', name: 'cbaYesUnbased'},
      {value: 'noCBA', label: 'No', name: 'cbaNo'}
    ],
    name: 'cbaRad',
    label: 'Were the employees working subject to a CBA?',
    errorMessage: '',
    hint: ''
  };


  // Select NonStandard Services - Radio Buttons
  wdNonStandardRadModel: any = [''];
  wdNonStandardRadConfig = {
    options:  [
      {value: 'yesNSS', label: 'Yes', name: '6'},
      {value: 'true', label: 'No, and the SCA WD ends in an even number', name: 'noEven'},
      {value: 'false', label: 'No, and the SCA WD ends in an odd number', name: 'noOdd'}
    ],
    name: 'radio-component4',
    label: 'Are the contract services to be performed listed below as Non-Standard Services?',
    errorMessage: '',
    hint: ''
  };

  // Select NonStandard Service, Service - drop down
  wdNonStandardSelectModel = '';
  wdNonStandardSelectConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'If yes, select the services to be performed',
    name: 'constructionType',
  };

  wdSearchDescription: string = "The Wage Determination filter asks a series of questions to determine if a WDOL is available based on your selected criteria. <br/><br/>Please note that using the keyword search with these WD type-specific filters may limit your search results.<br/><br/> If you cannot locate a Wage Determination, try searching with no keywords and use the Wage Determination filters to find your result."

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private wageDeterminationService: WageDeterminationService,
              private alertFooterService: AlertFooterService) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      data => {
        console.log('this is the data logged on init ', data);
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.isActive = data['isActive'] && data['isActive'] === "true" ? true : this.isActive;
        this.checkboxModel = this.isActive === false ? [] : ['true'];
        this.wdTypeModel = data['wdType'] && data['wdType'] !== null ? data['wdType'] : null;
        this.wdStateModel = data['state'] && data['state'] !== null ? data['state'] : '';
        this.wdCountyModel = data['county'] && data['county'] !== null ? data['county'] : '';
        this.wdConstructModel = data['conType'] && data['conType'] !== null ? data['conType'] : '';
        this.wdNonStandardSelectModel = data['service'] && data['service'] !== null ? data['service'] : '';
        this.wdNonStandardRadModel = data['isEven'] && data['isEven'] !== null ? data['isEven'] : '';
        this.wdSubjectToCBAModel = data['cba'] && data['cba'] !== null ? data['cba'] : '';
        this.wdPreviouslyPerformedModel = data['prevP'] && data['prevP'] !== null ? data['prevP'] : '';

        this.runSearch();
        this.loadParams();
      });
  }


  loadParams(){
    var qsobj = this.setupQS(false);
    this.searchService.loadParams(qsobj);
  }

  onOrganizationChange(orgId:any){

    this.organizationId = ""+orgId.value;
    this.loadParams();
  }

  setupQS(newsearch){
    var qsobj = {};
    if(this.keyword.length>0){
      qsobj['keyword'] = this.keyword;
    } else {
      qsobj['keyword'] = '';
    }
    if(this.index.length>0){
      qsobj['index'] = this.index;
    } else {
      qsobj['index'] = '';
    }
    if(!newsearch && this.pageNum>=0){
      qsobj['page'] = this.pageNum+1;
    }
    else {
      qsobj['page'] = 1;
    }
    qsobj['isActive'] = this.isActive;

    //wd or sca type param
    if(this.wdTypeModel!=null) {
      qsobj['wdType'] = this.wdTypeModel;
    }

    //wd dba construction type param
    if(this.wdConstructModel.length>0){
      qsobj['conType'] = this.wdConstructModel;
    }

    //wd state param
    if(this.wdStateModel.length>0){
      qsobj['state'] = this.wdStateModel;
    }

    //wd county param
    if(this.wdCountyModel.length>0){
      qsobj['county'] = this.wdCountyModel;
    }

    //wd Non Standard drop down param
    if(this.wdNonStandardSelectModel.length>0){
      qsobj['service'] = this.wdNonStandardSelectModel;
    }

    //wd Non Standard radio button param
    if(this.wdNonStandardRadModel.length>0){
      qsobj['isEven'] = this.wdNonStandardRadModel;
    }

    //wd subject to cba param
    if(this.wdSubjectToCBAModel.length>0){
      qsobj['cba'] = this.wdSubjectToCBAModel;
    }

    //wd previously performed param
    if(this.wdPreviouslyPerformedModel.length>0){
      qsobj['prevP'] = this.wdPreviouslyPerformedModel;
    }

    return qsobj;
  }

	runSearch(){
    if(this.index === 'wd') {
      // fetching data for drop downs
      this.getDictionaryData('wdStates');
      this.getCountyByState(this.wdStateModel);
      this.determineEnableCountySelect();
      this.determineEnableServicesSelect();
      this.getDictionaryData('dbraConstructionTypes');
      this.getDictionaryData('scaServices');
    }
    //make featuredSearch api call only for first page
    if(this.pageNum<=0 && this.keyword!=='') {
      this.searchService.featuredSearch({
        keyword: this.keyword
      }).subscribe(
        data => {
          if(data._embedded && data._embedded.featuredResult) {
            for(var i=0; i<data._embedded.featuredResult.length; i++) {
              if (data._embedded.featuredResult[i].parentOrganizationHierarchy) {
                data._embedded.featuredResult[i].parentOrganizationHierarchy.name = new CapitalizePipe().transform(data._embedded.featuredResult[i].parentOrganizationHierarchy.name.replace(/[_-]/g, " "));
              }
              if (data._embedded.featuredResult[i].type) {
                data._embedded.featuredResult[i].type = new CapitalizePipe().transform(data._embedded.featuredResult[i].type);
              }
            }
            this.featuredData = data._embedded;
          } else {
            this.featuredData['featuredResult'] = null;
          }
        },
        error => {
          this.featuredData = [];
          console.error("No featured results", error);
        }
      );
    } else {
      this.featuredData['featuredResult'] = null;
    }

    //make api call
    this.searchService.runSearch({
      keyword: this.keyword,
      index: this.index,
      pageNum: this.pageNum,
      organizationId: this.organizationId,
      isActive: this.isActive,
      wdType : this.wdTypeModel,
      conType : this.wdConstructModel,
      state: this.wdStateModel,
      county: this.wdCountyModel,
      service: this.wdNonStandardSelectModel,
      isEven: this.wdNonStandardRadModel
    }).subscribe(
      data => {
        if(data._embedded && data._embedded.results){
          for(var i=0; i<data._embedded.results.length; i++) {
            //Modifying FAL data
            if(data._embedded.results[i].fhNames){
              if(!(data._embedded.results[i].fhNames instanceof Array)){
                data._embedded.results[i].fhNames = [data._embedded.results[i].fhNames];
              }
            }
            //Modifying FH data
            if(data._embedded.results[i].parentOrganizationHierarchy) {
              if(data._embedded.results[i].parentOrganizationHierarchy.name.indexOf(".")>-1) {
                data._embedded.results[i].parentOrganizationHierarchy.name = data._embedded.results[i].parentOrganizationHierarchy.name.substring(0, data._embedded.results[i].parentOrganizationHierarchy.name.indexOf("."))
              }
              data._embedded.results[i].parentOrganizationHierarchy.name = new CapitalizePipe().transform(data._embedded.results[i].parentOrganizationHierarchy.name.replace(/[_-]/g, " "));
            }
            if(data._embedded.results[i]._type=="federalOrganization" && data._embedded.results[i].type) {
              data._embedded.results[i].type = new CapitalizePipe().transform(data._embedded.results[i].type);
            }
          }
          this.data = data._embedded;
          this.totalCount = data.page['totalElements'];
          var maxAllowedPages = data.page['maxAllowedRecords']/this.showPerPage;
          this.totalPages = data.page['totalPages']>maxAllowedPages?maxAllowedPages:data.page['totalPages'];
        } else{
          this.data['results'] = null;
        }

        this.oldKeyword = this.keyword;
        this.initLoad = false;
      },
      error => {
        console.error("Error!!", error);
      }
    );
    //construct qParams to pass parameters to object view pages
    this.qParams = this.setupQS(false);
  }

  // get dictionary data from dictionary API for samselects and map the response array to properly set config options
  getDictionaryData(id){
    this.wageDeterminationService.getWageDeterminationFilterData({
     ids: id
    }).subscribe(
        data => {

          let defaultSelection = {value:'', label: 'Default option', name: 'empty', disabled: false};

          // formatting the array data according to api type to match what UI elements expect
          // state data
          if(id === 'wdStates'){
            var reformattedArray = data._embedded.dictionaries[0].elements.map(function(stateItem){
              let newObj = {label:'', value:''};

              newObj.label = stateItem.value;
              newObj.value = stateItem.elementId;
              return newObj;
            });
            // adding the default selection row to the array
            reformattedArray.unshift(defaultSelection);
            this.selectStateConfig.options = reformattedArray;
          }

          // construction type data
          else if(id === 'dbraConstructionTypes'){
            var reformattedArray = data._embedded.dictionaries[0].elements.map(function(constructionItem){
              let newObj = {label:'', value:''};

              newObj.label = constructionItem.value;
              newObj.value = constructionItem.value;
              return newObj;
            });
            // adding the default selection row to the array
            reformattedArray.unshift(defaultSelection);
            this.selectConstructConfig.options = reformattedArray;
          }

          // scaServices type data
          else if(id === 'scaServices'){
            var reformattedArray = data._embedded.dictionaries[0].elements.map(function(serviceItem){
              let newObj = {label:'', value:''};

              newObj.label = serviceItem.value;
              newObj.value = serviceItem.elementId;
              return newObj;
            });
            // adding the default selection row to the array
            reformattedArray.unshift(defaultSelection);
            this.wdNonStandardSelectConfig.options = reformattedArray;
          }

        },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  // gets county data back depending on state provided
  getCountyByState(state){


    this.wageDeterminationService.getWageDeterminationFilterCountyData({
      state: state
    }).subscribe(
      data => {
        // county data
        let defaultSelection = {value:'', label: 'Default option', name: 'empty', disabled: false};

        var reformattedArray = data._embedded.dictionaries[0].elements.map(function(countyItem){
          let newObj = {label:'', value:''};
          newObj.label = countyItem.value;
          newObj.value = countyItem.elementId;
          return newObj;
        });

        reformattedArray.sort(function (a, b){
          var nameA = a.label.toUpperCase(); // ignore upper and lowercase
          var nameB = b.label.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        // adding the default selection row to the array
        reformattedArray.unshift(defaultSelection);
        this.selectCountyConfig.options = reformattedArray;
      },
      error => {
        console.error("Error!!", error);
      }

    );
  }

  pageChange(pagenumber){
    this.pageNum = pagenumber;
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };

    document.getElementById('search-results').getElementsByTagName('div')[0].focus();
    this.router.navigate(['/search'],navigationExtras);
  }

  // FILTER SELECTION CHANGE FUNCTIONS

  activeFilter(event) {
    this.isActive = !this.isActive;
    this.pageNum = 0;
    this.searchResultsRefresh()
  }

  // event for wdFilter Change
  wdFilterChange(event){

    // set the models equal to empty if the opposite wd type is selected
    if(this.wdTypeModel === 'sca'){
      this.wdConstructModel = '';
    }
    else{
      this.wdNonStandardRadModel = '';
      this.wdNonStandardSelectModel = '';
      this.wdPreviouslyPerformedModel = '';
      this.wdSubjectToCBAModel = '';
    }
    this.pageNum = 0;
    this.getDictionaryData('dbraConstructionTypes');

    this.searchResultsRefresh()
  }

  // event for construction type change
  constructionTypeChange(event){
    this.pageNum = 0;

    if(this.wdConstructModel){
      this.alertFooterService.registerFooterAlert({
        title: "Search Criteria Complete",
        description: "",
        type: "success",
        timer: 5000
      });
    }


    this.searchResultsRefresh()
  }

  // event for state change
  stateChange(event){

    // reset county model on state change
    this.wdCountyModel = '';
    this.pageNum = 0;

    // enable county select if needed
    this.determineEnableCountySelect();

    // call method to get county data per state
    this.getCountyByState(this.wdStateModel);

    this.searchResultsRefresh()
  }

  countyChange(event){
    this.pageNum = 0;

    this.searchResultsRefresh()
  }

  // determines if state is populated and if not disables county select
  determineEnableCountySelect(){
    if(this.wdStateModel !== ''){
      this.selectCountyConfig.disabled = false;
    }
    else{
      this.selectCountyConfig.disabled = true;
    }
  }

  // determines if state is populated and if not disables county select
  determineEnableServicesSelect(){
    if(this.wdNonStandardRadModel === 'yesNSS'){
      this.wdNonStandardSelectConfig.disabled = false;
    }
    else{
      this.wdNonStandardSelectConfig.disabled = true;
    }
  }

  // previously performed selection
  wdPreviouslyPerformedChanged(event){
    console.log('previously performed selection: ', this.wdPreviouslyPerformedModel);

    // if previously performed is no, we must set subject to cba model to empty
    if(this.wdPreviouslyPerformedModel === 'prevPerfNo'){
      this.wdSubjectToCBAModel = '';
    }

    // only for updating the url here
    this.searchResultsRefresh();
  }

  // subject to change selection
  wdSubjectToCBAChanged(event){
    console.log('subject to CBA selection: ', this.wdSubjectToCBAModel);

    // if the subject to change selection is based or unbased yes show modal success message
    if(this.wdSubjectToCBAModel === 'yesBasedCBA' || this.wdSubjectToCBAModel === 'yesUnbasedCBA'){
      this.alertFooterService.registerFooterAlert({
        title: "Search Criteria Complete",
        description: "",
        type: "success",
        timer: 3000
      });
    }

    // only for updating the url here
    this.searchResultsRefresh();
  }

  // non standard services radio button selection
  wdNonStandardRadChanged(event){
    console.log('non-standard rad selection: ', this.wdNonStandardRadModel);

    // check if services should be disabled/enabled
    this.determineEnableServicesSelect();

    // if the non standard rad selection does not equal yes, services filter must be removed
    if(this.wdNonStandardRadModel !== 'yesNSS'){
      this.wdNonStandardSelectModel = '';
    }

    this.pageNum = 0;
    this.searchResultsRefresh();

  }

  // non standard services drop down selection
  wdNonStandardSelectChanged(event){
    console.log('non-standard drop-down selection: ', this.wdNonStandardSelectModel);

    this.pageNum = 0;
    this.searchResultsRefresh();
  }


  // this calls function to set up ES query params again and re-call the search endpoint with updated params
  searchResultsRefresh(){
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }


  wdConstructionClear(){
    this.wdConstructModel = '';
    this.pageNum = 0;

    this.searchResultsRefresh()
  }

  wdPreviouslyPerformedClear(){
    this.wdPreviouslyPerformedModel = '';
    this.pageNum = 0;

    // cba should also be cleared if prev performed is cleared
    this.wdSubjectToCBAClear();

    this.searchResultsRefresh()
  }

  wdSubjectToCBAClear(){
    this.wdSubjectToCBAModel = '';
    this.pageNum = 0;

    // non standard services should also be cleared if cba is
    this.wdNonStandardServicesSelectClear();

    this.searchResultsRefresh()
  }

  wdNonStandardServicesSelectClear(){
    this.wdNonStandardSelectModel = '';
    this.wdNonStandardRadModel = '';
    this.pageNum = 0;

    this.searchResultsRefresh()
  }
}
