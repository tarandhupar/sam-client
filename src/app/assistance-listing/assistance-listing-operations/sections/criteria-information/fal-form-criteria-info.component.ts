import {
  Component, Input, OnInit, ViewChild, Output, EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import {FALFormService} from "../../fal-form.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import {AutocompleteConfig} from "sam-ui-elements/src/ui-kit/types";
import {FALFormErrorService} from "../../fal-form-error.service";
import {FALSectionNames} from '../../fal-form.constants';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-criteria-info',
  templateUrl: 'fal-form-criteria-info.template.html'
})

export class FALFormCriteriaInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public onError = new EventEmitter();
  @Output() public showErrors = new EventEmitter();

  applicantEligibilityHint: string = `<p>Please select all that apply to help public users search for this listing.</p>
                                   <p>Who can apply to the Government and what criteria must the applicants) satisfy? Include also eligibility criteria required of subgrantees. The main purpose of this section is to inform potential applicants (particularly State and local governments, U.S. Territories, and federally recognized Indian tribal governments) that they can apply for a program. Some of the terms being used in this section are “public agency,” “public organizations,” and “public bodies” if these words mean the same as city, county, and State governments, use the latter more specific words.</p>
                                   <p>Specifically, are State and local governments, private, public, profit, nonprofit organizations and institutions or individuals eligible? Since State designate Indian tribal governments are considered units of local government, indicate those programs that include or exclude these entities as units of local government because of the nature of the program. If institutions of higher education are eligible, indicate whether they must be public, private, State colleges and universities, junior or community colleges, etc. Indicate who specifically is not eligible. Certain programs involve intermediate level of application processing, i.e., applications transmitted through governmental or nongovernmental units that are neither the direct applicants to the Federal government nor the ultimate beneficiary. If this is the case, what Federal criteria or general criteria must this intermediate level applicant satisfy? Who specifically at this intermediate level is not eligible?</p>
                                   <p>The information in the Applicant Eligibility Index is based on the information recorded in this section.</p>
                                   <p>In order to make the entries in the Applicant Eligibility section of the program descriptions consistent, identify the Eligible applicants and Use of assistance from the following terms and incorporate them into the narrative of the program description:</p>
                                   <p>Eligible Applicants</p>
                                   <p>Federal - Department and establishment of the Federal government which are responsible for enforcement and the fulfillment of public policy. These departments and establishments directly administer and exercise jurisdiction over matters assigned to them, and are the administering agencies of Federal domestic assistance programs.</p>
                                   <p>Interstate - An organizational unit established by two or more States to coordinate certain regional programs relating usually to boundaries for the control and improvement of rivers for irrigation or water power, conservation of natural resources, public utility regulation, development of ports, regional educational development, and regional planning.</p>
                                   <p>Intrastate - An organizational entity within the boundaries of a State established for such purposes as trade, transportation, and communication, performing economic, cultural, and historical functions conducted wholly within the boundaries of a State and which is subject to State regulatory authority. Includes water and sewer districts, and may include a region wholly in a State, such as a Council of Governments. State - Any agency or instrumentality of the fifty States and the District of Columbia excluding the political subdivisions of State, but including public institutions of higher education and hospitals. (This term does not include U.S. possessions or territories.)</p>
                                   <p>Local - Political subdivisions of a State created under general law or State charter that regulate and administer matters chiefly of local concern. These subdivisions include cities, parishes, counties, municipalities, towns, townships, villages, school districts, special districts, or agencies or instrumentalities of local government, exclusive of institutions of higher education and hospitals. Included are Indian tribes on State reservations, Indian school boards, and State-designated Indian tribes.</p>
                                   <p>Sponsored organizations - A public purpose group other than a unit of government that is a beneficiary under a plan or program administered by a State, or political subdivision of a State or local government, and which is subject to approval by a Federal agency. Usually organized to work for a specific purpose. Examples: Community development agencies, model cities, community action agencies.</p>
                                   <p>Public nonprofit institution organizations - A publicly owned agency or organization established to perform specialized functions or services for the benefit of all or part of the general public either without charge or at cost, making no profits and having no shareholders to receive dividends. Includes institutions of higher education and hospitals.</p>
                                   <p>Other public institution organization - A public purpose agency performing functions such as taxation and police regulation for the convenience, safety, or welfare of the entire community, not of a specific individual or class of persons. Examples: Public broadcasting entities, public corporations, public radio-stations.</p>
                                   <p>Federally Recognized Indian Tribal Government - The governing body or a governmental agency of an Indian tribe, Nation, pueblo, or other organized group or community (including any Native village as defined in the Alaska Native Claims Settlement Act) certified by the special programs and services provided through the Bureau of Indian Affairs.</p>
                                   <p>U.S. territory or possession- Any agency or instrumentality of the Commonwealth of Puerto Rico, Virgin Islands, Guam, American Samoa, the Trust Territories of the Pacific Islands, and the Mariana Islands, including the political subdivisions of a territory, institutions of higher education, and hospitals. If territories are eligible to apply, the most accurate designation would be to state exactly which territory(ies) is eligible since all territories may not fall under the same set of eligibility criteria.</p>
                                   <p>Individual/Family - A person or group of persons who meet specified eligibility criteria. An example of a program where this applicant is eligible is the Food Stamps Program (10.551). Minority group - A group regarded as a subgroup of the majority to include African Americans, Americans of Spanish descent, Asians, and other nonwhite persons. It may include disadvantaged or under represented groups, such as women, Vietnam-era veterans, and the physically challenged/disabled.</p>
                                   <p>Specialized group - A group of people with a specific mutual interest. Examples: American Medical Association, students, veterans.</p>
                                   <p>Small business - A business of less than 500 employees, independently owned and not dominant in its field. (Detailed criteria are established by the Small Business Administration.)</p>
                                   <p>Profit organization - A public or private organization designed to produce product or deliver services to the public through a business enterprise which is structured and managed for profit.</p>
                                    <p>Private nonprofit institution/organization – A privately owned organization or institution that represents community special interests through community service networks, public information, technical assistance, and public education. Operated exclusively for charitable, scientific, literary or educational purposes such that no part of its earnings is for the benefit of any private shareholder or individual. Includes private institutions of higher education and hospitals. Examples: Girl Scouts, American Civil Liberties Union.</p>
                                    <p>Quasi-public nonprofit institution/organization - A private organization or institution engaged in rendering essential services to the public and therefore given special privileges such as those given to public institutions/organizations. Examples: American Red Cross, United Givers Fund. Other private institution/organization - A privately owned agency that operates for profit and disburses dividends to shareholders.</p>
                                    <p>Anyone/general public - Any person(s), without regard to specified eligibility criteria.
                                    <p>Native American Organization - Groups of Indians to include urban Indian groups, cooperatives, corporations, partnerships, and associations. Also, include Indians as a minority group.</p>`;

  beneficiaryEligibilityHint: string = `<p>Please select all that apply to help public users search for this listing.</p>
                                       <p>Specify who will receive the ultimate benefits from the program. Programs that provide direct assistance from a Federal agency will generally have the same applicant and beneficiary. Do not use the statement "Same as Applicant Eligibility." In cases where assistance is provided through State and local governments, the applicants and beneficiaries may be different since the assistance is transmitted to private sector beneficiaries who do not have to request or apply for the benefits.</p>
                                       <p>In order to make the entries in the Beneficiary Eligibility section of the program descriptions consistent, select the beneficiary type from the terms below and also incorporate them into the narrative of the program description:</p>
                                      <ul><li>Federal</li>
                                      <li>Interstate</li>
                                      <li>Intrastate</li>
                                      <li>State</li>
                                      <li>Local</li>
                                      <li>Sponsored Organization</li>
                                      <li>Public Nonprofit Institution/Organization</li>
                                      <li>Other Public Institution/organization</li>
                                      <li>Federally Recognized Indian Tribal Government</li>
                                      <li>U.S. Territory/Possession</li>
                                      <li>Individual/Family</li>
                                      <li>Minority Group</li>
                                      <li>Specialized Group</li>
                                      <li>Small Business</li>
                                      <li>Profit Organization</li>
                                      <li>Private Organization</li>
                                      <li>Quasi-Public Nonprofit Organization</li>
                                      <li>Other Private Institution/organization</li>
                                      <li>Anyone/General Public</li>
                                      <li>Native American Organization</li>
                                      <li>Health Professional</li>
                                      <li>Education Professional</li>
                                      <li>Student/Trainee</li> 
                                      <li>Graduate Student</li>
                                      <li>Scientists/Researcher</li>
                                      <li>Artist/Humanist</li>
                                      <li>Engineer/Architect</li>
                                      <li>Builder/Contractor/Developer</li>
                                      <li>Farmer/Rancher/Agriculture Producer</li>
                                      <li>Industrialist/Business Person</li>
                                      <li>Small Business Person</li>
                                      <li>Consumer</li>
                                      <li>Homeowner</li>
                                      <li>Land/Property Owner</li>
                                      <li>Black American</li>
                                      <li>American Indian</li> 
                                      <li>Spanish Origin</li>
                                      <li>Oriental</li>
                                      <li>Other Nonwhite</li>
                                      <li>Migrant</li>
                                      <li>U.S. Citizen</li>
                                      <li>Refugee/Alien - veteran/service person/Reservist (including dependents)</li>
                                      <li>Women</li>
                                      <li>Handicapped (Deaf, Blind, Crippled)</li>
                                      <li>Physically Afflicted (TB, Arthritis, Heart Disease)</li>
                                      <li>Mentally Disabled</li> 
                                      <li>Drug Addict</li>
                                      <li>Alcoholic</li> 
                                      <li>Juvenile Delinquent</li>
                                      <li>Preschool</li>
                                      <li>School</li>
                                      <li>Infant (0-5)</li>
                                      <li>Child (6-15)</li>
                                      <li>Youth (16-21)</li>
                                      <li>Senior Citizen (60+)</li>
                                      <li>Unemployed</li>
                                      <li>Welfare Recipient</li>
                                      <li>Pension Recipient</li>
                                      <li>Moderate Income</li>
                                      <li>Low Income</li>
                                      <li>Major Metropolis (over 250,000)</li>
                                      <li>Other urban</li>
                                      <li>Suburban</li>
                                      <li>Rural</li>
                                      <li>Education (0-8)</li>
                                      <li>Education (9-12)</li>
                                      <li>Education (13+)</li></ul>`;

  timePhasingHint: string = `<p>Describe the period of time when assistance is available. Also, the period of time when funding must be spent.</p>
                            <p>First, for what period of time is the assistance normally available? Is there a restriction placed on the time permitted to spend the money awarded? 
                            Second, how is the assistance (particularly for grant programs) awarded and/or released; as a lump sum, quarterly, by letter of credit, etc.?</p>`;

  useOfAssistanceHint: string = `<p>Please select all that apply from the dropdown list.</p>
                               <br>
                               <p>00 - No Functional Application/Unlimited Application 42 - Higher Education (includes Research)</p> 
                                <p>12 - Agriculture/Forestry/Fish and Game 44 - Housing</p> 
                                <p>14 - Business/Commerce 46 - Income Security/Social Service/Welfare</p> 
                                <p>16 - Civil Defense/Disaster Prevention and Relief/Emergency Preparedness  48 - International (includes Export/lmport)</p> 
                                <p>18 - Communications 52 - Libraries/information/Statistics</p> 
                                <p>20 - Community Development (includes Federal surplus property) 54 - Maritime</p> 
                                <p>22 - Construction/Renew al/Rehabilitation 58 - Planning</p> 
                                <p>24 - Consumer Protection 60 - Public Works</p> 
                                <p>26 - Culture/Arts/Humanities 62 - Recreation (includes Historic Preservation)</p> 
                                <p>28 - Economic Development 64 - Regional Development</p> 
                                <p>30 - Elementary/Secondary Education 66 - Science and Technology</p> 
                                <p>32 - Employment/Labor/Management 70 - Training</p> 
                                <p>34 - Energy 68 - Transportation</p>
                                <p>36 - Environment (w ater, air, solid w aste, pesticides, radiation) 74 - Vocational Education</p> 
                                <p>38 - Food and Nutrition 76 - Vocational Rehabilitation</p> 
                                <p>40 - Health/Medical 72 - Youth Development</p>`;
  private formErrors = new Set();

  @ViewChild('appauto') appauto;
  @ViewChild('documentationComp') documentationComp;
  @ViewChild('usageResComp') usageResComp;
  @ViewChild('useDisFundsComp') useDisFundsComp;
  @ViewChild('useLoanTermsComp') useLoanTermsComp;

  falCriteriaForm: FormGroup;

  //Assistance Usage Multiselect
  assMultiArrayValues = [];
  assUsageTypeOptions = [];
  assUsageKeyValue = [];

  //Awarded Dropdown
  awardedTextarea: boolean = false;
  awardedTypeOptions = [{value: 'na', label: "None Selected"}];

  //Applicant Multiselect
  appMultiArrayValues = [];
  applicantTypeOptions = [];
  applicantKeyValue = [];

  //Beneficiary Multiselect
  benMultiArrayValues = [];
  benTypeOptions = [];
  benKeyValue = [];
  toggleBenSection: boolean = false;


  // Checkboxes Component
  benSameAsApplicantConfig = {
    options: [{
      value: 'isSameAsApplicant',
      label: 'Beneficiary eligibility is the same as applicant eligibility',
      name: 'checkbox-isa'
    },],
  };

  public useResConfig: Object = {
    name: 'use-restrictions',
    label: 'Use Restrictions ',
    hint: 'List any restrictions on how assistance may be used. Only provide restrictions specific to your organization or this listing.',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'useRestrictions-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };
  public useDisFundsConfig: Object = {
    name: 'use-Discretionary-Funds',
    label: 'Are there discretionary funds available?',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'use-Discretionary-Funds-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };
  public useLoanTermsConfig: Object = {
    name: 'use-Loan-Terms',
    label: 'Are loans a type of assistance in this program?',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'use-Loan-Terms-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public documentationConfig: Object = {
    name: 'documentation',
    label: 'Credentials and Documentation',
    hint: 'Please describe credentials or documentation required for applying. Do not include anything covered in 2 CFR 200.',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'No Credentials or documentation required', name: 'documentation-credentials-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  appAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
  };
  benAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected'
  };
  assUsageAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
  };

  constructor(private fb: FormBuilder, private service: FALFormService, private errorService: FALFormErrorService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createForm();
    this.service.getCriteria_Info_Dictionaries().subscribe(
      data => this.parseDictionariesList(data),
      error => {
        console.error('error retrieving dictionary data', error);
      });
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.updateErrors();
  }

  parseDictionariesList(data) {
    let assListDisplay = [];
    let benListDisplay = [];
    let appListDisplay = [];
    if (data['phasing_assistance'] && data['phasing_assistance'].length > 0) {
      for (let paData of data['phasing_assistance']) {
        this.awardedTypeOptions.push({value: paData.element_id, label: paData.value});
      }
    }
    if (data['assistance_usage_types'] && data['assistance_usage_types'].length > 0) {
      for (let autData of data['assistance_usage_types']) {
        this.assUsageTypeOptions.push({code: autData.element_id, name: autData.value});
        this.assUsageKeyValue[autData.element_id] = autData.value;
      }
    }
    if (data['applicant_types'] && data['applicant_types'].length > 0) {
      for (let atData of data['applicant_types']) {
        let id = atData.element_id;
        this.applicantTypeOptions.push({code: id, name: atData.value});
        this.applicantKeyValue[id] = atData.value;
      }
    }
    if (data['beneficiary_types'] && data['beneficiary_types'].length > 0) {
      for (let btData of data['beneficiary_types']) {
        this.benTypeOptions.push({code: btData.element_id, name: btData.value});
        this.benKeyValue[btData.element_id] = btData.value;
      }
    }
    this.populateMultiSelect(this.viewModel.appListDisplay, this.appAutocompleteConfig, appListDisplay, this.applicantKeyValue);
    this.populateMultiSelect(this.viewModel.benListDisplay, this.benAutocompleteConfig, benListDisplay, this.benKeyValue);
    this.populateMultiSelect(this.viewModel.assListDisplay, this.assUsageAutocompleteConfig, assListDisplay, this.assUsageKeyValue)
    this.falCriteriaForm.patchValue({
      applicantType: appListDisplay.length > 0 ? appListDisplay : [],
      benType: benListDisplay.length > 0 ? benListDisplay : [],
      assUsageType: assListDisplay.length > 0 ? assListDisplay : [],
    }, {
      emitEvent: false
    });
    this.falCriteriaForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
      this.cdr.detectChanges();
      this.updateErrors();
    });
  }

  populateMultiSelect(multiTypeData: any, autoCompleteConfig: any, listDisplay: any, keyValueArray: any) {
    if (multiTypeData && multiTypeData.length > 0) {
      for (let id of multiTypeData) {
        listDisplay.push({code: id, name: keyValueArray[id]});
      }
      autoCompleteConfig.placeholder = this.placeholderMsg(multiTypeData);
    }
  }

  createForm() {
    this.falCriteriaForm = this.fb.group({
      documentation: [''],
      applicantType: [''],
      applicantDesc: [''],
      isSameAsApplicant: [''],
      benType: [''],
      benDesc: [''],
      lengthTimeDesc: [''],
      awardedType: ['na'],
      awardedDesc: [''],
      assUsageType: [''],
      assUsageDesc: [''],
      usageRes: [''],
      useDisFunds: [''],
      useLoanTerms: ['']
    });
    this.cdr.detectChanges();
    if (this.viewModel.getSectionStatus(FALSectionNames.CRITERIA_INFO) === 'updated') {
      this.manualFormDirty();

      for (let id in this.documentationComp.validationGroup.controls) {
        let fcontrol = this.documentationComp.validationGroup.get(id);
        fcontrol.markAsDirty();
      }

      for (let id in this.usageResComp.validationGroup.controls) {
        let fcontrol = this.usageResComp.validationGroup.get(id);
        fcontrol.markAsDirty();
      }

      for (let id in this.useDisFundsComp.validationGroup.controls) {
        let fcontrol = this.useDisFundsComp.validationGroup.get(id);
        fcontrol.markAsDirty();
      }

      for (let id in this.useLoanTermsComp.validationGroup.controls) {
        let fcontrol = this.useLoanTermsComp.validationGroup.get(id);
        fcontrol.markAsDirty();
      }
    }
  }

  updateViewModel(data) {
    this.viewModel.documentation = this.saveChkToggleTextarea(data['documentation']);
    this.viewModel.appListDisplay = this.saveMultiListType(data['applicantType']);
    this.viewModel.applicantDesc = data['applicantDesc'] || null;
    this.viewModel.isSameAsApplicant = this.saveIsSameasApplicant(data['isSameAsApplicant']);
    this.viewModel.benListDisplay = this.saveMultiListType(data['benType']);
    this.viewModel.benDesc = data['benDesc'] || null;
    this.viewModel.lengthTimeDesc = data['lengthTimeDesc'] || null;
    this.viewModel.awardedType = data['awardedType'];
    this.viewModel.awardedDesc = data['awardedDesc'] || null;
    this.viewModel.assListDisplay = this.saveMultiListType(data['assUsageType']);
    this.viewModel.assUsageDesc = data['assUsageDesc'] || null;
    this.viewModel.usageRes = this.saveChkToggleTextarea(data['usageRes']);
    this.viewModel.useDisFunds = this.saveChkToggleTextarea(data['useDisFunds']);
    this.viewModel.useLoanTerms = this.saveChkToggleTextarea(data['useLoanTerms']);
  }

  saveMultiListType(data) {
    let listItems = [];
    for (let listItem of data) {
      listItems.push(listItem.code);
    }
    return listItems;
  }
  updateForm() {
    this.toggleAwardDesc(this.viewModel.awardedType);
    this.falCriteriaForm.patchValue({
      documentation: this.loadChkToggleTextarea(this.viewModel.documentation),
      applicantDesc: this.viewModel.applicantDesc,
      isSameAsApplicant: this.loadIsSameasApplicant(this.viewModel.isSameAsApplicant),
      benDesc: this.viewModel.benDesc,
      lengthTimeDesc: this.viewModel.lengthTimeDesc,
      awardedType: this.viewModel.awardedType,
      awardedDesc: this.viewModel.awardedDesc ? this.viewModel.awardedDesc : '',
      assUsageDesc: this.viewModel.assUsageDesc,
      usageRes: this.loadChkToggleTextarea(this.viewModel.usageRes),
      useDisFunds: this.loadChkToggleTextarea(this.viewModel.useDisFunds),
      useLoanTerms: this.loadChkToggleTextarea(this.viewModel.useLoanTerms)
    }, {
      emitEvent: false
    });
    this.falCriteriaForm.markAsPristine({onlySelf: true});
    this.manualFormDirty();
    this.updateErrors();
  }

  manualFormDirty() {
    if (this.viewModel.getSectionStatus(FALSectionNames.CRITERIA_INFO) === 'updated') {
      this.falCriteriaForm.markAsPristine({onlySelf: true});
      this.falCriteriaForm.get('applicantType').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('applicantType').updateValueAndValidity();
      this.falCriteriaForm.get('benType').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('benType').updateValueAndValidity();
      this.falCriteriaForm.get('awardedType').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('awardedType').updateValueAndValidity();
      this.falCriteriaForm.get('lengthTimeDesc').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('lengthTimeDesc').updateValueAndValidity();
      this.falCriteriaForm.get('assUsageType').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('assUsageType').updateValueAndValidity();
      this.falCriteriaForm.get('assUsageDesc').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('assUsageDesc').updateValueAndValidity();
      this.falCriteriaForm.get('documentation').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('documentation').updateValueAndValidity();
      this.falCriteriaForm.get('applicantDesc').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('applicantDesc').updateValueAndValidity();
      this.falCriteriaForm.get('isSameAsApplicant').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('isSameAsApplicant').updateValueAndValidity();
      this.falCriteriaForm.get('benDesc').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('benDesc').updateValueAndValidity();
      this.falCriteriaForm.get('awardedDesc').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('awardedDesc').updateValueAndValidity();
      this.falCriteriaForm.get('usageRes').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('usageRes').updateValueAndValidity();
      this.falCriteriaForm.get('useDisFunds').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('useDisFunds').updateValueAndValidity();
      this.falCriteriaForm.get('useLoanTerms').markAsDirty({onlySelf: true});
      this.falCriteriaForm.get('useLoanTerms').updateValueAndValidity();
    }
  }

  loadIsSameasApplicant(flag: boolean) {
    let isSamasApp = [];
    this.toggleBenSection = false;
    if (flag) {
      this.toggleBenSection = true;
      isSamasApp.push('isSameAsApplicant')
    }
    return isSamasApp;
  }

  saveIsSameasApplicant(flag: any) {
    let isflag = false;

    if (flag && flag.length > 0) {
      isflag = true;
    }
    return isflag;
  }

  onawardedTypeChange(event) {
    this.toggleAwardDesc(event);
  }

  chkSameAsApp(event) {
    this.toggleBenSection = false;
    let data = event.indexOf('isSameAsApplicant') !== -1;
    if (data) {
      this.toggleBenSection = true;
    }
    this.falCriteriaForm['controls']['benType'].updateValueAndValidity();
  }

  applicantTypeChange(event) {
    this.appAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  applicantlistChange() {
    //this.appAutocompleteConfig.placeholder = this.placeholderMsg(this.falCriteriaForm.value.appListDisplay);
  }

  benTypeChange(event) {
    this.benAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  benlistChange() {
    //this.benAutocompleteConfig.placeholder = this.placeholderMsg(this.falCriteriaForm.value.benListDisplay);
  }

  assUsageTypeChange(event) {
    this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  assUsagelistChange() {
    this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(this.falCriteriaForm.value.assListDisplay);
  }

  placeholderMsg(multiArray: any) {
    let PlaceholderMsg = '';
    if (multiArray.length === 1) {
      PlaceholderMsg = 'One Type Selected';
    } else if (multiArray.length > 1) {
      PlaceholderMsg = 'Multiple Types Selected';
    } else {
      PlaceholderMsg = 'None Selected';
    }
    return PlaceholderMsg;
  }

  toggleAwardDesc(data: any) {
    if (data === 'other') {
      this.awardedTextarea = true;
    } else {
      this.awardedTextarea = false;
    }
  }

// todo: public for testing purposes
  public loadChkToggleTextarea(type: any) {
    let model = {
      checkbox: [],
      textarea: []
    };
    if (type) {
      if ((type.isApplicable === false)) {
        model.checkbox.push('na');
      }

      if (type.description) {
        model.textarea.push(type.description);
      }
    }
    return model;
  }
  // todo: public for testing purposes
  public saveChkToggleTextarea(model: any) {
    let data: any = {};
    if (model && model.checkbox) {
      data.isApplicable = model.checkbox.indexOf('na') < 0;
    } else {
      data.isApplicable = true;
    }
    if (model && model['textarea']) {
      data.description = model['textarea'][0];
    }
    return data;
  }
// todo: public for testing purposes
  public updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.updateControlError(this.falCriteriaForm.get('applicantType'), this.errorService.validateApplicantList());
    this.updateControlError(this.falCriteriaForm.get('benType'), this.errorService.validateBeneficiaryList());
    this.updateControlError(this.falCriteriaForm.get('lengthTimeDesc'), this.errorService.validateLengthTimeDesc());
    this.updateControlError(this.falCriteriaForm.get('awardedType'), this.errorService.validateAwardedType());
    this.updateControlError(this.falCriteriaForm.get('assUsageType'), this.errorService.validateAssistanceUsageList());
    this.updateControlError(this.falCriteriaForm.get('assUsageDesc'), this.errorService.validateAssUsageDesc());

    this.updateDocumentationErrors(this.errorService.validateCriteriaDocumentation());
    this.updateUseRestrictionsErrors(this.errorService.validateCriteriaUsageRes());
    this.updateUseDiscretionaryFundsErrors(this.errorService.validateCriteriaUseDisFunds());
    this.updateUseLoanTermsErrors(this.errorService.validateCriteriaUseLoanTerms());

    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private updateDocumentationErrors(documentationErrors) {
    if (documentationErrors) {
      for (let id in this.documentationComp.validationGroup.controls) {
        let fcontrol = this.documentationComp.validationGroup.get(id);
        this.setControlErrors(fcontrol, documentationErrors);
      }
    }
  }

  private updateUseRestrictionsErrors(useResErrors) {
    if (useResErrors) {
      for (let id in this.usageResComp.validationGroup.controls) {
        let fcontrol = this.usageResComp.validationGroup.get(id);
        this.setControlErrors(fcontrol, useResErrors);
      }
    }
  }

  private updateUseDiscretionaryFundsErrors(useDisErrors) {
    if (useDisErrors) {
      for (let id in this.useDisFundsComp.validationGroup.controls) {
        let fcontrol = this.useDisFundsComp.validationGroup.get(id);
        this.setControlErrors(fcontrol, useDisErrors);
      }
    }
  }

  private updateUseLoanTermsErrors(useLoanTermsErrors) {
    if (useLoanTermsErrors) {
      for (let id in this.useLoanTermsComp.validationGroup.controls) {
        let fcontrol = this.useLoanTermsComp.validationGroup.get(id);
        this.setControlErrors(fcontrol, useLoanTermsErrors);
      }
    }
  }

  private updateControlError(control, errors) {
    this.setControlErrors(control, errors);
    this.cdr.detectChanges();
    control.updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  private setControlErrors(fcontrol, ferrors) {
    fcontrol.clearValidators();
    fcontrol.setValidators((control) => {
      return control.errors
    });
    fcontrol.setErrors(ferrors.errors);
  }
}
