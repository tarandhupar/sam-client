import { Component, ViewChild } from '@angular/core';
import { AlertFooterService } from '../../alerts/alert-footer';
import { FormControl } from '@angular/forms';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { AutocompleteDropdownService } from 'sam-ui-kit/form-controls/autocomplete-dropdown/autocomplete-dropdown.service';
import { AutocompleteDropdownButton } from 'sam-ui-kit/types';

import { LocationService } from 'api-kit/location/location.service';

import { Observable } from 'rxjs';

@Component({
  templateUrl: 'ui-kit-demo.template.html',
  providers: [
    {provide: AutocompleteService, useClass: AutocompleteDropdownService}
  ]
})
export class UIKitDemoPage {

  peoplePickerOptions = [{key:'uncategorized1', value: 'Uncategorized Data'},
    {key: 'uncategorized2', value: 'More Uncategorized Data'},
    {key: 'Carlos', value: 'Carlos', category: 'people'},
    {key: 'Christy', value: 'Christy', category: 'people'},
    {key: 'Colin', value: 'Colin', category: 'people'},
    {key: 'Diego', value: 'Diego', category: 'people'},
    {key: 'Maryland', value: 'Maryland', category: 'states'},
    {key: 'Virginia', value: 'Virginia', category: 'states'},
    {key: 'Washington DC', value: 'Washington DC', category: 'states'}];
 
  autocompletePeoplePickerConfig = {
    keyValueConfig: {
      keyProperty: 'email',
      valueProperty: 'givenName',
      subheadProperty: 'email'
    }
  };

  editorExampleText1 = "test value 1";
  editorExampleText2 = "test value 2";
  editorExampleText3 = "test value 3";
  editorExampleDraftText1 = this.editorExampleText1;
  editorExampleDraftText2 = this.editorExampleText2;
  editorExampleDraftText3 = this.editorExampleText3;

  editorActionHandler(evt){
    if(evt.event == "formActionCancel"){
      console.log("cancel action trigged");
      this.editorExampleDraftText1 = this.editorExampleText1;
      this.editorExampleDraftText2 = this.editorExampleText2;
      this.editorExampleDraftText3 = this.editorExampleText3;
    } 
    if(evt.event == "formActionSave"){
      console.log("save action triggered");
      this.editorExampleText1 = this.editorExampleDraftText1;
      this.editorExampleText2 = this.editorExampleDraftText2;
      this.editorExampleText3 = this.editorExampleDraftText3;
    }
  }

  /**
   * Multiselect Demo
   */
   multiselectOptions: any = [
     { key: 'Random', value: 'Random'},
     { key: 'Just some data', value: 'Just some data'},
     { key: 'This has no category', value: 'This has no category'},
     { key: 'I have no parent', value: 'I have no parent'},
     { key: 'Christy', value: 'Christy', category: 'Team Members' },
     { key: 'Carlos', value: 'Carlos', category: 'Team Members' },
     { key: 'Colin', value: 'Colin', category: 'Team Members' },
     { key: 'Diego', value: 'Diego', category: 'Team Members' },
     { key: 'Delaware', value: 'Delaware', category: 'Mid-Atlantic States'},
     { key: 'Maryland', value: 'Maryland', category: 'Mid-Atlantic States'},
     { key: 'Virginia', value: 'Virginia', category: 'Mid-Atlantic States'},
     { key: 'Washington, DC', value: 'Washington, DC', category: 'Mid-Atlantic States'},
     { key: 'Onitama', value: 'Onitama', category: 'Board Games'},
     { key: 'Power Grid', value: 'Power Grid', category: 'Board Games' },
     { key: 'Splendor', value: 'Splendor', category: 'Board Games'},
     { key: 'Ticket To Ride', value: 'Ticket to Ride', category: 'Board Games'}
   ]

   multiselectConfigSelectable = {
     keyProperty: 'key',
     valueProperty: 'value',
     categoryProperty: 'category',
     parentCategoryProperty: 'category'
   }

