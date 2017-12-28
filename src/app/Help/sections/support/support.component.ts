import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from '../../../../sam-ui-elements/src/ui-kit/types';
import { topics } from './topics';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { S3Service } from '../../../../api-kit/s3/s3.service';
import { SamUploadComponent } from '../../../app-components/sam-upload/upload.component';

interface KeyValue {
  key: string;
  value: string;
}

@Component({
  templateUrl: './support.template.html',
})
export class SupportComponent implements OnInit {
  public crumbs: Array<IBreadcrumb> = [
    { url: '/help', breadcrumb: 'Help Center'},
    { breadcrumb: 'Customer Support'},
  ];

  public topic: KeyValue = null;
  public topicOptions: Array<KeyValue> = [];
  public topicHasHelpfulHint = false;
  public file: File;

  constructor(private http: Http, private s3: S3Service) {

  }

  onTopicChange() {
    if (this.topic && this.topic.value === 'Reset Password') {
      this.topicHasHelpfulHint = true;
    } else {
      this.topicHasHelpfulHint = false;
    }
  }

  ngOnInit() {
    this.topicOptions = topics.map((t, i) => ({key: ''+i, value: t}));
  }

  onSubmitClick() {
    const path = `videos/${this.file.name}`;
    this.s3.getSignedUrlForUpload(path).switchMap(
      url =>  { return this.s3.uploadFile(url, this.file); }
    ).subscribe(
      ret => {
        console.log(ret);
      },
      err => {
        console.error('failed to upload file: ', err);
      }
    );
  }

  onCancelClick(uploadComponent: SamUploadComponent) {
    const path = `videos/${this.file.name}`;
    this.s3.getSignedUrlForDelete(path).switchMap(url => {
      return this.s3.getSignedUrlForDelete(url);
    }).subscribe(
      ret => {
        uploadComponent.deselectFile();
        console.log(ret);
      },
      err => {
        console.error('failed to delete file: ', err);
      }
    );
  }
}
