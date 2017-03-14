import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import * as Cookies from 'js-cookie';

import { ProgramService } from 'api-kit';
import { ProgramFormModel } from './assistance-listing.model';


@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-operations.page.html',
  providers: [ProgramService, ProgramFormModel]
})

export class ProgramPageOperations implements OnInit, OnDestroy {

  programForm;
  submitted: boolean;
  saveProgSub: any;
  getProgSub: any;
  programId: string = null;
  currentUrl: string;
  mode: string;
  cookieValue: string;
  objectFormData: any;
  @ViewChild('objectForm') objectForm;

  sidenavModel = {
    "label": "Assistance Listings",
    "children": [
      {
        "label": "Header Information",
        "route": "#header_information",
      },
      {
        "label": "Overview",
        "route": "#overview",
      }
    ]
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private programService: ProgramService,
              private programFormModel: ProgramFormModel
              ) {
  }

  ngOnInit() {

    this.objectFormData = this.programFormModel.getFormFields();

    this.createFormGrp();

   /* if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      this.cookieValue = Cookies.get('iPlanetDirectoryPro');
      this.currentUrl = document.location.href;
      this.programId = this.route.snapshot.params['id'];

      if (this.programId == null)
        this.mode = 'add';
      else
        this.mode = 'edit';


      if (this.mode == 'edit') {
        this.getProgSub = this.programService.getAuthProgramById(this.programId, this.cookieValue)
          .subscribe(api => {
            console.log('api', api);
            let title = api.data.title;
            let popularName = (api.data.alternativeNames ? api.data.alternativeNames[0] : '');
            let falNo = (api.data.programNumber ? api.data.programNumber : '');

            if (falNo.trim().length == 6)
              falNo = falNo.slice(3, 6);

            let objective = (api.data.objective ? api.data.objective : '');

            this.programForm.patchValue({
              header_information:{
                title: title,
                alternativeNames: popularName,
                programNumber: falNo
              },
              overview:{
                objective:objective
              }
            });

          });
      }
    } else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }*/
  }

  createFormGrp() {

    this.programForm = this.objectForm.createForm(this.objectFormData);

  }


  ngOnDestroy() {

    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }


  onCancelClick(event) {
    this.router.navigate(['/falworkspace']);
  }

  saveProgram(data, redirectPage) {

    this.saveProgSub = this.programService.saveProgram(this.programId, data, this.cookieValue)
      .subscribe(api => {
        this.programId = api._body;

        switch(redirectPage) {
          case 'edit': {
            this.router.navigate(['/programs/' + this.programId + '/edit']);
            break;
          }
          case 'workspace':{
            this.router.navigate(['falworkspace']);
            break;
          }
        }//end of switch
      }); //end of subscribe
  }

  buttonHandler(event){
    let redirectPage: any;
    switch(event.type){
      case "saveContinue" : {
        redirectPage = 'edit';
        this.saveProgram(event.data, redirectPage);
        break;
      }
      case "saveExit" : {
        redirectPage = 'workspace';
        this.saveProgram(event.data, redirectPage);
        break;
      }
    }

  }


}
