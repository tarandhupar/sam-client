import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { SamTabComponent } from "sam-ui-kit/components/tabs/tabs.component";

@Component({
  templateUrl: './content-management-edit.template.html',
})
export class HelpContentManagementEditComponent {

  @ViewChild('editTab') editTab:SamTabComponent;

  private crumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { url: '', breadcrumb: '' },
    { breadcrumb: 'Edit Question' }
  ];

  title = "";
  pageTitle = "";
  curSection = "";

  validSections = ['data-dictionary', 'FAQ-repository'];

  existingDomains = [];
  errors = {
    title:'',
    description:''
  };

  responseText = '';
  keywords = '';

  contentObj = {};

  sectionControl = {
    'data-dictionary':{source: true},
    'faq-repository':{source: false},
  };

  publicViewTag = {
    'data-dictionary': 'Data Definition',
    'faq-repository': 'FAQ',
  };

  dataLoaded:boolean = false;
  mode:string = '';
  formComplete:boolean = false;
  hasUnsavedChanges:boolean = true;

  constructor(private _router:Router,
              private route: ActivatedRoute,
              private capitalPipe: CapitalizePipe,
              private contentManagementService: ContentManagementService
  ){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        if(params['section'] !== this.curSection){
          this.curSection = params['section'];
          this.title = this.getSectionTitle(this.curSection);
          this.crumbs[1]['url'] = '/workspace/content-management/'+this.curSection;
          this.crumbs[1]['breadcrumb'] = this.title;

          let queryParams = this.route.snapshot.queryParams;
          this.mode = queryParams['mode'];
          if(this.mode  === 'create'){
            this.loadEmptyForm();
          }else if(this.mode  === 'edit'){
            if(!queryParams['id']) this._router.navigateByUrl('/404');
            this.loadExistingForm(queryParams['id']);
          }else{
            this._router.navigateByUrl('/404');
          }
        }

      });

  }

  validateUrlParams(params):boolean{
    return this.validSections.indexOf(params['section']) !== -1;
  }

  getSectionTitle(section){
    let str_tokens = [];
    section.split('-').forEach( e => {
      str_tokens.push(e !== e.toUpperCase()? this.capitalPipe.transform(e):e);
    });
    return str_tokens.join(" ");
  }

  loadEmptyForm(){
    this.contentObj = {
      title:'',
      description:'',
      domain:[],
      keywords:'',
      type:'New',
    };

    if(this.curSection.includes('data')) this.contentObj['source'] = '';
    this.responseText = this.contentObj['description'];
    this.keywords = this.contentObj['keywords'];
    this.dataLoaded= true;
  }

  loadExistingForm(id){
    this.contentManagementService.getContentItem(id, this.curSection).subscribe( data => {
      this.contentObj = data;
      this.responseText = this.contentObj['description'];
      this.keywords = this.contentObj['keywords'].join(',');
      this.pageTitle = this.contentObj['title'];
      this.dataLoaded= true;
    });
  }

  onPublishClick(){
    // POST data to server
    // Route back to search page
    if(this.validateForm()){
      this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
    }
  }

  onSwitchTabs(tab){
    if(tab.title === 'Public View'){
      if(this.validateForm()){
        this.contentObj['keywords'] = this.keywords.split(',');
        this.pageTitle = this.contentObj['title'];
        this.formComplete = true;
      } else{
        tab.active = false;
        this.formComplete = false;
        this.editTab.active = true;
      }
    }else{
      this.formComplete = false;
    }
  }

  getExistingDomainOptions(){
    return [{value:'test', label:'test', name:'test'}];
  }

  getUpdateDateStr(){
    return moment().utc().format('MMM DD, YYYY');
  }

  cancelForm(){
    this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
  }

  submitForm() {

    if(this.validateForm()){
      this.contentObj['keywords'] = this.keywords.split(',');
      this.pageTitle = this.contentObj['title'];
      this.formComplete = true;
      this.hasUnsavedChanges = false;
    }

  }

  validateForm(): boolean{
    this.errors['title'] = this.contentObj['title'] === ""?'Title cannot be empty':'';
    this.errors['description'] = this.contentObj['description'] === ""?'Description cannot be empty':'';
    if(this.contentObj['title'] === "" || this.contentObj['description'] === "") return false;
    return true;
  }

  isCreateMode(){
    return this.mode === 'create';
  }

}
