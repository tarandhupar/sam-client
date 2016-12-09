import { Component } from '@angular/core';

@Component({
  templateUrl: 'ui-kit-demo.template.html'
})
export class UIKitDemoPage {
  // Select Component
  selectModel = '';
  selectConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
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
  phoneModel2 = "1+(123)456-3366";


  constructor() {  }

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
}
