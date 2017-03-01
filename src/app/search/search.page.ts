import { Component,OnInit } from '@angular/core';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
//import { Operator } from 'rxjs';
import { SearchService } from 'api-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import 'rxjs/add/operator/map';
import {WageDeterminationService} from "../../api-kit/wage-determination/wage-determination.service";
import {data} from "../../ui-kit/sidenav/services/testdata";
import wrapDriver = protractor.wrapDriver;


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
  pageNumPaginationPadding = 2;
  showPerPage = 10;
  data = [];
  featuredData = [];
  oldKeyword: string = "";
  initLoad = true;
  showOptional:any = (SHOW_OPTIONAL=="true");
  qParams:any = {};
  isActive: boolean = true;

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
    name: 'radio-component',
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

  // Select Construct Type Component
  wdConstructModel = '';
  selectConstructConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select Construction Type',
    name: 'constructionType',
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private searchService: SearchService, private wageDeterminationService: WageDeterminationService) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.isActive = data['isActive'] && data['isActive'] === "false" ? false : this.isActive;
        this.checkboxModel = this.isActive === false ? [] : ['true'];
        this.wdTypeModel = data['wdType'] && data['wdType'] !== null ? data['wdType'] : this.wdTypeModel;
        this.wdStateModel = data['state'] && data['state'] !== null ? data['state'] : this.wdStateModel;
        this.wdCountyModel = data['county'] && data['county'] !== null ? data['county'] : this.wdCountyModel;
        this.wdConstructModel = data['conType'] && data['conType'] !== null ? data['conType'] : this.wdConstructModel;
        this.runSearch();
        this.getDictionaryData('wdStates');
        this.getDictionaryData('dbraConstructionTypes');
        this.getCountyByState(this.wdStateModel);
        this.determineEnableCountySelect();
      });
  }

  ngOnChange(changes) {
    this.runSearch();
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

    if(this.organizationId.length>0){
      qsobj['organizationId'] = this.organizationId;
    }
    if(this.wdTypeModel!=null) {
      qsobj['wdType'] = this.wdTypeModel;
    }
    if(this.wdConstructModel.length>0){
      qsobj['conType'] = this.wdConstructModel;
    }

    if(this.wdStateModel.length>0){
      qsobj['state'] = this.wdStateModel;
    }

    if(this.wdCountyModel.length>0){
      qsobj['county'] = this.wdCountyModel;
    }

    return qsobj;
  }
  runSearch(){
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
      county: this.wdCountyModel
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

  // get dictionary data from dictionary API for samselects
  getDictionaryData(id){
    this.wageDeterminationService.getWageDeterminationFilterData({
     ids: id
    }).subscribe(
        data => {

          let defaultSelection = {value:'', label: 'Default option', name: 'empty', disabled: true};

          // formatting the array data according to api type to match what UI elements expect
          // state data
          if(id === 'wdStates'){
            var reformattedArray = data._embedded.dictionaryList[0].elements.map(function(stateItem){
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
            var reformattedArray = data._embedded.dictionaryList[0].elements.map(function(constructionItem){
              let newObj = {label:'', value:''};

              newObj.label = constructionItem.value;
              newObj.value = constructionItem.value;
              return newObj;
            });
            // adding the default selection row to the array
            reformattedArray.unshift(defaultSelection);
            this.selectConstructConfig.options = reformattedArray;
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
        let defaultSelection = {value:'', label: 'Default option', name: 'empty', disabled: true};

        var reformattedArray = data._embedded.dictionaryList[0].elements.map(function(countyItem){
          let newObj = {label:'', value:''};
          newObj.label = countyItem.value;
          newObj.value = countyItem.value;
          return newObj;
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

  activeFilter(event) {
    this.isActive = !this.isActive;
    this.pageNum = 0;
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }

  // event for wdFilter Change
  wdFilterChange(event){
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }

  // event for construction type change
  constructionTypeChange(event){
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }

  // event for state change
  stateChange(event){

    // enable county select if needed
    this.determineEnableCountySelect();

    // call method to get county data per state
    this.getCountyByState(this.wdStateModel);

    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }

  countyChange(event){
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
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

}
