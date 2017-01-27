import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertFooterService} from "../../app/alerts/alert-footer/alert-footer.service";
import {Observable} from "rxjs";

@Injectable()
export class WrapperService {
    private APIs: any = {
        "opportunity": "/opps/v1/opportunities",
        "search": "/sgs/v1/search",
        "featuredSearch": "/sgs/v1/search/featured",
        "program": "/fac/v1/programs",
        "federalHierarchy": "/federalorganizations/v1/organizations",
        "entities": "/entities",
        "exclusion": "http://localhost:8020/msam/v1/exclusions/S4MR3RCZN",
        //S4MR3R7D6
        "alerts": "/alert/v2/alerts",
        "allAlerts": "/alert/v2/alerts/allAlerts",
        "suggestions": "/sgs/v1/suggestions"
    };

    constructor(private _http: Http, private _alertFooter: AlertFooterService){}

  /**
    * common function to perform an API CALL
    *
    * @param Object oApiParam {
    *          name: '',
    *          suffix: '',
    *          oParam: {},
    *          body: {},
    *          method: '' (GET|POST|PUT...)
    *      }
    * @returns Observable
    */
    call(oApiParam: any, alertOnError: boolean = true) {
        let method: string = oApiParam.method;
        let oHeader = new Headers({});
        let oURLSearchParams = new URLSearchParams();

        //add API-Umbrella key
        oURLSearchParams.set("api_key", API_UMBRELLA_KEY);

        //loop through oParam & add them as request parameter
        for (var key in oApiParam.oParam) {
            oURLSearchParams.set(key, (typeof oApiParam.oParam[key] === 'object') ? JSON.stringify(oApiParam.oParam[key]) : oApiParam.oParam[key]);
        }

        var useReverseProxy = document.getElementsByTagName('html')[0].className == "ie9" ? true : false;
        var baseUrl = useReverseProxy ? "/ie_api" : API_UMBRELLA_URL;
        //TODO: Implement Post DATA to request
        let jsonOption = {
            "search": oURLSearchParams,
            "method": RequestMethod.Get,
            "headers": oHeader,
            "body": oApiParam.body,
            "url": baseUrl + this.APIs[oApiParam.name] + ((oApiParam.suffix !== '') ? oApiParam.suffix : '' )
        };

        switch (method.toUpperCase()){
            case "POST":
                jsonOption.method = RequestMethod.Post;
            break;
            case "PUT":
                jsonOption.method = RequestMethod.Put;
            break;
            case "PATCH":
                jsonOption.method = RequestMethod.Patch;
            break;
            case "DELETE":
                jsonOption.method = RequestMethod.Delete;
            break;
        }

        let oRequestOptions = new RequestOptions(jsonOption);
        let oRequest = new Request(oRequestOptions);

        let req = this._http.request(oRequest).map((res: Response) => { return res.json() } );

        if (alertOnError) {
          return req.catch(() => this.showFooter());
        } else {
          return req;
        }
    }

    showFooter(): any {
      this._alertFooter.registerFooterAlert({
        title:"A required service is unavailable",
        description:"",
        type:'error',
        timer:0
      });
      return Observable.throw(new Error("api error"));
    }
}
