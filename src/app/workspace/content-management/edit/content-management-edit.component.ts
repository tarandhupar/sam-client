import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumb } from 'sam-ui-elements/src/ui-kit/types';
import { ContentManagementService } from 'api-kit/content-management/content-management.service';
import { CapitalizePipe } from '../../../app-pipes/capitalize.pipe';
import { LabelWrapper } from 'sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { MsgFeedService } from 'api-kit/msg-feed/msg-feed.service';
import { AlertFooterService } from '../../../app-components/alert-footer/alert-footer.service';
import { CMSItemType, CMSMapping } from '../content-management-mapping';
import * as moment  from 'moment';
import { S3Service } from '../../../../api-kit/s3/s3.service';
import { Http } from '@angular/http';

enum TabIndex {
  EditView = 0,
  PublicView,
}

@Component({
  templateUrl: './content-management-edit.template.html',
})
export class HelpContentManagementEditComponent implements OnInit {
  @ViewChild('inputFileWrapper') inputFileWrapper: LabelWrapper;

  title = '';
  pageTitle = '';
  curSection = '';

  validSections = ['data-dictionary', 'FAQ-repository', 'video-library'];

  tagOptions = [];
  tagMap = {};
  existingDomains = [];
  domainOptions = [];
  errors = {
    title: '',
    description: '',
    video: '',
  };

  responseText = '';
  keywords = [];
  contentObj: any = {};
  inputFile: File;
  duration;
  originContentObj: any = {};

