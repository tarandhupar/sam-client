import { Component, ViewChild, ElementRef, Directive } from '@angular/core';
import { AlertFooterService } from '../../app-components/alert-footer';

import { FormControl,FormBuilder,FormGroup } from '@angular/forms';

import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { AutocompleteDropdownButton } from 'sam-ui-elements/src/ui-kit/types';

import { LocationService } from 'api-kit/location/location.service';

import { CommentsDemoService, CommentsService } from './comments-demo.service';

import { Observable } from 'rxjs';

export class ACTestService implements AutocompleteService {
  private values: any = [
    { key: 'Random', value: 'Random'},
    { key: 'Just some data', value: 'Just some data'},
    { key: 'This has no category', value: 'This has no category'},
    { key: 'I have no parent', value: 'I have no parent'},
    { key: 'Christy', value: 'Christy'},
    { key: 'Carlos', value: 'Carlos'},
    { key: 'Colin', value: 'Colin'},
    { key: 'Diego', value: 'Diego'},
    { key: 'Delaware', value: 'Delaware'},
    { key: 'Maryland', value: 'Maryland'},
    { key: 'Virginia', value: 'Virginia'},
    { key: 'Washington, DC', value: 'Washington, DC'},
    { key: 'Onitama', value: 'Onitama'},
    { key: 'Power Grid', value: 'Power Grid' },
    { key: 'Splendor', value: 'Splendor'},
    { key: 'Ticket To Ride', value: 'Ticket to Ride'}
  ];
  
  private offset: number = 1;
  private limit: number = 0;

  private start: number = 0;
  private end: number = 2;
  private lastSearch: string;

  setFetchMethod(_: any) {}

  filter (val) {
    return this.values.filter(
      (value) => {
        if (value.key.toLowerCase().includes(val.toLowerCase())
          || value.value.toLowerCase().includes(val.toLowerCase())) {
          return value;
        }
      }
    );
  }

  resetPagination() {
    this.start = 0;
    this.end = 2;
  }

  fetch(val: string, pageEnd: boolean, serviceOptions: any) {

    if (val !== this.lastSearch) {
      this.resetPagination();
    }


    if (pageEnd && val === this.lastSearch) {
      this.start = this.end;
      this.end = this.end + 2;
      if (this.end > this.values.length) return Observable.of([]);
    };

    this.lastSearch = val;

    return Observable.of(this.filter(val).slice(this.start, this.end));
  }
}

@Directive({
  selector: 'sam-autocomplete-multiselect[test], sam-autcomplete-refactor[test]',
  providers: [
    { provide: AutocompleteService, useClass: ACTestService }
  ]
})
export class TestACDirective {}

@Component({
  templateUrl: 'ui-kit-demo.template.html',
  providers: [
    { provide: CommentsService, useClass: CommentsDemoService }
  ]
})
export class UIKitDemoPage {
  locationObj = {};
  tableFormArray = this.fb.array([this.fb.group({
    col1:"TestVal1",
    col2:"TestVal2",
    col3:"TestVal3",
    subRow: this.fb.array([this.fb.group({
      subcol1: "SubTestVal1",
      subcol2: "SubTestVal2",
      subcol3: "SubTestVal3",
    })])
  }),this.fb.group({
    col1:"TestValA",
    col2:"TestValB",
    col3:"TestValC",
    subRow: this.fb.array([this.fb.group({
      subcol1: "SubTestValA",
      subcol2: "SubTestValB",
      subcol3: "SubTestValC",
    }), this.fb.group({
      subcol1: "SubTestValD",
      subcol2: "SubTestValE",
      subcol3: "SubTestValF",
    })])
  })]);
  tableFormItemTemplate = this.fb.group({
    col1:"",
    col2:"",
    col3:"",
    subRow: this.fb.array([])
  });
  tableSubFormItemTemplate = this.fb.group({
    subcol1: "",
    subcol2: "",
    subcol3: "",
  });

  @ViewChild('image') image: ElementRef;
  @ViewChild('dropper') dropzone: ElementRef;

  /** New Location Group Component Vars ***************************************/
  locationConfig = {
    state: {},
    county: {},
    country: {},
    zip: {}
  }

  locationFormGroup = new FormGroup({
    city: new FormControl(),
    country: new FormControl(),
    county: new FormControl(),
    state: new FormControl(),
    zip: new FormControl(),
  })
  /** End Location Group Vars *************************************************/

  readURL(event) {
    const image = this.image;
    if (event.target.files && event.target.files[0]) {
      this.readFile(event.target.files, image);
    }
  }

  readFile(files: any[], targetImage: ElementRef) {
    const reader = new FileReader();

    reader.onload = function(e: any) {
      targetImage.nativeElement.src = e.target.result;
      targetImage.nativeElement.style.width = '160px';
      targetImage.nativeElement.style.height = '160px';
    };

    reader.readAsDataURL(files[0]);
  }

  dragenter(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dragover(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  drop(event) {
    event.stopPropagation();
    event.preventDefault();
    const dt = event.dataTransfer;
    this.readFile(dt.files, this.image);
  }
  fileChangeHandler(event)  {
    console.log(event);
  }

  sortModel = {type:"name",sort:"asc"};

  agv2_selections1;
  agv2_selections2;

  entitypicker_selections;
  entitypicker_selection_single;

  samDateRangeAdvModel;
  samDateRangeAdvModel2;

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
      keyProperty: 'mail',
      valueProperty: 'givenName',
      subheadProperty: 'mail'
    }
  };

  /** Actions Component */

  callback = () => {
    console.log("I succeeded");
  }

  actions: Array<any> = [
    { name: 'edit', label: 'Edit', icon: 'fa fa-pencil', callback: this.callback},
    { name: 'delete', label: 'Delete', icon: 'fa fa-trash', callback: this.callback },
    { name: 'save', label: 'Save', icon: 'fa fa-floppy-o', callback: this.callback }
  ];

  action = this.actions[0];

  handleAction(event) {
    if (event === 'edit') {
      console.log("I'm handling the edit event");
    } else if (event === 'delete') {
      console.log("I'm handling the delete event");
    } else if (event === 'save') {
      console.log("I'm handling the save event");
    }
  }

  handleActionButton(event) {
    console.log('Emitted: ' + event);
  }



  /** End Actions Component */

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
   ];

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
        "downloadUrl": "",
        "typeInfo": {
          "name": "PDF document",
          "iconClass": "fa fa-file-pdf-o"
        }
      }
    ],
    "accordionState": "collapsed",
    "downloadUrl": ""
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


  constructor(private alertFooterService: AlertFooterService, private locationService: LocationService,
    private fb: FormBuilder) {  }

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

  /**
   * Sam Autocomplete Refactor
   */
  accb(input: string): Observable<any[]> {
    return Observable.of(['Colin', 'Carlos', 'Diego']);
  }

  private howdy;
  private howdydo;
  private howdydody;

  private selectedPSC1;
  private selectedPSC2;

  private multiSelectedPSC1;
  private multiSelectedPSC2;

  private selectedNAICS1;
  private selectedNAICS2;

  private multiSelectedNAICS1;
  private multiSelectedNAICS2;
}
