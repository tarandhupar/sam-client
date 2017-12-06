import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from '../../../../sam-ui-elements/src/ui-kit/types';
import { topics } from './topics';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';

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

  constructor(private http: Http) {

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
    // const headers: Headers = new Headers({'Content-Type': 'video/mp4'});
    // const options: RequestOptionsArgs = { headers: headers };
    // const url = "https://taran-test.s3.amazonaws.com/videos/test.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20171204T180358Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAJ7QJTKFV5HMJJ2KQ%2F20171204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=641f2ebaa1cd51e0a2e48b71a943eed3ec3eb77c458c042909f6ba8237fa1796";
    // this.http.put(url, this.file, options).subscribe(console.log);
  }
}
