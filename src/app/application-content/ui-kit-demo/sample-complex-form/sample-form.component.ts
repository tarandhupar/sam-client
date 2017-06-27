import {Component, OnInit, ViewChildren, AfterViewInit} from '@angular/core';
import {SampleFormService} from "./sample-form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SampleFormViewModel} from "./sample-form.model";
import * as Cookies from 'js-cookie';

@Component({
  moduleId: __filename,
  templateUrl: 'sample-form.template.html',
  providers: [ SampleFormService ]
})

export class SampleFormComponent implements OnInit {
  SampleFormViewModel: SampleFormViewModel;
  sections: string[] = [ "page1","page2","page3" ];//should match fragments in sidenav routes
  sectionTitles: string[] = [ "Page #1","Page #2","Page #3" ];//should match fragments in sidenav routes
  currentSection: number;
  sidenavModel = {
    label: 'abc',
    children:[{
      label: "Page 1",
      route: "#page1"
    }, {
      label: "Page 2",
      route: "#page2"
    }, {
      label: "Page 3",
      route: "#page3"
    }]
  };
  sidenavSelection = [];
  formErrors = false;
  crumbs = [{url:'/',breadcrumb:'Home'},{breadcrumb:''}];
  statusBannerText:string;
  @ViewChildren('form') form;

  constructor(private service: SampleFormService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: { data: { data } }) => {
        this.SampleFormViewModel = new SampleFormViewModel(resolver.data);
        this.SampleFormViewModel.id = this.route.snapshot.params['id'];
      });
    } else {
      this.SampleFormViewModel = new SampleFormViewModel(null);
    }

    this.determineLogin();
    this.determineSection();
  }

  determineLogin() {
    /*let cookie = SampleFormService.getAuthenticationCookie();
    if (cookie != null) {
    } else if (cookie == null) {
      this.router.navigate(['signin']);
    }*/
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sections.indexOf(sectionName);
  }

  determineSection() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
        this.setCurrentSection(fragment);
      } else {
        this.setCurrentSection('page1');
        this.navigateSection();
      }

      this.sidenavSelection = [this.currentSection];
      this.crumbs[1].breadcrumb = this.sidenavModel.children[this.currentSection].label;
    });
  }
  
  gotoNextSection() {
    if (this.currentSection + 1 >= this.sections.length) {
      this.currentSection = this.sections.length-1;
    } else{
      ++this.currentSection;
    }
  }

  gotoPreviousSection() {
    if (this.currentSection - 1 < 0) {
      this.currentSection = 0;
    } else{
      --this.currentSection;
    }
  }

  setCurrentSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
    this.sidenavSelection = [this.currentSection];
  }

  onCancelClick() {
    //  TODO: Add unsaved prompt
    this.cancel();
  }

  cancel() {
      console.log("cancel + back to workspace action");
  }

  navigateSection() {
    let url = this.SampleFormViewModel.id ? '/sampleForm/' + this.SampleFormViewModel.id + '/edit' : '/sampleForm/add';
    this.router.navigate([url], {fragment: this.sections[this.currentSection]});
    this.sidenavSelection = [this.currentSection];
    this.crumbs[1].breadcrumb = this.sidenavModel.children[this.currentSection].label;
  }

  onSaveExitClick() {
    console.log("save + back to workspace action");
  }

  onSaveBackClick() {
    this.gotoPreviousSection();
    this.navigateSection();
  }

  onSaveContinueClick() {
    this.gotoNextSection();
    this.navigateSection();
  }

  onDoneClick(){
    this.formErrors = true;
    this.statusBannerText = "There are a few errors";
    console.log("done action");
  }
  
  formActionHandler(evt){
    if(evt && evt.event){
      switch(evt.event){
        case "done":
          this.onDoneClick();
          break;
        case "cancel":
          this.cancel();
          break;
        case "save-exit":
          this.onSaveExitClick();
          break;
        case "next":
          this.onSaveContinueClick();
          break;
        case "back":
          this.onSaveBackClick();
          break;
      }
    }
  }

  navHandler(evt){
    if(evt && evt.route){
      let route = evt.route.split("#");
      this.setCurrentSection(route[1]);
      this.navigateSection();
    }
  }

  getSectionTitle(){
    return this.sectionTitles[this.currentSection];
  }
}
