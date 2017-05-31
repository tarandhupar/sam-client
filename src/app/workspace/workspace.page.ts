import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component ({
  templateUrl: 'workspace.template.html'
})
export class WorkspacePage {

  currentUrl:string = "workspace";
  currentSection: string = "";
  showWelcome:boolean = true;
  dataEntryWidgetControl:any = {entity:true,exclusions:true,award:true,opportunities:true,assistanceListings:true,subAward:true};
  administrationWidgetControl:any = {profile:true,fh:true,rm:true,aacRequest:true,alerts:true,analytics:true};

  userProfile = 'r-IAE-ad';
  userMapping:any = {1:'f-ng-na',2:'f-g-na',3:'r-ng-na',4:'r-g-na',5:'r-g-ad',6:'r-IAE-ad'};
  userAccessTokens:any = [];
  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    this.route.queryParams.subscribe(
      queryParams => {
        if(queryParams['user'] !== undefined && queryParams['user'] !== null){
          this.userProfile = this.userMapping[queryParams['user']];
        }
        this.userAccessTokens = this.userProfile.split('-');
        this.showWelcome =  this.userAccessTokens[0] === 'f';
        this.setDataEntryWidgetControl();
        this.setAdministrationWidgetControl();
      });

  }

  setDataEntryWidgetControl(){
    if(this.userAccessTokens[2] !== 'ad') {
      this.dataEntryWidgetControl.entity = false;
      this.dataEntryWidgetControl.exclusions = false;
      this.dataEntryWidgetControl.assistanceListings = false;
      this.dataEntryWidgetControl.award = false;
      this.dataEntryWidgetControl.subAward = false;
      this.dataEntryWidgetControl.opportunities = false;
    }
    if(this.userAccessTokens[1] === 'IAE'){
      this.dataEntryWidgetControl.award = false;
    }
    if(this.userProfile === 'r-ng-na'){
      this.dataEntryWidgetControl.subAward = true;
    }
    if(this.userProfile === 'r-g-na'){
      this.dataEntryWidgetControl.opportunities = true;
    }
  }

  setAdministrationWidgetControl(){
    if(this.userAccessTokens[2] !== 'ad'){
      this.administrationWidgetControl.fh = false;
      this.administrationWidgetControl.rm = false;
    }
    if(this.userAccessTokens[1] === 'ng'){
      this.administrationWidgetControl.aacRequest = false;
    }
    if(this.userAccessTokens[1] !== 'IAE'){
      this.administrationWidgetControl.alerts = false;
      this.administrationWidgetControl.analytics = false;
    }
  }

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }

  closeWelcomeSection(){
    this.showWelcome = false;
  }

  isDisplayDataEntry():boolean{
    let display = false;
    Object.keys(this.dataEntryWidgetControl).forEach( key => {
      if(this.dataEntryWidgetControl[key]) display = true;
    });
    return display;
  }

}