  multiselectConfig = {
     keyProperty: 'key',
     valueProperty: 'value',
     categoryProperty: 'category',
   }
  /**
   * Autocomplete Category demo
   */
  autocompleteCategoryOptions = [
    {key:'uncategorized1', value: 'Uncategorized Data'},
    {key: 'uncategorized2', value: 'More Uncategorized Data'},
    {key: 'Carlos', value: 'Carlos', category: 'people'},
    {key: 'Christy', value: 'Christy', category: 'people'},
    {key: 'Colin', value: 'Colin', category: 'people'},
    {key: 'Diego', value: 'Diego', category: 'people'},
    {key: 'Maryland', value: 'Maryland', category: 'states'},
    {key: 'Virginia', value: 'Virginia', category: 'states'},
    {key: 'Washington DC', value: 'Washington DC', category: 'states'}
  ];

  autocompleteCategoryObjects = [
    {
      key: 'id',
      value: 'Board Games',
      category: 'Board Games'
    },
    {
      key: 'id',
      value: 'Mid-Atlantic States',
      category: 'Mid-Atlantic States'
    },
    {
      key: 'id',
      value: 'Team Members',
      category: 'Team Members'
    }
  ];

  modellz1 = [
    {key: 'Diego', value: 'Diego', category: 'people'},
    {key: 'Maryland', value: 'Maryland', category: 'states'},
  ];
  modellz2 = [
    { key: 'Washington, DC', value: 'Washington, DC', category: 'Mid-Atlantic States'},
    { key: 'Onitama', value: 'Onitama', category: 'Board Games'}
  ];

