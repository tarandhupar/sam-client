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
  redirectToEdit: boolean = false;
  redirectToWksp: boolean = false;
  relatedPrograms = [];
  getRelatedProgSub: any;
  getProgramsSub: any;
  listOfPrograms: string;
  stickyLabel: string;
  uuid = [];
  @ViewChild('objectForm') objectForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private programService: ProgramService,
              private programFormModel: ProgramFormModel
  ) {}


  ngOnInit() {


    this.objectFormData = this.programFormModel.getFormFields();

    this.createFormGrp();

    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.cookieValue = Cookies.get('iPlanetDirectoryPro');
        this.currentUrl = document.location.href;
        if(this.currentUrl.indexOf('#') > 0) {

          let anchor = this.currentUrl.substring(this.currentUrl.indexOf('#')+1);

          for(let i=0, len = this.objectFormData.length; i < len; i++) {
            if (this.objectFormData[i].section == anchor){
              this.objectForm.setSelectedPage({selectedPage:i});
              break;
            }
          }
        }//end of if
        this.programId = this.route.snapshot.params['id'];
        this.getPrograms();

        if (this.programId == null){
          this.mode = 'add';
        }
        else
          this.mode = 'edit';

        if (this.mode == 'edit') {
          this.getProgSub = this.programService.getProgramById(this.programId, this.cookieValue)
            .subscribe(api => {
              let title = api.data.title;
              let popularName = (api.data.alternativeNames ? api.data.alternativeNames[0] : '');
              let falNo = (api.data.programNumber ? api.data.programNumber : '');

              if (falNo.trim().length == 6)
                falNo = falNo.slice(3, 6);

              let objective = (api.data.objective ? api.data.objective : '');
              let selections = [];
              this.relatedPrograms = api.data.relatedPrograms.relatedTo;
              for (let relatedProgram of this.relatedPrograms) {
                this.getRelatedProgSub = this.programService.getProgramById(relatedProgram, this.cookieValue).subscribe(api => {
                  this.uuid.push(relatedProgram);
                  let programNumber = api.data.programNumber;
                  let title = api.data.title;
                  let relatedAssistance = programNumber + " " + title;
                  selections.push( // store the related program
                    relatedProgram
                  );
                });
              }

              this.stickyLabel = title + " (" + falNo + ")";
              this.programForm.patchValue({
                header_information:{
                  title: title,
                  alternativeNames: popularName,
                  programNumber: falNo,
                  relatedTo: selections
                },
                overview:{
                  objective:objective
                }
              });
            });//end of subscribe
        }
      } else {
        this.router.navigate(['accessrestricted']);

      }
    } else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }
  }

  ngOnDestroy() {

    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();

    if(this.getProgramsSub)
      this.getProgramsSub.unsubscribe();

    if(this.getRelatedProgSub)
      this.getRelatedProgSub.unsubscribe();
  }

  createFormGrp() {
    this.programForm = this.objectForm.createForm(this.objectFormData);
  }

  getPrograms() {
    this.getProgramsSub = this.programService.runProgram({
      status: 'published',
      includeCount : 'false',
      Cookie: this.cookieValue,
      size:'100',
      sortBy: 'programNumber'
    }).subscribe(
      data => {
        if (data._embedded && data._embedded.program) {
          let optionData = [];
          for (let item of data._embedded.program) {
            this.listOfPrograms = item.data.programNumber +" "+item.data.title;
            optionData.push( { // store the related program
              'label': this.listOfPrograms,
              'value': item.id,
              'name': 'assistanceList'
            })
          }

          this.objectFormData[0].fields[3].options = optionData;
        }
      },
      error => {
        console.error('Error!!', error);
      }
    );
  }

  saveProgram(data) {
    this.saveProgSub = this.programService.saveProgram(this.programId, data, this.cookieValue)
      .subscribe(api => {
          this.programId = api._body;

          if(this.redirectToEdit) {
            this.router.navigate(['/programs/' + this.programId + '/edit'], {fragment: 'overview'});
          }
        if(this.redirectToWksp)
          this.router.navigate(['falworkspace']);
      }); //end of subscribe
  }

  buttonHandler(event){

    switch(event.type){
      case "saveContinue" : {
        if(this.mode == 'add')
          this.redirectToEdit = true;

        this.saveProgram(event.data);

        if(this.mode == 'edit'){
          this.objectForm.setSelectedPage(event);
          let path = this.objectFormData[event.selectedPage].section;
          this.router.navigate([], { fragment: path });
        }
        break;
      }
      case "saveExit" : {
        this.redirectToWksp = true;
        this.saveProgram(event.data);
        break;
      }
      case "previous" :{
        this.objectForm.setSelectedPage(event);
        let path = this.objectFormData[event.selectedPage].section;
        this.router.navigate([], { fragment: path });
        break;
      }
      case "cancel" : {
        if (this.mode == 'add') {
          this.router.navigate(['/falworkspace']);
        } else {
          this.router.navigate(['/programs',this.programId,'view']);
        }
        break;
      }
    }
  }//end of buttonhandler

}
