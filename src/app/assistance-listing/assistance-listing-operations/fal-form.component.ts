import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {FALFormService} from "./fal-form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FALFormViewModel} from "./fal-form.model";
import { FALErrorDisplayComponent } from '../components/fal-error-display/fal-error-display.component';
import { FALSectionNames } from './fal-form.constants';
import { FALFormErrorService } from './fal-form-error.service';
import {AuthGuard} from "../authguard/authguard.component";

@Component({
  moduleId: __filename,
  templateUrl: 'fal-form.template.html',
  providers: [FALFormService]
})
export class FALFormComponent implements OnInit, OnDestroy {
  falFormViewModel: FALFormViewModel;
  createPermissions: any;
  sections: string[] = [
    FALSectionNames.HEADER,
    FALSectionNames.OVERVIEW,
    FALSectionNames.AUTHORIZATION,
    FALSectionNames.OBLIGATIONS,
    FALSectionNames.OTHER_FINANCIAL_INFO,
    FALSectionNames.CRITERIA_INFO,
    FALSectionNames.APPLYING_FOR_ASSISTANCE,
    FALSectionNames.COMPLIANCE_REQUIREMENTS,
    FALSectionNames.CONTACT_INFORMATION
  ];

  currentSection: number;
  @ViewChild('errorDisplay') errorDisplayComponent: FALErrorDisplayComponent;
  private routeSubscribe;

  constructor(private service: FALFormService, private route: ActivatedRoute, private router: Router, private errorService: FALFormErrorService, private authGuard: AuthGuard) {
    // jump to top of page when changing sections
    this.routeSubscribe = this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {fal: {data}}) => {
        this.falFormViewModel = new FALFormViewModel(resolver.fal);
        this.falFormViewModel.programId = this.route.snapshot.params['id'];
        this.errorService.viewModel = this.falFormViewModel;
        this.errorService.initFALErrors();
      });
    } else {
      this.falFormViewModel = new FALFormViewModel(null);
      this.errorService.viewModel = this.falFormViewModel;
      this.errorService.initFALErrors();
    }
    this.determineLogin();
    this.determineSection();
    this.service.getFALPermission('CREATE_FALS').subscribe(res => {
      this.errorDisplayComponent.formatErrors(this.errorService.errors);
      this.authGuard.checkPermissions('addoredit', this.falFormViewModel.programId ? this.falFormViewModel['_fal'] : res);
      this.createPermissions = res;
    });
  }

  //  TODO: Migrate to external service?
  determineLogin() {
    let cookie = FALFormService.getAuthenticationCookie();
    if (cookie != null) {
      if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
        this.router.navigate(['accessrestricted']);
      }
    } else if (cookie == null) {
      this.router.navigate(['signin']);
    }
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sections.indexOf(sectionName);
  }

  determineSection() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment && this.sections.indexOf(fragment) != -1) {
        this.gotoSection(fragment);
      } else {
        this.gotoSection(FALSectionNames.HEADER);
        this.navigateSection();
      }
    });
  }

  //  TODO: Migrate to section service?
  gotoNextSection() {
    if (this.currentSection + 1 >= this.sections.length) {
      this.currentSection = this.sections.indexOf("review");
    } else {
      ++this.currentSection;
    }
  }

  gotoPreviousSection() {
    if (this.currentSection - 1 < 0) {
      this.currentSection = this.sections.indexOf("review");
    } else {
      --this.currentSection;
    }
  }

  gotoSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
  }

  onCancelClick() {
    let submitFragment = this.router.url.substring(this.router.url.lastIndexOf("#") + 1);
    if (submitFragment === 'review') {
      let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit' : '/programs/add';
      this.router.navigate([url], {fragment: this.sections[this.currentSection - 1]});
    } else {
      //  TODO: Add unsaved prompt
      this.cancel();
    }
  }

  cancel() {
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/review' : '/fal/workspace';
    this.router.navigateByUrl(url);
  }

  navigateSection() {
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit' : '/programs/add';
    this.router.navigate([url], {fragment: this.sections[this.currentSection]});
  }

  onSaveExitClick() {
    this.service.saveFAL(this.falFormViewModel.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.falFormViewModel.programId = api._body;
          let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/review' : '/fal/workspace';

          this.router.navigate([url]);
        },
        error => {
          console.error('error saving assistance listing to api', error);
        });

  }

  onSaveBackClick() {
    //  TODO: Support partial update?
    this.service.saveFAL(this.falFormViewModel.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.falFormViewModel.programId = api._body;
          this.gotoPreviousSection();
          this.navigateSection();
        },
        error => {
          console.error('error saving assistance listing to api', error);
        });

  }

  onSaveContinueClick() {
    //  TODO: Support partial update?
    this.service.saveFAL(this.falFormViewModel.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.falFormViewModel.programId = api._body;
          this.gotoNextSection();
          this.navigateSection();
        },
        error => {
          console.error('error saving assistance listing to api', error);
        });

  }

  public showErrors(errors) {
    this.errorDisplayComponent.formatErrors(errors);
  }
}
