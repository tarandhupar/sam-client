import { Component } from "@angular/core";


@Component ({
  templateUrl: 'workspace.template.html'
})
export class WorkspacePage {

  currentUrl:string = "workspace";
  currentSection: string = "";
  showWelcome:boolean = true;

  constructor(){}

  ngOnInit(){}

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }

  closeWelcomeSection(){
    this.showWelcome = false;
  }

}