  checkFullParentOrgs(evt){
    console.log(".....",evt);
  }
  autocompleteConfig = {
    categoryProperty: 'category',
    // isCategorySelectable: true,
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  categories = [
    {key: 'people', value: 'People'},
    {key: 'states', value: 'States'}
  ];

  /**
   * Packages demo
   */
  packages = [{
    "packageId": "5510527885db16f1d7ae72ecfa8e6567",
    "name": "Industry Day IV Change of Location",
    "type": "Other (Draft RFPs/RFIs, Responses to Questions, etc..)",
    "postedDate": "Apr 07, 2015",
    "access": "Public",
    "attachments": [
      {
        "attachmentId": "38112bb086ee9b88163c734c16b88307",
        "resourceId": "862178b04be2db1778a697464f186836"
      }
    ],
    "resources": [
      {
        "resourceId": "862178b04be2db1778a697464f186836",
        "name": "J.pdf",
        "type": "file",
        "uri": "J.pdf",
        "description": "Industry Day IV change of conference room.",
        "mimeType": "application/pdf",
        "size": "83 kB",
        "downloadUrl": "https://csp-api.sam.gov/comp/opps/v1/opportunities/resources/files/862178b04be2db1778a697464f186836?api_key=Z5vc0lK9ubZdK6fLKDCdeYODaSVFtGElOUVSzIl0",
        "typeInfo": {
          "name": "PDF document",
          "iconClass": "fa fa-file-pdf-o"
        }
      }
    ],
    "accordionState": "collapsed",
    "downloadUrl": "https://csp-api.sam.gov/comp/opps/v1/opportunities/resources/packages/5510527885db16f1d7ae72ecfa8e6567/download/zip?api_key=Z5vc0lK9ubZdK6fLKDCdeYODaSVFtGElOUVSzIl0"
  }];

  // Autocomplete Dropdown No Button
  searchValue: any;
  searchName: string = "MyComponent65491455"
  dropdownSearch: any = [{value: 'Opportunities', label: 'Opportunities', name: 'Opportunities'}, {value: 'Entities', label: 'Entities', name: 'Entities'}, {value: 'Other', label: 'Other', name: 'Other'}];

  // Autocomplete Dropdown With Button
  searchValue1: any;
  searchName1: string = "MyComponent65491455"
  dropdownSearch1: any = [{value: 'Opportunities', label: 'Opportunities', name: 'Opportunities'}, {value: 'Entities', label: 'Entities', name: 'Entities'}, {value: 'Other', label: 'Other', name: 'Other'}];
  getButton(event) {
    window.alert('You clicked me!');
  }
  button: AutocompleteDropdownButton = {
    label: 'Search',
    class: '',
    icon: {
      class: 'fa fa-search',
      altText: 'Search'
    }
  }

  // Dropdown Multisleect
  mySpecialValue;

  testModel1 = [];

  getDropdownListItems(event) {
    this.mySpecialValue = event;
  }

  listOptions = [
    {
      label:'Unarchive',
      value: 1,
      name: 'apple'
    },
    {
      label:'Create',
      value: 2,
      name: 'orange'
    },
    {
      label:'Edit',
      value: 3,
      name: 'banana'
    },
    {
      label:'Submit',
      value: 4,
      name: 'grape'
    },
    {
      label:'tomato',
      value: 5,
      name: 'tomato'
    }];
  listControl = new FormControl('listtest');
  time: string = '13:01';
  date: string = '2016-12-12';
  dateTime: string = '2016-12-12T13:01';

  // Select Component
  selectModel = '';
  selectConfig = {
    options: [
      {value: '', label: 'Default option', name: 'empty', disabled: true},
      {value: 'dc', label: 'Washington DC', name: 'dc'},
      {value: 'ma', label: 'Maryland', name: 'maryland'},
      {value: 'va', label: 'Virginia', name: 'virginia'},
    ],
    disabled: false,
    label: 'region',
    name: 'region',
  };

  // Checkboxes Component
  checkboxModel: any = ['ma'];
  checkboxConfig = {
    options: [
      {value: 'dc', label: 'DC', name: 'checkbox-dc'},
      {value: 'ma', label: 'Maryland', name: 'checkbox-maryland'},
      {value: 'va', label: 'Virginia', name: 'checkbox-virginia'},
    ],
    name: 'my-sr-name',
    label: 'Select a region',
  };

  textModel = 'Some Text';
  textConfig = {
    label: "Enter zipcode",
    hint: "Zipcode can be short or long version",
    errorMessage: 'Uh-oh, something went wrong',
    name: 'aria-friendly-name',
    disabled: false,
  };

  textareaModel= 'Some Text';
  textareaConfig = {
    label: "Enter zipcode",
    hint: "Zipcode can be short or long version",
    errorMessage: 'Uh-oh, something went wrong',
    name: 'aria-friendly-name',
    disabled: false,
  };

  // Radio Component
  radioModel: any = 'ma';
  radioConfig = {
    options: [
      {value: 'dc', label: 'DC', name: 'radio-dc'},
      {value: 'ma', label: 'Maryland', name: 'radio-maryland'},
      {value: 'va', label: 'Virginia', name: 'radio-virginia'},
    ],
    name: 'radio-component',
    label: 'Select a region',
    errorMessage: '',
    hint: ''
  };

  // Accordions Component
  accordionsData =
    [
      {title:"Test1", content:"This is Test1"},
      {title:"Test2", content:"This is Test2"},
      {title:"Test3", content:"This is Test3"}
    ]

  // Button Component
  btnType: string = "default";

  // SamAlert Component for Alert Manager
  showDescription: boolean = false;
  dismissAlerts: boolean = false;

  paginationConfig = {
    currentPage: 1,
    totalPages: 1
  };

  pointOfContact = {
    fullName:"John Doe",
    address: "1234 Waterway Rd",
    address2: "Unit D",
    city: "Norfolk",
    state: "VA",
    zip:"12345",
    email: "jdoe@test.gov",
    phone: "222-222-2222",
    phone2: "333-333-3333",
    fax: "444-444-4444",
    website: "www.testsite.gov"
  };

  nameModel = {
    title: "Mr.",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    suffix: "Sr."
  };
  phoneModel = "";
  phoneModel2 = "123-456-3366";
  phoneTemplate2 = "___-___-____";
  phoneModel3 = "5553339999";
  phoneTemplate3 = "1+(___)___-____";

  footerAlertTypes = ['success','warning','error','info'];
  footerAlertModel = {
    title: "test title",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    type: "error",
    timer: 0
  }

  dateModel: string = "2016-02-03";
  dateRangeModel = {
    startDate: "2016-02-03",
    endDate: "2017-04-23"
  };

  //Image Library
  imageLibraryData:any =  [
    {
      title:"Benefits.gov Learning Center",
      detail:"Benefits.gov Learning Center: Lipsum content",
      link:"View Benefits.gov",
      url:"http://www.Benefits.gov",
      img:"src/assets/img/placeholder.jpg"
    },
    {
      title:"Grants.gov Learning Center",
      detail:"Details for Grants.gov Learning Center: Lipsum content",
      link:"View Grants.gov",
      url:"http://www.grants.gov/web/grants/learn-grants.html",
      img:"src/assets/img/placeholder.jpg"
    },
    {
      title:"Data Element Repository",
      detail:"Details for Data Element Repository: Lipsum content",
      link:"View DER",
      url:"fakeUrl",
      img:"src/assets/img/placeholder.jpg"
    }
  ];

  modalAlertTypes = ['success','warning','error','info'];
  @ViewChild('modal1') vcModal1;
  @ViewChild('modal2') vcModal2;
  modalConfig = {
    type:'success',
    title:'Sample Title',
    description:'lorem ipsum lorem ipsum lorem ipsum lorem ipsum.'
  }
  modalConfig2 = {
    type:'success',
    title:'Sample Title'
  }

  store = {
    menu: {
      open: false,
      items: [
        { text: 'Menu Item 1', routerLink: '/ui-kit' },
        { text: 'Menu Item 2', routerLink: '/ui-kit' }
      ]
    }
  };

  collapsibleLabel = 'Test Label';

  // Toggle switch component
  switch_status = "off";
  switchDisable = false;

  // Location Service Demo
  locationSelectModel = 'iso2';
  locationSelectConfig = {
    options: [
      {value: 'iso2', label: '2 digit code', name: '2 digit code'},
      {value: 'iso3', label: '3 digit code', name: '2 digit code'},
      {value: 'countryname', label: 'country name', name: 'country name'},
    ],
    disabled: false,
    label: '',
    name: 'location',
  };
  locationQueryStr = '';
  locationAllCountryJSON;
  locationSearchCountryJSON;

  locationResultModel = "";
  locationResultConfig = {
    options: [],
    disabled: false,
    label: 'All Countries Drop Down',
    name: 'countries',
  };

  locationDemoConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  }

