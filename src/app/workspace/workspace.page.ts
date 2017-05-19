import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute } from "@angular/router";


@Component ({
  templateUrl: 'workspace.template.html'
})
export class WorkspacePage {

  currentSection: string = "";


  constructor(private fhService: FHService, private route: ActivatedRoute){}

  ngOnInit(){

  }

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }

}
