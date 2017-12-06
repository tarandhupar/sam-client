import { Injectable } from '@angular/core';

const AWS = window.AWS;
const AccessKeyId: string = 'AKIAJ7QJTKFV5HMJJ2KQ';
const SecretAccessKey: string = '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';
const TestBucketName: string = 'taran-test';

@Injectable()
export class AWSService {

  static NewTestBucket() {
    const params = { params: {Bucket: TestBucketName } };
    return new AWS.S3(params);
  }

  constructor() {

  }

}
