import { Component,OnInit } from '@angular/core';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { SearchService } from 'api-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import { SearchDictionaryService } from "../../api-kit/search/dictionary.service";

@Component({
  moduleId: __filename,
  selector: 'search',
  providers: [CapitalizePipe, SearchDictionaryService],
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
  stateData = [];

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
  selectStateModel = '';
  selectStateConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select State',
    name: 'state',
  };

  // Select County Component
  selectCountyModel = '';
  selectCountyConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select County',
    name: 'county',
  };

  // Select Construct Type Component
  selectConstructModel = '';
  selectConstructConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
      {label: 'Heavy',value: 'Heavy'},
      {label: 'Residential',value: 'Residential'},
      {label: 'Building',value: 'Building'},
      {label: 'Highway',value: 'Highway'},
    ],
    disabled: false,
    label: 'Select Construction Type',
    name: 'constructionType',
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private searchService: SearchService, private dictionaryService: SearchDictionaryService) { }
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
        this.runSearch();
        this.getDictionaryData('dbraStates');
        //this.getDictionaryData('dbraCounties');
        //this.getDictionaryData('dbraConstructionTypes');
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
    if(this.selectConstructModel.length>0){
      qsobj['conType'] = this.selectConstructModel
    }

    if(this.selectStateModel.length>0){
      console.log('this is inside setupQS func ' + this.selectStateModel);
      qsobj['state'] = this.selectStateModel
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
      conType : this.selectConstructModel,
      state: this.selectStateModel,
      county: this.selectCountyModel
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
    let tempLabel: '';
    let tempValue: '';
    let newObj: {Label:'', Value:''};
    this.dictionaryService.getDictionaryDataById({
        ids: id
      }).subscribe(
        data => {
          console.log('here is our data ' + data);

          // if returned data is states rearrange the data so it can be correctly assigned as samselect options
          if(id === 'scaStates' || id === 'dbraStates'){
            var reformattedArray = data.map(function(x){
              tempLabel = x.value;
              tempValue = x.key;
              newObj.Label = tempLabel;
              newObj.Value = tempValue;
              return newObj;
            });
            this.stateData = reformattedArray;
          }
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
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }

  countyChange(event){
    console.log('county event here!!');
    console.log(this.selectCountyModel);
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/search'], navigationExtras);
  }



}
