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
import { CMSMapping } from "../content-management-mapping";
import * as moment  from "moment";

require('aws-sdk/dist/aws-sdk');

@Component({
  templateUrl: './content-management-edit.template.html',
})
export class HelpContentManagementEditComponent {
  @ViewChild('inputFileWrapper') inputFileWrapper:LabelWrapper;

  private crumbs: Array<IBreadcrumb> = [
    { url: '/help', breadcrumb: 'Help Center' },
    { url: '', breadcrumb: '' },
    { breadcrumb: '' }
  ];

  title = "";
  pageTitle = "";
  curSection = "";

  validSections = ['data-dictionary', 'FAQ-repository', 'video-library'];

  tagOptions = [];
  tagMap = {};
  existingDomains = [];
  domainOptions = [];
  errors = {
    title:'',
    description:''
  };

  responseText = '';
  keywords = [];
  isValidatePerformed = false;
  contentObj = {};
  inputFile:File;
  duration;
  originContentObj = {};

  pageConfig = {
    'data-dictionary': {
      publicViewTag: 'Data Definition',
      sectionControl: {source: true, video: false},
      sectionText: ['Data Field', 'Definition'],
      breadCrumbText: 'Edit Definition',
      title : 'Please provide the glossary term',
      description: 'Please provide the complete definition of the glossary term',
      source: 'If this term has been defined by policy, cite your source including the name, section and approval date of the policy',
      domain: 'Select domain(s) to which this video can be associated. List of domains can be found here.',
      keywords: 'Provide keywords to be associated with the term. Key words are words or phrases that help to define what the term is about. E.g. if your term is about entity registration. Key words can be entity or registration or both. Please select from the list or add a new keyword',
    },
    'faq-repository': {
      publicViewTag: 'FAQ',
      sectionControl: {source: false, video: false},
      sectionText: ['Question', 'Response'],
      breadCrumbText: 'Edit Question',
      title : 'Please provide the FAQ',
      description: 'Please provide the complete answer for the FAQ',
      source: '',
      domain: 'Select domain(s) to which this video can be associated. List of domains can be found here.',
      keywords: 'Provide keywords to be associated with the FAQ. Key words are words or phrases that help to define what the FAQ is about. E.g. if your FAQ is about entity registration. Key words can be entity or registration or both. Please select from the list or add a new keyword',
    },
    'video-library': {
      publicViewTag: 'Video',
      sectionControl: {source: false, video: true},
      sectionText: ['Title', 'Description'],
      breadCrumbText: 'Edit Video',
      title : 'Please provide a name for the video',
      description: 'Please provide a short description about the video',
      source: '',
      domain: 'Select domain(s) to which this video can be associated. List of domains can be found here.',
      keywords: 'Provide keywords to be associated with the video. Key words are words or phrases that help to define what the video is about. E.g. if your video is about entity registration. Key words can be entity or registration or both. Please select from the list or add a new keyword',

    },
  };

  dataLoaded:boolean = false;
  mode:string = '';
  isContentCreated: boolean = false;
  activeTab = 0;

  sourceVideoDivClass = 'file-input-div';

  multiselectConfig = {
    keyProperty: 'key',
    valueProperty: 'value',
    categoryProperty: 'category',
  };
  domainMap = {};
  cmsMapping = new CMSMapping();

  bucket;
  thumbnailBolb;
  editVideo = false;

  uploadThumbnailKey = '';
  uploadVideoKey = '';

  constructor(private _router:Router,
              private route: ActivatedRoute,
              private capitalPipe: CapitalizePipe,
              private contentManagementService: ContentManagementService,
              private msgFeedService: MsgFeedService,
              private alertFooter: AlertFooterService
  ){}

