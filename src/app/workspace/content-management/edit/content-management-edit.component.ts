import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IBreadcrumb, OptionsType } from "sam-ui-elements/src/ui-kit/types";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { SamTabComponent } from "sam-ui-elements/src/ui-kit/components/tabs/tabs.component";
import { LabelWrapper } from 'sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { AlertFooterService } from "../../../app-components/alert-footer/alert-footer.service";
require('aws-sdk/dist/aws-sdk');

@Component({
  templateUrl: './content-management-edit.template.html',
})
export class HelpContentManagementEditComponent {

  @ViewChild('editTab') editTab:SamTabComponent;
  @ViewChild('publicViewTab') publicViewTab:SamTabComponent;
  @ViewChild('inputFileWrapper') inputFileWrapper:LabelWrapper;

  private crumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { url: '', breadcrumb: '' },
    { breadcrumb: '' }
  ];

  title = "";
  pageTitle = "";
  curSection = "";

  validSections = ['data-dictionary', 'FAQ-repository', 'video-library'];

  existingDomains = [];
  domainOptions = [];
  errors = {
    title:'',
    description:''
  };

  responseText = '';
  keywords = '';
  isValidatePerformed = false;
  contentObj = {};
  inputFile:File;


  pageConfig = {
    'data-dictionary': {
      publicViewTag: 'Data Definition',
      sectionControl: {source: true, video: false},
      sectionText: ['Data Field', 'Definition'],
      breadCrumbText: 'Edit Definition',
    },
    'faq-repository': {
      publicViewTag: 'FAQ',
      sectionControl: {source: false, video: false},
      sectionText: ['Question', 'Response'],
      breadCrumbText: 'Edit Question',

    },
    'video-library': {
      publicViewTag: 'Video',
      sectionControl: {source: false, video: true},
      sectionText: ['Title', 'Description'],
      breadCrumbText: 'Edit Video',

    },
  };

  dataLoaded:boolean = false;
  mode:string = '';
  activeTab = 0;
  hasUnsavedChanges:boolean = true;

  sourceVideoDivClass = 'file-input-div';

  multiselectConfig = {
    keyProperty: 'key',
    valueProperty: 'value',
    categoryProperty: 'category',
  };
  domainMap = {};

  constructor(private _router:Router,
              private route: ActivatedRoute,
              private capitalPipe: CapitalizePipe,
              private contentManagementService: ContentManagementService,
              private msgFeedService: MsgFeedService,
              private alertFooter: AlertFooterService,
  ){}

  ngOnInit(){
    this.getExistingDomainOptions();
    this.route.params.subscribe(
      params => {
        if(!this.validateUrlParams(params)) this._router.navigateByUrl('/404');
        if(params['section'] !== this.curSection){
          this.curSection = params['section'];
          this.title = this.getSectionTitle(this.curSection);
          this.crumbs[1]['url'] = '/workspace/content-management/'+this.curSection;
          this.crumbs[1]['breadcrumb'] = this.title;
          this.crumbs[2]['breadcrumb'] = this.pageConfig[this.curSection.toLowerCase()]['breadCrumbText'];

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
      sourceVideoFile:'',
      domain:[],
      keywords:'',
      status:{status:'NEW'},
    };

    if(this.curSection.includes('data')) this.contentObj['source'] = '';
    this.responseText = this.contentObj['description'];
    this.keywords = this.contentObj['keywords'];
    this.dataLoaded= true;
  }

  loadExistingForm(id){
    this.contentManagementService.getContentItem(id).subscribe( data => {
      try{
        this.contentObj = data._embedded["contentDataWrapperList"][0].contentDataList[0];
        this.responseText = this.contentObj['description'];
        let tagNames = [];
        this.contentObj['tags'].forEach(e => {tagNames.push(e.tagKey)});
        this.keywords = tagNames.join(',');
        this.pageTitle = this.contentObj['title'];
        let domainNames = [];
        this.contentObj['domains'].forEach(e => {
          domainNames.push({key:e.domain_name,value:e.domain_name});
        });
        this.contentObj['domains'] = domainNames;
        if(this.curSection === 'video-library')this.contentObj['sourceVideoFile'] = '';
        this.dataLoaded= true;
      }catch(err){
        console.log(err);
      }

    });
  }

  onFilesChange(file : File){

    // load video URL only if it is a video file
    if(file.type.startsWith('video')){
      this.contentObj['sourceVideoFile']  = file.name;
      let fileURL = URL.createObjectURL(file);
      document.querySelector('video').src = fileURL;
      document.querySelector('video').autoplay = false;
      document.querySelector('video').pause();
      this.inputFile = file;
    }

  }

  onDeselectFile(){
    this.contentObj['sourceVideoFile']  = '';
    document.querySelector('video').src = '';
  }

  onPublishClick(){
    // POST data to server
    // Route back to search page
    if(this.validateForm()){
      // upload video file
      var AWSService = window.AWS;

      AWSService.config.accessKeyId = 'AKIAJ7QJTKFV5HMJJ2KQ';

      AWSService.config.secretAccessKey = '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';

      var bucket = new AWSService.S3({params: {Bucket: 'taran-test'}});

      var params = {Key: 'videos/'+this.inputFile.name, Body: this.inputFile};

      bucket.upload(params, (err, data) => {
        if(err){
          this.alertFooter.registerFooterAlert({
            title: "",
            description: "Failed to upload video to S3",
            type: 'error',
            timer: 3200
          });
        }else{
          this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
        }

      });
    }else{
      this.activeTab = 0;
    }
  }

  onSwitchTabs(tab){
    if(tab.title === 'Public View'){

      this.contentObj['keywords'] = this.keywords.split(',');
      this.pageTitle = this.contentObj['title'];
      this.activeTab = 1;

      // if(this.validateForm()){
      //   this.contentObj['keywords'] = this.keywords.split(',');
      //   this.pageTitle = this.contentObj['title'];
      //   this.formComplete = true;
      // } else{
      //   tab.active = false;
      //   this.formComplete = false;
      //   this.editTab.active = true;
      // }
    }else{
      this.activeTab = 0;
    }

    if(document.querySelector('video')) document.querySelector('video').pause();
  }


  getExistingDomainOptions(){
    this.domainOptions = [];
    this.msgFeedService.getDomains().subscribe(data =>{
      try{
        if(data._embedded['domainList'] && data._embedded['domainList'].length > 0) {
          data._embedded['domainList'].forEach(domain => {
            if (domain.isActive){
              this.domainOptions.push({value: domain.domainName, key: domain.domainName, name: domain.domainName});
              this.domainMap[domain.domainName] = domain.id;
            }
          });
        }
      }catch (error){
        console.log(error);
      }
    });
  }

  getUpdateDateStr(){
    return moment().utc().format('MMM DD, YYYY');
  }

  getDomainListStr(){
    let domainList = [];
    this.contentObj['domains'].forEach(e => {
      domainList.push(e['key']);
    });
    return domainList.join(', ');
  }

  cancelForm(){
    this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
  }

  submitForm() {

    if(this.validateForm()){
      this.contentObj['keywords'] = this.keywords.split(',');
      this.pageTitle = this.contentObj['title'];
      this.activeTab = 1;
    }

  }

  validateForm(): boolean{
    this.isValidatePerformed = true;
    let sourceVideoValid = this.isSourceVideoValid();
    this.errors['title'] = this.contentObj['title'] === ""?'Title cannot be empty':'';
    this.errors['description'] = this.contentObj['description'] === ""?'Description cannot be empty':'';

    if(this.inputFileWrapper){
      this.inputFileWrapper.errorMessage = !sourceVideoValid?'Source video cannot be empty':'';
      this.sourceVideoDivClass = sourceVideoValid?'file-input-div':'file-input-error-div';
    }

    if(this.contentObj['title'] === "" || this.contentObj['description'] === "") return false;

    return sourceVideoValid;
  }

  isCreateMode(){
    return this.mode === 'create';
  }

  isSourceVideoValid(): boolean{
    return (this.curSection === 'video-library' && this.contentObj['sourceVideoFile'] !== '') || this.curSection !== 'video-library';
  }

}
