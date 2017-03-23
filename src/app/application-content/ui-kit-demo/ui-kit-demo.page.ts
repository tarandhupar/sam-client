import { Component, ViewChild } from '@angular/core';
import { AlertFooterService } from '../../alerts/alert-footer';
import { FormControl } from '@angular/forms';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { AutocompleteDropdownService } from 'sam-ui-kit/form-controls/autocomplete-dropdown/autocomplete-dropdown.service';
import { AutocompleteDropdownButton } from 'sam-ui-kit/types';

import { LocationService } from 'api-kit/location/location.service';


@Component({
  templateUrl: 'ui-kit-demo.template.html',
  providers: [
    {provide: AutocompleteService, useClass: AutocompleteDropdownService}
  ]
})
export class UIKitDemoPage {
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
    city: "Norfolk",
    state: "VA",
    zip:"12345",
    email: "jdoe@test.gov",
    phone: "222-222-2222",
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
        this.locationAllCountryJSON = res;
        this.locationResultConfig.options = [];
        if(res.length > 0) this.locationResultModel = res[0].country;
        res.forEach(e => {
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
}