  stateSelectModel = 'statecode';
  stateSelectConfig = {
    options: [
      {value: 'statecode', label: 'State Code', name: 'State Code'},
      {value: 'statename', label: 'State Name', name: 'State Name'},
      {value: 'statetype', label: 'State Type', name: 'State Type'},
    ],
    disabled: false,
    label: '',
    name: 'state',
  };
  stateQueryStr = '';
  countryQueryStr = '';
  locationAllStateJSON;
  locationSearchStateJSON;

  stateResultModel = "";
  stateResultConfig = {
    options: [],
    disabled: false,
    label: 'All States Drop Down',
    name: 'states',
  };

  countySelectModel = 'Y';
  countySelectConfig = {
    options: [
      {value: 'Y', label: 'Is WDOL', name: 'Is WDOL'},
      {value: 'N', label: 'Is Not WDOL', name: 'Is Not WDOL'},
    ],
    disabled: false,
    label: '',
    name: 'county',
  };
  countyQueryStr = '';
  statQueryStr = '';
  locationAllCountyJSON;
  locationSearchCountyJSON;

  countyResultModel = "";
  countyResultConfig = {
    options: [],
    disabled: false,
    label: 'All Counties Drop Down',
    name: 'counties',
  };


  constructor(private alertFooterService: AlertFooterService, private locationService: LocationService) {  }

  onEmptyOptionChanged($event) {
    if ($event.target.checked) {
      this.selectConfig.options.unshift({label: '', value: '', name: 'empty-option'});
    } else {
      this.selectConfig.options.shift();
    }
  }

  /**
   * Example to change button type when click
   */
  onDefaultBtnClick(){
    if(this.btnType === "default"){
      this.btnType = "alt";
    }else if(this.btnType === "alt"){
      this.btnType = "secondary";
    }else{
      this.btnType = "default";
    }
  }

  onExpandAlerts(){
    this.showDescription = !this.showDescription;
  }

