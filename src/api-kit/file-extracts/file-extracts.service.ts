import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";

@Injectable()
export class FileExtractsService {
  constructor(private apiService:WrapperService) {
  }

  getFilesList(domain){

  // let apiOptions: any = {
  //   name: 'fileExtracts',
  //   suffix: '',
  //   method: 'GET',
  //   oParam: {domain:domain}
  // };
  //
  // return this.apiService.call(apiOptions);

  return Observable.of({
    "_embedded": {
      "customS3ObjectSummaryList": [
        {
          "displayKey": "Assistance Listings",
          "dateModified": "22 May,2017",
          "bucketName": "falextracts",
          "key": "Assistance Listings/",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/Assistance Listings/"
            }
          }
        },
        {
          "displayKey": "Contract Awards",
          "dateModified": "22 May,2017",
          "bucketName": "falextracts",
          "key": "Contract Awards/",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/Contract Awards/"
            }
          }
        },
        {
          "displayKey": "Contract Opportunities",
          "dateModified": "22 May,2017",
          "bucketName": "falextracts",
          "key": "Contract Opportunities/",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/Contract Opportunities/"
            }
          }
        },
        {
          "displayKey": "Documentation",
          "dateModified": "22 May,2017",
          "bucketName": "falextracts",
          "key": "Documentation/",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/Documentation/"
            }
          }
        },
        {
          "displayKey": "Entity Information",
          "dateModified": "22 May,2017",
          "bucketName": "falextracts",
          "key": "Entity Information/",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/Entity Information/"
            }
          }
        },
        {
          "displayKey": "programs-full09164.csv",
          "dateModified": "17 May,2017",
          "bucketName": "falextracts",
          "key": "programs-full09164.csv",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/programs-full09164.csv"
            }
          }
        },
        {
          "displayKey": "sample.txt",
          "dateModified": "16 May,2017",
          "bucketName": "falextracts",
          "key": "sample.txt",
          "_links": {
            "self": {
              "href": "https://s3.amazonaws.com/falextracts/sample.txt"
            }
          }
        }
      ]
    },
    "_links": {
      "self": {
        "href": "https://71fileextractsservicecomp.apps.prod-iae.bsp.gsa.gov/fileextractservices/v1/api"
      }
    }
  });
}


}