  pageConfig = {
    'data-dictionary': {
      publicViewTag: 'Glossary',
      sectionControl: {source: true, video: false},
      sectionText: ['Data Field', 'Definition'],
      breadCrumbText: 'Edit Definition',
      title : 'Please provide the glossary term',
      description: 'Please provide the complete definition of the glossary term',
      source: 'If this term has been defined by policy, cite your source including the name, ' +
      'section and approval date of the policy',
      domain: 'Select domain(s) to which this video can be associated. ' +
      'List of domains can be found here.',
      keywords: 'Provide keywords to be associated with the term. ' +
      'Key words are words or phrases that help to define what the term is about. ' +
      'E.g. if your term is about entity registration. Key words can be entity or registration or both. ' +
      'Please select from the list or add a new keyword',
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

  dataLoaded: boolean = false;
  mode: string = '';
  isContentCreated: boolean = false;
  activeTab = TabIndex.EditView;

  sourceVideoDivClass = 'file-input-div';

  multiselectConfig = {
    keyProperty: 'key',
    valueProperty: 'value',
    categoryProperty: 'category',
  };
  domainMap = {};
  cmsMapping = new CMSMapping();

  //bucket;
  thumbnailBolb;
  editVideo = false;

  uploadThumbnailKey = '';
  uploadVideoKey = '';

  crumbs: Array<IBreadcrumb> = [
    { url: '/help', breadcrumb: 'Help Center' },
    { url: '', breadcrumb: '' },
    { breadcrumb: '' }
  ];

  static getNameNoExtension(fn) {
    return fn.split('.').slice(0, -1).join('.');
  }

  constructor(private _router: Router,
              private route: ActivatedRoute,
              private capitalPipe: CapitalizePipe,
              private contentManagementService: ContentManagementService,
              private msgFeedService: MsgFeedService,
              private alertFooter: AlertFooterService,
              private s3: S3Service,
              private http: Http,
  ) { }

  ngOnInit() {
    this.getExistingDomainOptions();
    this.getExistingTagOptions('');
    this.route.params.subscribe(params => {
      let queryParams = this.route.snapshot.queryParams;

      if (!this.validateUrlParams(params) || !this.validateQueryParams(queryParams)) {
        console.warn('bad url');
        this._router.navigateByUrl('/404');
        return;
      }

      this.mode = queryParams.mode;
      this.curSection = params['section'];
      this.title = this.getSectionTitle();

      this.updateBreadCrumbs();

      if (this.mode  === 'create') {
        this.loadEmptyForm();
      } else if (this.mode  === 'edit') {
        this.loadExistingForm(queryParams.id, this.curSection);
      }
    });
  }

  updateBreadCrumbs() {
    this.crumbs[1].url = `/workspace/content-management/${this.curSection}`;
    this.crumbs[1].breadcrumb = this.title;
    this.crumbs[2].breadcrumb = this.getPageConfig().breadCrumbText;
  }

  getPageConfig() {
    return this.pageConfig[this.curSection.toLowerCase()] || {};
  }

  validateUrlParams(params): boolean {
    return this.validSections.indexOf(params['section']) !== -1;
  }

  validateQueryParams(params): boolean {
    const { mode, id } = params;
    return mode === 'create' || (mode === 'edit' && id);
  }

  getSectionTitle() {
    return this.getPageConfig().publicViewTag;
  }

  getKeywordsText() {
    return this.keywords.map(k => k.value).join(',');
  }

  loadEmptyForm() {
    this.contentObj = {
      title: '',
      description: '',
      sourceVideoFile: '',
      domain: [],
      keywords: [],
      status: {
        status: 'NEW'
      },
    };

    if (this.curSection.includes('data')) {
      this.contentObj['source'] = '';
    }
    this.responseText = this.contentObj['description'];
    this.keywords = this.contentObj['keywords'];
    this.dataLoaded = true;
  }



  loadExistingForm(id, section) {
    this.contentManagementService.getContentItem(id, section).subscribe( data => {
      try {
        this.originContentObj = data._embedded.contentDataWrapperList[0].contentDataList[0];
        this.contentObj = {
          title: this.originContentObj.title,
          description: this.originContentObj.description,
          sourceVideoFile: '',
          domain: [],
          keywords: [],
          status: this.originContentObj.status,
        };
        this.responseText = this.contentObj.description;
        this.originContentObj.tags.forEach(e => {
          this.keywords.push({key: e.tagKey, value: e.tagKey});
        });
        this.pageTitle = this.contentObj.title;
        if (this.originContentObj.domain) {
          this.originContentObj.domain.forEach(e => {
            this.contentObj.domain.push({
              key: this.getDomainName(e),
              value: this.getDomainName(e)
            });
          });
        }
        if (this.curSection === 'video-library') {
          this.contentObj.sourceVideoFile = '';
        }
        this.dataLoaded = true;
      } catch (err) {
        console.log(err);
      }

    });
  }

  onFilesChange(file: File) {
    // load video URL only if it is a video file
    if (file.type.startsWith('video')) {
      this.contentObj.sourceVideoFile = file.name;
      let fileURL = URL.createObjectURL(file);
      let previewVideo: HTMLVideoElement = document.querySelector('#previewVideo') as HTMLVideoElement;
      previewVideo.src = fileURL;
      previewVideo.autoplay = false;
      previewVideo.pause();
      this.inputFile = file;

      let thumbnailVideo: HTMLVideoElement =
        document.getElementById('video-for-thumbnail') as HTMLVideoElement;
      thumbnailVideo.preload = 'metadata';
      thumbnailVideo.src = fileURL;
      thumbnailVideo.autoplay = false;
      thumbnailVideo.pause();
      thumbnailVideo.onloadedmetadata = () => {
        this.duration = thumbnailVideo.duration;
      };
    }

  }

  onDeselectFile() {
    this.contentObj.sourceVideoFile  = '';
    (document.querySelector('#previewVideo') as HTMLVideoElement).src = '';
    this.duration = 0;
    this.inputFile = null;
  }

  onPublishClick() {
    // POST data to server
    // Route back to search page
    if (this.validateForm()) {
      if (this.isCreateMode()) {
        if (this.isContentCreated) {
          this.updateContent('PUBLISHED');
        } else {
          if (this.curSection === 'video-library') {
            this.createThumbnail();
          }
          this.createContent('PUBLISHED');
        }

      } else {
        if (this.inputFile != null && this.curSection === 'video-library') {
          this.createThumbnail();
        }
        this.updateContent('PUBLISHED');
      }
    } else {
      this.activeTab = TabIndex.EditView;
    }
  }

  onDeleteDraftClick() {
    this.originContentObj.activeStatus = false;
    this.contentManagementService.updateContent(this.originContentObj).subscribe(
      data => {
        this._router.navigateByUrl(`/workspace/content-management/${this.curSection}`);
      },
      err => {
        if (!err.errorCode) {
          this.showAlertMessage('Failed to delete draft data');
        } else {
          this.showAlertMessage(`Failed to update draft, error code: ${err.errorCode}. ${err.errorMessage}`);
        }
      }
    );
  }

  onSwitchTabs(tab) {
    let previewVideo = document.getElementById('previewVideo') as HTMLVideoElement;
    if (tab.title === 'Public View') {

      this.contentObj.keywords = this.keywords;
      this.pageTitle = this.contentObj.title;
      this.activeTab = TabIndex.PublicView;
      if (!this.isCreateMode() && this.inputFile == null) {
        previewVideo.src = this.originContentObj['sourceUrl'];
        previewVideo.autoplay = false;
        previewVideo.pause();
      }
    } else {
      this.activeTab = TabIndex.EditView;
    }

    if (previewVideo) {
      previewVideo.pause();
    }
  }

  onEditExistingVideoFile() {
    this.editVideo = true;
  }

  getExistingTagOptions(q) {
    this.contentManagementService.getTags(q).subscribe(data => {
      try {
        if (data._embedded.tagList && data._embedded.tagList.length > 0) {
          data._embedded.tagList.forEach(tag => {
            if (!this.tagMap.hasOwnProperty(tag.tagKey)) {
              this.tagOptions.push({value: tag.tagKey, key: tag.tagKey});
              this.tagMap[tag.tagKey] = tag.tagId;
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  getExistingDomainOptions() {
    this.domainOptions = [];
    this.msgFeedService.getDomains().subscribe(data => {
      try {
        Object.keys(data).forEach(domainId => {
          this.domainOptions.push({value: data[domainId], key: data[domainId], name: data[domainId]});
          this.domainMap[data[domainId]] = domainId;
        });

      } catch (error) {
        console.log(error);
      }
    });
  }

  getDomainName(domainId) {
    let domainName = '';
    Object.keys(this.domainMap).forEach( key => {
      if (this.domainMap[key] == domainId) {
        domainName = key;
      }
    });
    return domainName;
  }

  getUpdateDateStr() {
    return moment().utc().format('MMM DD, YYYY');
  }

  getDomainListStr() {
    let domainList = [];
    this.contentObj.domain.forEach(e => {
      domainList.push(e.key);
    });
    return domainList.join(', ');
  }

  cancelForm() {
    this._router.navigateByUrl('/workspace/content-management/' + this.curSection);
  }

  submitForm() {
    let previewVideo = document.getElementById('previewVideo') as HTMLVideoElement;

    this.setErrors();

    if (this.validateForm()) {
      this.contentObj.keywords = this.keywords;
      this.pageTitle = this.contentObj.title;
      this.activeTab = TabIndex.PublicView;
      if (this.curSection === 'video-library') {

        // Load preview video if it is in edit mode and no input file has been selected
        if (!this.isCreateMode() && this.inputFile == null) {
          previewVideo.src = this.originContentObj.sourceUrl;
          previewVideo.autoplay = false;
          previewVideo.pause();
        }

        // Create Thumbnail if it is in create mode or input file has been selected in edit mode
        if (this.isCreateMode() || !this.isCreateMode() && this.inputFile != null) {
          this.createThumbnail();
        }
      }

      if (this.isCreateMode()) {
        this.createContent('NEW');
      } else {
        this.cmsMapping.getStatusName(this.originContentObj['status']).toUpperCase() === 'NEW'
          ? this.updateContent('NEW')
          : this.updateContent('DRAFT');
      }
    } else {
      console.warn('form invalid');
    }

  }

  validateForm(): boolean {
    return this.contentObj.title && this.contentObj.description && this.isSourceVideoValid();
  }

  setErrors() {
    this.errors.title = this.contentObj.title ? '' : 'Title cannot be empty';
    this.errors.description = this.contentObj.description ? '' : 'Description cannot be empty';
    this.errors.video = this.contentObj.sourceVideoFile ? '' : 'Source video cannot be empty';
    this.sourceVideoDivClass = this.contentObj.sourceVideoFile ? 'file-input-div' : 'file-input-error-div';
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isSourceVideoValid(): boolean {
    return !this.isCreateMode() || this.curSection !== 'video-library' || this.contentObj.sourceVideoFile;
  }

  createVideoContent(contentData, status) {
    if (this.inputFile == null) {
      this.createVideoContentPostProcess(contentData, status);
      return;
    }

    const now = moment().toISOString();
    const fileNameNoExtension = HelpContentManagementEditComponent.getNameNoExtension(this.inputFile.name);
    const thumbnailPath = `videos/thumbnails/${now}/${fileNameNoExtension}.png`;
    const videoPath = `videos/${now}/${this.inputFile.name}`;

    const uploadThumbnail$ = this.s3.getSignedUrlForUpload(thumbnailPath).flatMap(url => this.http.put(url, this.thumbnailBolb));
    const uploadVideo$ = this.s3.getSignedUrlForUpload(videoPath).flatMap(url => this.http.put(url, this.inputFile));
    // const deleteThumbnail$ = this.s3.getSignedUrlForDelete(videoPath).flatMap(url => this.http.delete(url));
    // const deleteVideo$ = this.s3.getSignedUrlForDelete(videoPath).flatMap(url => this.http.delete(url));
    // const deleteVideoAndThumbnail$ = Observable.merge(deleteThumbnail$, deleteVideo$);

    uploadThumbnail$
      .flatMap((res) => uploadVideo$ )
      .subscribe(
      res => {
        console.log('Upload success:', res);
        contentData.sourceUrl = videoPath;
        contentData.thumbnailUrl = thumbnailPath;
        contentData.duration = '' + this.duration;
        this.createVideoContentPostProcess(contentData, status);
      },
      err => {
        console.error('Upload failed:', err);
      },
      () => {
        console.log('timedout?');
      }
    );
  }

  createVideoContentPostProcess = (contentData, status) => {
    if (this.isCreateMode()) {
      contentData['status'] = this.cmsMapping.getStatusId(status);
      this.isContentCreated ? this.putContentData(contentData) : this.postContentData(contentData);
    } else {
      if (status === 'DRAFT' && this.cmsMapping.getStatusName(contentData['status']) === 'PUBLISHED') {
        contentData.status = this.cmsMapping.getStatusId(status);
        contentData.activeStatus = true;
        delete contentData.contentId;
        this.postContentData(contentData);
      } else {
        contentData.status = this.cmsMapping.getStatusId(status);
        this.putContentData(contentData);
      }
    }
  };

  createContent(status) {
    let contentData: any = {
      activeStatus: true,
      description: this.contentObj.description,
      status: this.cmsMapping.getStatusId(status),
      title: this.contentObj.title,
      type: this.cmsMapping.getTypeId(this.curSection.toLowerCase()),
      domain: [],
      tags: []
    };

    if (this.contentObj.domain.length > 0) {
      this.contentObj.domain.forEach( domain => {
        contentData.domain.push(this.domainMap[domain.value]);
      });
    }

    if (this.keywords.length > 0) {
      this.keywords.forEach( tag => {
        contentData['tags'].push({
          tagId: this.tagMap[tag.value],
          tagKey: tag.value
        });
      });
    }
    if (this.curSection.toLowerCase() === 'video-library') {
      this.createVideoContent(contentData, status);
    } else {
      this.postContentData(contentData);
    }
  }

  postContentData(contentData) {
    this.contentManagementService.createContent(contentData).subscribe(
      data => {
        this.isContentCreated = true;
        this.originContentObj = data;
        if (contentData.status === CMSItemType.PUBLISHED) {
          this._router.navigateByUrl('/workspace/content-management/' + this.curSection);
        } else {
          this.alertFooter.registerFooterAlert({
            title: '',
            description: 'Successfully created content data',
            type: 'success',
            timer: 3200
          });
        }
      },
      err => {
        // Delete the video on the S3 bucket here
        if (this.curSection ===  'video-library' && this.uploadThumbnailKey !== '' && this.uploadVideoKey !== '') {
          this.deleteFileFromS3Bucket(this.uploadThumbnailKey);
          this.deleteFileFromS3Bucket(this.uploadVideoKey);
        }

        if (err.errorCode == null) {
          this.showAlertMessage('Failed to create content data');
        } else {
          this.showAlertMessage('Failed to create content, error code: ' + err.errorCode + '. ' + err.errorMessage );
        }
      }
    );
  }

  updateContent(status) {
    this.originContentObj['title'] = this.contentObj['title'];
    this.originContentObj['description'] = this.contentObj['description'];
    if (this.contentObj['domain']) {
      this.originContentObj['domain'] = [];
      this.contentObj['domain'].forEach(domain => {
        this.originContentObj['domain'].push(this.domainMap[domain.value]);
      });
    }
    if (this.keywords.length > 0) {
      this.originContentObj['tags'] = [];
      this.keywords.forEach( tag => {
        this.originContentObj['tags'].push({
          tagId: this.tagMap[tag.value],
          tagKey: tag.value
        });
      });
    }

    if (this.curSection.toLowerCase() === 'video-library' && this.contentObj['sourceVideoFile'] !== '') {
      this.createVideoContent(this.originContentObj, status);
    } else {
      if (status === 'DRAFT' && this.cmsMapping.getStatusName(this.originContentObj['status']) === 'PUBLISHED') {
        this.originContentObj['status'] = this.cmsMapping.getStatusId(status);
        this.originContentObj['activeStatus'] = true;
        delete this.originContentObj['contentId'];
        this.postContentData(this.originContentObj);
      } else {
        this.originContentObj['status'] = this.cmsMapping.getStatusId(status);
        this.putContentData(this.originContentObj);
      }
    }
  }

  putContentData(contentData) {
    this.contentManagementService.updateContent(contentData).subscribe(
      data => {
        if (contentData.status === CMSItemType.PUBLISHED) {
          this._router.navigateByUrl(`/workspace/content-management/${this.curSection}`);
        }
      },
      err => {
        if (this.curSection === 'video-library' && this.uploadThumbnailKey !== '' && this.uploadVideoKey !== '') {
          // this.deleteFileFromS3Bucket(this.uploadThumbnailKey);
          // this.deleteFileFromS3Bucket(this.uploadVideoKey);
        }
        if (err.errorCode == null) {
          this.showAlertMessage('Failed to update content data');
        } else {
          this.showAlertMessage('Failed to update content, error code: ' + err.errorCode + '. ' + err.errorMessage );
        }
      }
    );
  }

  onEnterTagKey() {
    let newTagKey = this.keywords[this.keywords.length - 1]['value'];
    if (!this.tagMap.hasOwnProperty(newTagKey)) {
      this.contentManagementService.createTag(newTagKey).subscribe(
        data => {
          try {
            this.tagMap[data.tagKey] = data.tagId;
          } catch (err) {
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

  showAlertMessage(message) {
    this.alertFooter.registerFooterAlert({
      title: '',
      description: message,
      type: 'error',
      timer: 3200
    });
  }

  createThumbnail() {
    let video = document.getElementById('video-for-thumbnail') as HTMLVideoElement;
    let w = video.offsetWidth;
    let h = video.offsetHeight;
    let canvas = document.createElement('canvas');

    canvas.width = w;
    canvas.height = h;

    canvas.getContext('2d').drawImage(video, 0, 0, w, h);
    let dataURI = canvas.toDataURL('image/png');
    this.thumbnailBolb = this.dataURItoBlob(dataURI);
  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }
}
