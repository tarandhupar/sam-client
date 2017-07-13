import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RAOFormService} from "./regional-assistance-form.service";
import {RAOFormViewModel} from "./regional-assistance-form.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertFooterService} from "../../../alerts/alert-footer/alert-footer.service";
import {AuthGuard} from "../../authguard/authguard.component";

@Component({
  moduleId: __filename,
  templateUrl: 'regional-assistance-form.template.html',
  providers: [RAOFormService]
})
export class FALRegionalAssistanceFormComponent implements OnInit {

  @Output()
  messageEmitter = new EventEmitter();

  @ViewChild("modal2") modal2;
  RaoFormViewModel: RAOFormViewModel;
  sections: string[] = ["header-information", "overview", "authorization", "financial-information-obligations", "financial-information-other", "criteria-information", "applying-for-assistance", "compliance-requirements", "contact-information"];
  currentSection: number;
  isEditForm: boolean;
  raoFormGroup: FormGroup;
  cookieValue: string;

  // submission alert obj
  submitFooterAlertModel = {
    title: "Success",
    description: "Submission Successful.",
    type: "success",
    timer: 3000
  };

  submitFooterErrorModel = {
    title: "Error",
    description: "There was an Error.",
    type: "error",
    timer: 3000
  };

  // deletion alert obj
  deleteFooterAlertModel = {
    title: "Success",
    description: "Successfully Deleted.",
    type: "success",
    timer: 3000
  };

  mockDropdown: any = {
    config: {
      "name": "mock",
      "disabled": false,
      options: [
        {label: "Choose An Option", value:"Choose An Option", name:"Choose An Option", disabled:"false"},
        {label: "Option1", value:"100004222"},
        {label: "Option2", value:"100004222"}
      ]
    },
    defaultOption: "Choose An Option"

  };

  stateDrpDwnOptions = [{label: "None Selected", value: 'na'}];
  countryDrpDwnOptions = [{label: "None Selected", value: 'na'}];
  divisionDrpDwnOptions = [{label: "None Selected", value: 'na'}];


  constructor(private service: RAOFormService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private alertFooterService: AlertFooterService, private authGuard: AuthGuard) {
  }

  ngOnInit(): void {

    // TODO: make api call, or determine if department is 1 value or multiple values in form

    this.raoFormGroup = this.fb.group({
      organizationId:[''],
      region:[''],
      pointOfContact:[''],
      streetAddress:['', [Validators.required]],
      city:['', [Validators.required]],
      state:['', [Validators.required]],
      zip:['', [Validators.required]],
      country:[''],
      phone:['', [Validators.required]],
      subBranch:[''],
      division:['']
    });


    // subscribe to form change and update viewModel when changed
    this.raoFormGroup.valueChanges.subscribe( data => {
      // call viewModelUpdater
      this.viewModelUpdater(data);
    })


    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {rao: {data}}) => {
        this.isEditForm = true;
        this.RaoFormViewModel = new RAOFormViewModel(resolver.rao);
        this.RaoFormViewModel.officeId = this.route.snapshot.params['id'];
      });
    } else {
      this.isEditForm = false;
      this.RaoFormViewModel = new RAOFormViewModel(null);
    }

    this.raoFormGroup.setValue({
        organizationId: this.RaoFormViewModel.organizationId ,
        region: this.RaoFormViewModel.region,
        pointOfContact: this.RaoFormViewModel.pointOfContact,
        streetAddress: this.RaoFormViewModel.streetAddress,
        city: this.RaoFormViewModel.city,
        state: this.RaoFormViewModel.state,
        zip: this.RaoFormViewModel.zip,
        country: this.RaoFormViewModel.country,
        phone: this.RaoFormViewModel.phone,
        subBranch: this.RaoFormViewModel.subBranch,
        division: this.RaoFormViewModel.division
    });

    this.service.getRAOPermission('CREATE_RAO').subscribe(res => {
      this.authGuard.checkPermissions('addoreditrao', res);
    })

    this.getDropDownData();


  }

  viewModelUpdater(data: any){
    this.RaoFormViewModel.city = data.city;
    this.RaoFormViewModel.country = data.country;
    this.RaoFormViewModel.organizationId = data.organizationId;
    this.RaoFormViewModel.division = data.division;
    this.RaoFormViewModel.phone = data.phone;
    this.RaoFormViewModel.pointOfContact = data.pointOfContact;
    this.RaoFormViewModel.region = data.region;
    this.RaoFormViewModel.state = data.state;
    this.RaoFormViewModel.streetAddress = data.streetAddress;
    this.RaoFormViewModel.subBranch = data.subBranch;
    this.RaoFormViewModel.zip = data.zip;
  }


  getDropDownData(){
    this.service.getRAODict().subscribe(data => {
      for (let state of data['states']) {
        this.stateDrpDwnOptions.push({label: state.value, value: state.code});
      }

      for (let country of data['countries']) {
        this.countryDrpDwnOptions.push({label: country.value, value: country.code});
      }

      for (let division of data['regional_office_division']) {
        this.divisionDrpDwnOptions.push({label: division.value, value: division.element_id});
      }
    });
  }

  public onOrganizationChange(org: any) {

    let orgVal;
    if (org) {
      orgVal = org.value;
    }
    else
      orgVal = null;

    this.raoFormGroup.patchValue({
      organizationId: this.RaoFormViewModel.organizationId = orgVal.toString()
    });
  }

  onCancelClick() {
       this.cancel();
  }

  cancel() {
    let url = 'fal/myRegionalOffices';
    this.router.navigateByUrl(url);
  }

  onSubmit() {
    this.service.submitRAO(this.RaoFormViewModel.officeId, this.RaoFormViewModel.rao)
      .subscribe(api => {
          this.RaoFormViewModel.officeId = api._body;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.submitFooterAlertModel)));
          let url = 'fal/myRegionalOffices';
          this.router.navigate([url]);
        },
        error => {
          console.error('error saving assistance listing to api', error);
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.submitFooterErrorModel)));
        });
  }git

  onModalClose(event) {

  }

  deleteRAO(event){
    // call the service and pass the id from data
    this.service.deleteRAO(this.route.snapshot.params['id']).subscribe(
      data =>{
        this.modal2.closeModal();
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.deleteFooterAlertModel)));
        let url = 'fal/myRegionalOffices';
        this.router.navigate([url]);
      },
      error => {
        console.error('error occurred while deleting');
      }
    )
  }

}
