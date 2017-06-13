import {Component, OnInit, ViewChildren, AfterViewInit} from '@angular/core';
import {FALFormService} from "./fal-form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FALFormViewModel} from "./fal-form.model";
import {AlertFooterService} from "../../alerts/alert-footer/alert-footer.service";

// todo: migrate to errors service
export interface FieldError {
  id?: string,
  label: string,
  errors: string[]
}

// todo: migrate to errors service
export interface FieldErrorList {
  id?: string,
  label: string,
  errors: (FieldError | FieldErrorList)[]
}

@Component({
  moduleId: __filename,
  templateUrl: 'fal-form.template.html',
  providers: [FALFormService]
})
export class FALFormComponent implements OnInit, AfterViewInit {
  falFormViewModel: FALFormViewModel;
  sections: string[] = ["header-information", "overview", "authorization", "financial-information-obligations", "financial-information-other", "criteria-information", "applying-for-assistance", "compliance-requirements", "contact-information", "review", "submit"];
  currentSection: number;
  sectionErrors = [];
  @ViewChildren('form') form;
  toggleButton: boolean;
  successFooterAlertModel = {
    title: "Success",
    description: "Submission Successful.",
    type: "success",
    timer: 3000
  };

  errorFooterAlertModel = {
    title: "Error",
    description: "Error in Submission.",
    type: "error",
    timer: 3000
  };

  notifySuccessFooterAlertModel = {
    title: "Success",
    description: "Successfully sent notification.",
    type: "success",
    timer: 3000
  };

  notifyErrorFooterAlertModel = {
    title: "Error",
    description: "Error sending notification.",
    type: "error",
    timer: 3000
  };

  constructor(private service: FALFormService, private route: ActivatedRoute, private router: Router, private alertFooterService: AlertFooterService) {
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {fal: {data}}) => {
        this.falFormViewModel = new FALFormViewModel(resolver.fal);
        this.falFormViewModel.programId = this.route.snapshot.params['id'];
      });
    } else {
      this.falFormViewModel = new FALFormViewModel(null);
    }
    this.determineLogin();
    this.determineSection();
    if (this.falFormViewModel.isNew && this.toggleButton!== true && this.toggleButton !== false) {
      this.service.getSubmitPermission().subscribe(api => {
        let submitPermissions = api.SUBMIT_FALS;
        if (submitPermissions) {
          this.toggleButton = true;
        } else {
          this.toggleButton = false;
        }
      });
    } else {
      this.toggleButtonOnPermissions();
    }
  }

  ngAfterViewInit() {
    this.triggerValidationonReview();

    this.form.changes.subscribe(() => {
       this.triggerValidationonReview();
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
    return this.currentSection == this.sections.indexOf(sectionName) || (this.currentSection == this.sections.indexOf("review") && sectionName !== 'submit');
  }

  determineSection() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
        if(fragment == 'submit' && (this.sectionErrors.length > 0 || !this.toggleButton)){
          this.gotoSection('header-information');
          this.navigateSection();
        }
        this.gotoSection(fragment);
      } else {
        this.gotoSection('header-information');
        this.navigateSection();
      }
    });
  }

  //  TODO: Migrate to section service?
  gotoNextSection() {
    if (this.currentSection + 1 >= this.sections.length) {
      this.currentSection = this.sections.indexOf("submit");
    } else {
      ++this.currentSection;
    }
  }

  gotoPreviousSection() {
    if (this.currentSection - 1 < 0) {
      this.currentSection = this.sections.indexOf("submit");
    } else {
      --this.currentSection;
    }
  }

  gotoSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
  }

  onCancelClick() {
    let submitFragment = this.router.url.substring(this.router.url.lastIndexOf("#") + 1);
    if (submitFragment === 'submit') {
      let url = this.falFormViewModel.programId ? '/programsForm/' + this.falFormViewModel.programId + '/edit' : '/programsForm/add';
      this.router.navigate([url], {fragment: this.sections[this.currentSection - 1]});
    } else {
      //  TODO: Add unsaved prompt
      this.cancel();
    }
  }

  cancel() {
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/view' : '/fal/workspace';
    this.router.navigateByUrl(url);
  }

  navigateSection() {
    let url = this.falFormViewModel.programId ? '/programsForm/' + this.falFormViewModel.programId + '/edit' : '/programsForm/add';
    this.router.navigate([url], {fragment: this.sections[this.currentSection]});
  }

  onSaveExitClick() {
    this.service.saveFAL(this.falFormViewModel.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.falFormViewModel.programId = api._body;
          this.router.navigate(['/fal/workspace']);
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
    this.toggleButtonOnPermissions();
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
    if (this.falFormViewModel.programId) {
      this.service.getFAL(this.falFormViewModel.programId).subscribe(api => {
        this.falFormViewModel = new FALFormViewModel(api);
        this.toggleButtonOnPermissions();
      });
    }
  }

  toggleButtonOnPermissions() {
    if (this.falFormViewModel['_fal']['_links'] && this.falFormViewModel['_fal']['_links']['program:submit']) {
      this.toggleButton = true;
    } else {
      this.toggleButton = false;
    }
  }

  onSubmitOMBClick() {
    let data = {"reason": this.falFormViewModel.reason};
    this.service.submitFAL(this.falFormViewModel.programId, data)
      .subscribe(api => {
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
          this.router.navigate(['/fal/workspace']);
        },
        error => {
          console.error('error  Submitting to OMB to api', error);
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.errorFooterAlertModel)));

        });
  }

  onNotifyClick() {
    this.service.sendNotification(this.falFormViewModel.programId)
      .subscribe(api => {
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifySuccessFooterAlertModel)));
          this.router.navigate(['/fal/workspace']);
        },
        error => {
          console.error('error sending notification', error);
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyErrorFooterAlertModel)));
        });
  }

  triggerValidationonReview() {
    if (this.currentSection == this.sections.indexOf("review")) {
      setTimeout(() => {

        for (let formSection of this.form._results) {
          formSection.validateSection();
        }
      }, 20);
    }
  }

  checkSectionforErrors(formErrorArr, section){

    let len = 0;
    let index = this.sectionErrors.indexOf(section);

    if(formErrorArr instanceof Object){
      len = Object.keys(formErrorArr).length;
    }
    else {
      len = formErrorArr.length;
    }

    if(len > 0 ){
      if(index == -1)
        this.sectionErrors.push(section);
    }
    else {
      if(index > -1)
        this.sectionErrors.splice(index, 1);
    }
  }

  sectionEventHandler(event){
    this.checkSectionforErrors(event.formErrorArr, event.section);
  }
}