  ngOnInit(){
    this.getExistingDomainOptions();
    this.getExistingTagOptions('');
    this.setupS3Bucket();
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
            this.loadExistingForm(queryParams['id'], this.curSection);
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

  getKeywordsText(){
    let keywordsTexts = [];
    this.keywords.forEach(tag => {
      keywordsTexts.push(tag.value);
    });
    return keywordsTexts.join(',');
  }

  loadEmptyForm(){
    this.contentObj = {
      title:'',
      description:'',
      sourceVideoFile:'',
      domain:[],
      keywords:[],
      status:{status:'NEW'},
    };

    if(this.curSection.includes('data')) this.contentObj['source'] = '';
    this.responseText = this.contentObj['description'];
    this.keywords = this.contentObj['keywords'];
    this.dataLoaded= true;
  }



  loadExistingForm(id, section){
    this.contentManagementService.getContentItem(id, section).subscribe( data => {
      try{
        this.originContentObj = data._embedded["contentDataWrapperList"][0].contentDataList[0];
        this.contentObj = {
          title:this.originContentObj['title'],
          description:this.originContentObj['description'],
          sourceVideoFile:'',
          domain:[],
          keywords:[],
          status:this.originContentObj['status'],
        };
        this.responseText = this.contentObj['description'];
        this.originContentObj['tags'].forEach(e => {this.keywords.push({key:e.tagKey, value:e.tagKey})});
        this.pageTitle = this.contentObj['title'];
        if(this.originContentObj['domain']){
          this.originContentObj['domain'].forEach(e => {
            this.contentObj['domain'].push({key:this.getDomainName(e),value:this.getDomainName(e)});
          });
        }
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
      var previewVideo = document.querySelector('#previewVideo');
      previewVideo.src = fileURL;
      previewVideo.autoplay = false;
      previewVideo.pause();
      this.inputFile = file;

      var thumbnailVideo = document.getElementById('video-for-thumbnail');
      thumbnailVideo.preload = 'metadata';
      thumbnailVideo.src = fileURL;
      thumbnailVideo.autoplay = false;
      thumbnailVideo.pause();
      thumbnailVideo.onloadedmetadata = () => {
        this.duration = thumbnailVideo.duration;
      };
    }

  }

  onDeselectFile(){
    this.contentObj['sourceVideoFile']  = '';
    document.querySelector('#previewVideo').src = '';
    this.duration = 0;
    this.inputFile = null;
  }

  onPublishClick(){
    // POST data to server
    // Route back to search page
    if(this.validateForm()){
      if(this.isCreateMode()){
        if(this.isContentCreated){
          this.updateContent('PUBLISHED')
        } else {
          if(this.curSection == 'video-library')this.createThumbnail();
          this.createContent('PUBLISHED');
        }

      }else{
        if( this.inputFile != null && this.curSection == 'video-library'){
          this.createThumbnail();
        }
        this.updateContent('PUBLISHED');
      }
    }else{
      this.activeTab = 0;
    }
  }

  onDeleteDraftClick(){
    // Delete the Draft
    this.originContentObj['activeStatus'] = false;
    let thumbnailURL = this.originContentObj['thumbnailUrl'];
    let videoURL = this.originContentObj['sourceUrl'];
    this.contentManagementService.updateContent(this.originContentObj).subscribe(
      data => {
        // this.deleteFileFromS3Bucket();
        this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
      },
      err => {
        if(err.errorCode == null){
          this.showAlertMessage('Failed to delete draft data');
        }else{
          this.showAlertMessage('Failed to update draft, error code: ' + err.errorCode +'. ' + err.errorMessage );
        }
      }
    );
  }

  onSwitchTabs(tab){
    var previewVideo = document.getElementById('previewVideo');
    if(tab.title === 'Public View'){

      this.contentObj['keywords'] = this.keywords;
      this.pageTitle = this.contentObj['title'];
      this.activeTab = 1;
      if(!this.isCreateMode() && this.inputFile == null){
        previewVideo.src = this.originContentObj['sourceUrl'];
        previewVideo.autoplay = false;
        previewVideo.pause();
      }
    }else{
      this.activeTab = 0;
    }

    if(previewVideo) previewVideo.pause();
  }

  onEditExistingVideoFile(){
    this.editVideo = true;
  }

  getExistingTagOptions(q){
    this.contentManagementService.getTags(q).subscribe(data =>{
      try{
        if(data._embedded['tagList'] && data._embedded['tagList'].length > 0) {
          data._embedded['tagList'].forEach(tag => {
            if(!this.tagMap.hasOwnProperty(tag.tagKey)){
              this.tagOptions.push({value: tag.tagKey, key: tag.tagKey});
              this.tagMap[tag.tagKey] = tag.tagId;
            }
          });
        }
      }catch (error){
        console.log(error);
      }
    });
  }

  getExistingDomainOptions(){
    this.domainOptions = [];
    this.msgFeedService.getDomains().subscribe(data =>{
      try{
        Object.keys(data).forEach(domainId => {
          this.domainOptions.push({value: data[domainId], key: data[domainId], name: data[domainId]});
          this.domainMap[data[domainId]] = domainId;
        });

      }catch (error){
        console.log(error);
      }
    });
  }

  getDomainName(domainId){
    let domainName = '';
    Object.keys(this.domainMap).forEach( key => {
      if(this.domainMap[key] == domainId) domainName = key;
    });
    return domainName;
  }

  getUpdateDateStr(){
    return moment().utc().format('MMM DD, YYYY');
  }

  getDomainListStr(){
    let domainList = [];
    this.contentObj['domain'].forEach(e => {
      domainList.push(e['key']);
    });
    return domainList.join(', ');
  }

  cancelForm(){
    this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
  }

  submitForm() {
    var previewVideo = document.getElementById('previewVideo');

    if(this.validateForm()){
      this.contentObj['keywords'] = this.keywords;
      this.pageTitle = this.contentObj['title'];
      this.activeTab = 1;
      if(this.curSection == 'video-library'){

        // Load preview video if it is in edit mode and no input file has been selected
        if(!this.isCreateMode() && this.inputFile == null){
          previewVideo.src = this.originContentObj['sourceUrl'];
          previewVideo.autoplay = false;
          previewVideo.pause();
        }

        // Create Thumbnail if it is in create mode or input file has been selected in edit mode
        if(this.isCreateMode() || !this.isCreateMode() && this.inputFile != null){
          this.createThumbnail();
        }
      }

      if(this.isCreateMode()){
        this.createContent('NEW');
      }else{
        this.cmsMapping.getStatusName(this.originContentObj['status']).toUpperCase() === 'NEW'? this.updateContent('NEW'):this.updateContent('DRAFT');
      }
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
    return (this.isCreateMode() && this.curSection === 'video-library' && this.contentObj['sourceVideoFile'] !== '') || !this.isCreateMode() || this.curSection !== 'video-library';
  }

  createVideoContent(contentData, status){
    if(this.inputFile == null){
      this.createVideoContentPostProcess(contentData, status);
      return;
    }

    var chunks = this.inputFile.name.split('.');
    chunks.pop();
    var fileNameNoExtension = chunks[0];

    this.uploadThumbnailKey = 'videos/thumbnails/' + moment().toISOString() + '/' + fileNameNoExtension + '.png';
    this.uploadVideoKey = 'videos/' + moment().toISOString() + '/'  + this.inputFile.name;
    var thumbnailParams = {Key: this.uploadThumbnailKey, Body: this.thumbnailBolb, ACL:'public-read'};
    var videoParams = {Key: this.uploadVideoKey, Body: this.inputFile, ACL:'public-read'};

    this.bucket.upload(thumbnailParams, (err, data) => {
      if(err) {
        this.showAlertMessage("Failed to upload video thumbnail to S3 bucket");
      }else{
        contentData['thumbnailUrl'] = data.Location;
        // upload video
        this.bucket.upload(videoParams, (err, data) => {
          if(err){
            // Delete the uploaded thumbnail
            this.deleteFileFromS3Bucket(this.uploadThumbnailKey);
            this.showAlertMessage("Failed to upload video to S3 bucket");
          }else{
            // POST video content here
            contentData['sourceUrl'] = data.Location;
            contentData['duration'] = this.duration+'';
            this.createVideoContentPostProcess(contentData, status);
          }
        });
      }

    });


  }

  createVideoContentPostProcess = (contentData, status) => {
    if(this.isCreateMode()){
      contentData['status'] = this.cmsMapping.getStatusId(status);
      this.isContentCreated? this.putContentData(contentData): this.postContentData(contentData);
    }else{
      if(status === 'DRAFT' && this.cmsMapping.getStatusName(contentData['status']) === 'PUBLISHED'){
        contentData['status'] = this.cmsMapping.getStatusId(status);
        contentData['activeStatus'] = true;
        delete contentData['contentId'];
        this.postContentData(contentData);
      }else{
        contentData['status'] = this.cmsMapping.getStatusId(status);
        this.putContentData(contentData);
      }
    }
  };

  createContent(status){
    let contentData = {
      "activeStatus": true,
      "description": this.contentObj['description'],
      "status": this.cmsMapping.getStatusId(status),
      "title": this.contentObj['title'],
      "type": this.cmsMapping.getTypeId(this.curSection.toLowerCase()),
      "domain": [],
      "tags": []
    };

    if(this.contentObj['domain'].length > 0){
      this.contentObj['domain'].forEach( domain => {contentData['domain'].push(this.domainMap[domain.value]);});
    }

    if(this.keywords.length > 0){
      this.keywords.forEach( tag => {contentData['tags'].push({tagId:this.tagMap[tag.value], tagKey:tag.value});});
    }
    if(this.curSection.toLowerCase() === 'video-library'){
      this.createVideoContent(contentData, status);
    }else{
      this.postContentData(contentData);
    }
  }

  postContentData(contentData){
    this.contentManagementService.createContent(contentData).subscribe(
      data => {
        this.isContentCreated = true;
        this.originContentObj = data;
        if(contentData['status'] === 2) {
          this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
        }else{
          this.alertFooter.registerFooterAlert({title: "", description: "Successfully created content data", type: 'success', timer: 3200});
        }
      },
      err => {
        // Delete the video on the S3 bucket here
        if(this.curSection ==  'video-library' && this.uploadThumbnailKey !== '' && this.uploadVideoKey !== ''){
          this.deleteFileFromS3Bucket(this.uploadThumbnailKey);
          this.deleteFileFromS3Bucket(this.uploadVideoKey)
        }

        if(err.errorCode == null){
          this.showAlertMessage('Failed to create content data');
        }else{
          this.showAlertMessage('Failed to create content, error code: ' + err.errorCode +'. ' + err.errorMessage );
        }
      }
    );
  }

  updateContent(status){
    this.originContentObj['title'] = this.contentObj['title'];
    this.originContentObj['description'] = this.contentObj['description'];
    if(this.contentObj['domain']){
      this.originContentObj['domain'] = [];
      this.contentObj['domain'].forEach( domain => {this.originContentObj['domain'].push(this.domainMap[domain.value]);});
    }
    if(this.keywords.length > 0){
      this.originContentObj['tags'] = [];
      this.keywords.forEach( tag => {this.originContentObj['tags'].push({tagId:this.tagMap[tag.value], tagKey:tag.value});});
    }

    if(this.curSection.toLowerCase() === 'video-library' && this.contentObj['sourceVideoFile'] !== ''){
      this.createVideoContent(this.originContentObj, status);
    }else{
      if(status === 'DRAFT' && this.cmsMapping.getStatusName(this.originContentObj['status']) === 'PUBLISHED'){
        this.originContentObj['status'] = this.cmsMapping.getStatusId(status);
        this.originContentObj['activeStatus'] = true;
        delete this.originContentObj['contentId'];
        this.postContentData(this.originContentObj);
      }else{
        this.originContentObj['status'] = this.cmsMapping.getStatusId(status);
        this.putContentData(this.originContentObj);
      }
    }
  }

  putContentData(contentData) {
    this.contentManagementService.updateContent(contentData).subscribe(
      data => {
        if(contentData['status'] === 2) this._router.navigateByUrl('/workspace/content-management/'+this.curSection);
      },
      err => {
        if(this.curSection ==  'video-library' && this.uploadThumbnailKey !== '' && this.uploadVideoKey !== ''){
          this.deleteFileFromS3Bucket(this.uploadThumbnailKey);
          this.deleteFileFromS3Bucket(this.uploadVideoKey)
        }
        if(err.errorCode == null){
          this.showAlertMessage('Failed to update content data');
        }else{
          this.showAlertMessage('Failed to update content, error code: ' + err.errorCode +'. ' + err.errorMessage );
        }
      }
    );
  }

  onEnterTagKey(){
    let newTagKey = this.keywords[this.keywords.length-1]['value'];
    if(!this.tagMap.hasOwnProperty(newTagKey)){
      this.contentManagementService.createTag(newTagKey).subscribe(
        data => {
          try{
            this.tagMap[data.tagKey] = data.tagId;
          }catch(err){
            this.keywords.pop();
          }
        },
        err => {
          this.showAlertMessage('Failed to create a new Tag');
          this.keywords.pop();
        }
      );
    }

  }

  showAlertMessage(message){
    this.alertFooter.registerFooterAlert({
      title: "",
      description: message,
      type: 'error',
      timer: 3200
    });
  }

  createThumbnail(){
    var video = document.getElementById('video-for-thumbnail');
    let dimension = {width: video.offsetWidth, height:video.offsetHeight};
    var canvas = document.createElement("canvas");

    canvas.width = dimension.width;
    canvas.height = dimension.height;

    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    var dataURI = canvas.toDataURL('image/png');
    this.thumbnailBolb = this.dataURItoBlob(dataURI);

  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }


  setupS3Bucket(){

    var AWSService = window.AWS;

    AWSService.config.accessKeyId = 'AKIAJ7QJTKFV5HMJJ2KQ';

    AWSService.config.secretAccessKey = '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';

    this.bucket = new AWSService.S3({params: {Bucket: 'taran-test'}});

  }

  deleteFileFromS3Bucket(FileDirectory){
    var params = {Bucket: 'taran-test', Key: FileDirectory};

    this.bucket.deleteObject(params, (err, data) => {
      if(err){
        this.showAlertMessage('Failed to delete file from s3 at: ' + FileDirectory);
      }
    });
  }

}