  onDismissAlerts(){
    this.dismissAlerts = true;
  }
  phoneModelChange(phoneNum){
    this.phoneModel = phoneNum;
  }
  onFooterAlertBtnClick(){
    this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.footerAlertModel)));
  }
  onModalInitClick(){
    this.vcModal1.openModal();
  }
  onModalClose(){
    this.vcModal1.closeModal();
  }
  onModalInitClick2(){
    this.vcModal2.openModal();
  }

  OnSwitchChange(val){
    val? this.switch_status = "on": this.switch_status = "off";
  }
  disableSwitchClick(){
    this.switchDisable = !this.switchDisable;
  }

  getAllCountriesJSON(){
    this.locationService.getAllContries().subscribe(
      res => {
          this.locationAllCountryJSON = res._embedded.countryList;
        this.locationResultConfig.options = [];
        if (this.locationAllCountryJSON.length > 0) this.locationResultModel = this.locationAllCountryJSON[0].country;
        this.locationAllCountryJSON.forEach(e => {
          this.locationResultConfig.options.push({value: e.country, label: e.country, name: e.country});
        });
      },
      error => {
        this.locationAllCountryJSON = error;
      }
    );
  }

  clearAllCountriesJSON(){
    this.locationAllCountryJSON = {};
    this.locationResultConfig.options = [];
    this.locationResultModel = ""
  }


  searchCountry(locationSelectModel,locationQueryStr){
    if(locationQueryStr.length !== 0){
      this.locationService.searchCountry(locationSelectModel, locationQueryStr).subscribe(
        res => {
          this.locationSearchCountryJSON = res;
        },
        error => {
          this.locationSearchCountryJSON = error;
        }
      );
    }

  }

  clearSearchCountryJSON(){
    this.locationSearchCountryJSON = {};
  }






  getAllStatesJSON(countryQueryStr){
    this.locationService.getAllStates(countryQueryStr).subscribe(
      res => {
          this.locationAllStateJSON = res._embedded.stateList;
        this.stateResultConfig.options = [];
        if (this.locationAllStateJSON.length > 0) this.stateResultModel = this.locationAllStateJSON[0].state;
        this.locationAllStateJSON.forEach(e => {
          this.stateResultConfig.options.push({value: e.state, label: e.state, name: e.state});
        });
      },
      error => {
        this.locationAllStateJSON = error;
      }
    );
  }

  clearAllStatesJSON(){
    this.locationAllStateJSON = {};
    this.stateResultConfig.options = [];
    this.stateResultModel = ""
  }


  searchState(stateSelectModel,stateQueryStr, countryQueryStr){
    if(stateQueryStr.length !== 0){
      this.locationService.searchState(stateSelectModel, stateQueryStr, countryQueryStr).subscribe(
        res => {
          this.locationSearchStateJSON = res;
        },
        error => {
          this.locationSearchStateJSON = error;
        }
      );
    }

  }

  clearSearchStateJSON(){
    this.locationSearchStateJSON = {};
  }






  getAllCountiesJSON(statQueryStr){
    this.locationService.getAllCounties(statQueryStr).subscribe(
      res => {
          this.locationAllCountyJSON = res._embedded.countyList;
        this.countyResultConfig.options = [];
        if (this.locationAllCountyJSON.length > 0) this.countyResultModel = this.locationAllCountyJSON[0].county;
        this.locationAllCountyJSON.forEach(e => {
          this.countyResultConfig.options.push({value: e.county, label: e.county, name: e.county});
        });
      },
      error => {
        this.locationAllCountyJSON = error;
      }
    );
  }

  clearAllCountiesJSON(){
    this.locationAllCountyJSON = {};
    this.countyResultConfig.options = [];
    this.countyResultModel = ""
  }


  searchCounty(countySelectModel,statQueryStr,countyQueryStr){
    if(statQueryStr.length !== 0){
      this.locationService.searchCounty(countySelectModel, statQueryStr, countyQueryStr).subscribe(
        res => {
          this.locationSearchCountyJSON = res;
        },
        error => {
          this.locationSearchCountyJSON = error;
        }
      );
    }

  }

  clearSearchCountyJSON(){
    this.locationSearchCountyJSON = {};
  }
}
