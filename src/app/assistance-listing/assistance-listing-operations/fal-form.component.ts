import {Component, OnInit} from '@angular/core';
import {FALFormService} from "./fal-form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProgramService} from "../../../api-kit/program/program.service";
import {FALFormViewModel} from "./fal-form.model";
import * as Cookies from 'js-cookie';

@Component({
  moduleId: __filename,
  templateUrl: 'fal-form.template.html',
  providers: [ FALFormService, ProgramService ]
})

export class FALFormComponent implements OnInit {
  programId: any;
  falFormViewModel: FALFormViewModel;
  sections: string[] = ["header-information", "overview", "financial-information-obligations", "financial-information-other", "contact-information", "review"];
  currentSection: number;

  constructor(private service: FALFormService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.programId = this.route.snapshot.params['id'];
      this.route.data.subscribe((resolver: { fal: { data } }) => {
        this.falFormViewModel = new FALFormViewModel(resolver.fal.data);
      });
    } else {
      this.falFormViewModel = new FALFormViewModel(null);
    }

    this.determineLogin();
    this.determineSection();
  }

  //  TODO: Migrate to external service?
  determineLogin() {
    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
        this.router.navigate(['accessrestricted']);
      }
    } else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sections.indexOf(sectionName) || this.currentSection == this.sections.indexOf("review");
  }

  determineSection() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
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
      this.currentSection = this.sections.indexOf("review");
    } else{
      ++this.currentSection;
    }
  }

  gotoPreviousSection() {
    if (this.currentSection - 1 < 0) {
      this.currentSection = this.sections.indexOf("review");
    } else{
      --this.currentSection;
    }
  }

  gotoSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
  }

  onCancel() {
    //  TODO: Add unsaved prompt
    this.cancel();
  }

  cancel() {
    this.router.navigate(['/falworkspace']);
  }

  navigateSection() {
    let url = this.programId ? '/programsForm/' + this.programId + '/edit' : '/programsForm/add';
    this.router.navigate([url], {fragment: this.sections[this.currentSection]});
  }

  onSaveBack() {
    this.service.saveFAL(this.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.programId = api._body;
          this.gotoPreviousSection();
          this.navigateSection();
        },
        error => {
          console.error('error saving assistance listing to api', error);
        });
  }

  onSaveExit() {
    this.service.saveFAL(this.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.programId = api._body;
          this.cancel();
        },
        error => {
          console.error('error saving assistance listing to api', error);
        });
  }

  onSaveContinue() {
    //  TODO: Support partial update?
    this.service.saveFAL(this.programId, this.falFormViewModel.data)
      .subscribe(api => {
          this.programId = api._body;
          this.gotoNextSection();
          this.navigateSection();
        },
        error => {
          console.error('error saving assistance listing to api', error);
        });
  }
}
