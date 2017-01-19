import { Component, Output, EventEmitter, NgZone, NgModule } from '@angular/core';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals.ts';
import { Router } from '@angular/router';

@Component({
  providers: [IAMService],
  templateUrl: 'reports.template.html',
  
})
export class ReportsPage {

  private currentSection: string = "overview";
  private currentUrl: string = "/reports/overview";
  private baseUrl: string = "/reports/";
  private currentSubSection: string = "";
  private widthLimit: number = 1200;
public states = {
    isSignedIn: false,
    showSignIn: true
  };

  public user = null;
  
  constructor(private router: Router, private zone: NgZone, private api: IAMService) {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
  }
checkSession(cb: () => void) {
    let vm = this;

    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.states.showSignIn = false;
      vm.user = user;
      cb();
    });
  }
  ngOnInit(){
    this.router.events.subscribe(
      val => {
        if(val.url.indexOf("#") > 0){
          this.currentUrl = val.url.substr(0,val.url.indexOf("#"));
        }else{
          this.currentUrl = val.url;
        }
        let section = this.currentUrl.substr(this.baseUrl.length);
        section = section.length === 0? 'overview':section;
        this.currentSection = section;
      });
  }

  changeSection(value){
    window.scrollTo(0,0);
    this.currentSection = value;
    this.currentUrl = this.baseUrl+this.currentSection;
  }

  getSectionClass(value){
    return this.isCurrentSection(value)? "usa-current":"";
  }

  isCurrentSection(value){
    return this.currentSection === value;
  }

  changeSubSection(value,elem){
    this.currentSubSection = value;
    if(window.innerWidth>this.widthLimit){
      setTimeout(()=>{
        elem.focus();
      });
    }
  }

  getSubSectionClass(value){
    return this.isCurrentSubSection(value)? "usa-current":"";
  }

  isCurrentSubSection(value){
    return this.currentSubSection === value;
  }

}
