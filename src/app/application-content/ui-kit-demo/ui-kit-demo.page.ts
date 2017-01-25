import { Component,ViewChild } from '@angular/core';
import { AlertFooterService } from '../../alerts/alert-footer';

@Component({
  templateUrl: 'ui-kit-demo.template.html'
})
export class UIKitDemoPage {

  time: string = "13:01";
  date: string = "2016-12-12";
  dateTime: string = "2016-12-12T13:01";

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
  phoneModel2 = "1+(123)456-3366";

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
      url:"http://www.Benefits.gov"
    },
    {
      title:"Grants.gov Learning Center",
      detail:"Details for Grants.gov Learning Center: Lipsum content",
      link:"View Grants.gov",
      url:"http://www.grants.gov/web/grants/learn-grants.html"
    },
    {
      title:"Data Element Repository",
      detail:"Details for Data Element Repository: Lipsum content",
      link:"View DER",
      url:"fakeUrl"
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

  constructor(private alertFooterService: AlertFooterService) {  }

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
}
