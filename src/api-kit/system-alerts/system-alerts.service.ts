import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WrapperService } from '../wrapper/wrapper.service';


@Injectable()
export class SystemAlertsService {
    constructor(private oAPIService: WrapperService) {}

    getAll() {

      /// TODO: Uncomment me when the alert service is ready
      // let oApiParam = {
      //   name: 'alerts',
      //   suffix: '/',
      //   oParam: {
      //     size: 5
      //   },
      //   method: 'GET'
      // };
      //
      // return this.oAPIService.call(oApiParam);

      let error = {
        "title" : "The is an error",
        "summary" : "The systems will be down for a while. During this time you cannot search for new government opportunities. The system is expected to be back in no more than 2 week and no less then 48 hours. This error will go away where services are restored.",
        "category" : "outages",
        "description" : "The systems will be down for a while. During this time you cannot search for new government opportunities. The system is expected to be back in no more than 2 week and no less then 48 hours. This error will go away where services are restored.",
        "severity" : "ERROR",
        "begins" : "2016-11-01T20:03:09Z",
        "expires" : "2016-11-01T20:03:09Z",
        "published" : "2016-11-01T20:03:09Z"
      };

      let warning = {
        "title" : "The is an warning",
        "summary" : "The systems will be slow for a while",
        "category" : "outages",
        "description" : "This is the description",
        "severity" : "WARNING",
        "begins" : "2016-11-01T20:03:09Z",
        "expires" : "2016-11-01T20:03:09Z",
        "published" : "2016-11-01T20:03:09Z"
      };

      let info = {
        "title" : "The is information",
        "summary" : "The systems will have additional features tomorrow",
        "category" : "features",
        "description" : "This is the description",
        "severity" : "INFO",
        "begins" : "2016-11-01T20:03:09Z",
        "expires" : "2016-11-01T20:03:09Z",
        "published" : "2016-11-01T20:03:09Z"
      };

      return Observable.of([error, error, warning, info, info]);
    }
}
