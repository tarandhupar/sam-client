import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RAOFormService} from "./regional-assistance-form.service";
import {RAOFormViewModel} from "./regional-assistance-form.model";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";
import {FALAuthGuard} from "../../components/authguard/authguard.service";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";

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
  hasPermissions: boolean;
  buttonDisabled: boolean = false;

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

  agencyPickerConfig = {
    id: 'rao-organization',
    label: 'Federal Agency',
    required: true,
    hint: null,
    type: 'single',
    orgRoots: [],
    levelLimit: 2,
    disabled: false,
    isReady: false
  };
  orgData:any;

  stateDrpDwnOptions = [{label: "None Selected", value: 'na'}];
  countryDrpDwnOptions = [{label: "None Selected", value: 'na'}];
  divisionDrpDwnOptions = [{label: "None Selected", value: 'na'}];

  crumbs: Array<IBreadcrumb> = [
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Regional Assistance Locations', url: '/fal/myRegionalAssistanceLocations'}
  ];

  public options = {
    badge: { attached: 'top right' },
  };

  constructor(
    private service: RAOFormService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertFooterService: AlertFooterService,
    private authGuard: FALAuthGuard) {
  }

  ngOnInit(): void {

    // TODO: make api call, or determine if department is 1 value or multiple values in form

    this.raoFormGroup = this.fb.group({
      organizationId: [''],
      region: [''],
      pointOfContact: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.maxLength(10)]],
      country: [''],
      phone: ['', [Validators.required]],
      subBranch: [''],
      division: ['']
    });

    // subscribe to form change and update viewModel when changed
    this.raoFormGroup.valueChanges.subscribe(data => {
      // call viewModelUpdater
      this.viewModelUpdater(data);
    })

    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {rao: {data}}) => {
        if (resolver.rao && resolver.rao['_links'] != null && resolver.rao['_links']['program:regional:offices:update'] != null) {
          this.isEditForm = true;
          this.RaoFormViewModel = new RAOFormViewModel(resolver.rao);
          this.RaoFormViewModel.officeId = this.route.snapshot.params['id'];
          this.raoFormGroup.setValue({
            organizationId: this.RaoFormViewModel.organizationId,
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
        } else {
          this.router.navigate(['403']);
        }
      });

      this.crumbs.push({ breadcrumb: 'Edit Regional Assistance Location' });
    } else {
      this.isEditForm = false;
      this.RaoFormViewModel = new RAOFormViewModel(null);
      this.crumbs.push({ breadcrumb: 'New Regional Assistance Location' });
    }

    this.hasPermissions = this.authGuard.checkPermissions('addoreditrao', null);
    this.getDropDownData();
    this.initFHDropdown();
    this.subscribeToChanges();
  }

  viewModelUpdater(data: any) {
    this.RaoFormViewModel.city = data.city;
    this.RaoFormViewModel.country = data.country;
    this.RaoFormViewModel.organizationId = (data.organizationId && typeof data.organizationId === 'object' && data.organizationId.orgKey != null) ? data.organizationId.orgKey : data.organizationId;
    this.RaoFormViewModel.division = data.division;
    this.RaoFormViewModel.phone = data.phone;
    this.RaoFormViewModel.pointOfContact = data.pointOfContact;
    this.RaoFormViewModel.region = data.region;
    this.RaoFormViewModel.state = data.state;
    this.RaoFormViewModel.streetAddress = data.streetAddress;
    this.RaoFormViewModel.subBranch = data.subBranch;
    this.RaoFormViewModel.zip = data.zip;
  }

  private initFHDropdown() {
    try {
      this.service.getPermissions().subscribe(api => {
        if (api != null && api.ORG_LEVELS != null) {
          if (api.ORG_LEVELS.org != 'all' && api.ORG_LEVELS.level == 'all') {
            this.agencyPickerConfig.orgRoots.push(api.ORG_LEVELS.org);
            this.agencyPickerConfig.isReady = true;
          } else if(api.ORG_LEVELS.org != 'all' && api.ORG_LEVELS.level == 'none') {
              this.agencyPickerConfig.disabled = true;
              this.agencyPickerConfig.isReady = true;

              this.service.getOrganization(api.ORG_LEVELS.org).subscribe(data => {
                if(data && data['_embedded'] && data['_embedded'][0] && data['_embedded'][0]['org']) {
                  this.orgData = data['_embedded'][0]['org'];
                  if (!this.isEditForm) {
                    this.raoFormGroup.get('organizationId').patchValue(this.orgData.orgKey, {
                      emitEvent: false
                    });
                  }
                }
              }, error => {
                console.error('error retrieving organization', error);
              });
          } else if(api.ORG_LEVELS.org == 'all' && api.ORG_LEVELS.level == 'all') {
            this.agencyPickerConfig.isReady = true;
          }
        }
      }, error => { //failed to get user associated organization. Redirect to signin
        this.router.navigate(['signin']);
      });
    }
    catch (exception) { //failed to get user associated organization. Redirect to signin
      this.router.navigate(['signin']);
    }
  }

  private subscribeToChanges(): void {
    this.linkControlTo(this.raoFormGroup.get('organizationId'), this.saveOrganization);
  }

  private linkControlTo(control: AbstractControl, callback: (value: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges.subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveOrganization(org) {
    if(typeof org === 'object' && org !== null) {
      this.RaoFormViewModel.organizationId = org.orgKey;
    } else {
      this.RaoFormViewModel.organizationId = org;
    }
  }

  getDropDownData() {
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

  onCancelClick() {
    this.cancel();
  }

  cancel() {
    let url = 'fal/myRegionalAssistanceLocations';
    this.router.navigateByUrl(url);
  }

  onSubmit() {
    if (this.raoFormGroup.valid) {
      this.buttonDisabled = true;
      this.service.submitRAO(this.RaoFormViewModel.officeId, this.RaoFormViewModel.rao)
        .subscribe(api => {
          this.RaoFormViewModel.officeId = api._body;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.submitFooterAlertModel)));
          let url = 'fal/myRegionalAssistanceLocations';
          this.router.navigate([url]);
        },
        error => {
          this.buttonDisabled = false;
          console.error('error saving assistance listing to api', error);
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.submitFooterErrorModel)));
        });
    } else {
      for (let control in this.raoFormGroup.controls) {
        this.raoFormGroup.controls[control].markAsDirty();
        this.raoFormGroup.controls[control].updateValueAndValidity();
      }
    }
  }

  onModalClose(event) {

  }

  deleteRAO(event) {
    this.buttonDisabled = true;
    // call the service and pass the id from data
    this.service.deleteRAO(this.route.snapshot.params['id']).subscribe(
      data => {
        this.modal2.closeModal();
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.deleteFooterAlertModel)));
        let url = 'fal/myRegionalAssistanceLocations';
        this.router.navigate([url]);
      },
      error => {
        this.buttonDisabled = false;
        console.error('error occurred while deleting');
      }
    )
  }

}
