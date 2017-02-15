import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WrapperService {
    private APIs: any = {
        "opportunity": "/opps/v1/opportunities",
        "search": "/sgs/v1/search",
        "featuredSearch": "/sgs/v1/search/featured",
        "program": "/fac/v1/programs",
        "federalHierarchy": "/federalorganizations/v1/organizations",
        "entities": "/entities",
        "exclusions": "/exclusions",
        "alerts": "/alert/v2/alerts",
        "allAlerts": "/alert/v2/alerts/allAlerts",
        "suggestions": "/sgs/v1/suggestions",
        "access": "/rms/v1/access",
        "wageDetermination": "/wdol/v1/wd",
    };

    constructor(private _http: Http){}

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
    call(oApiParam: any) {
        let method: string = oApiParam.method;
        let oHeader = new Headers({});
        let oURLSearchParams = new URLSearchParams();

        //add API-Umbrella key
        oURLSearchParams.set("api_key", API_UMBRELLA_KEY);

        //loop through oParam & add them as request parameter
        for (var key in oApiParam.oParam) {
            oURLSearchParams.set(key, (typeof oApiParam.oParam[key] === 'object') ? JSON.stringify(oApiParam.oParam[key]) : oApiParam.oParam[key]);
        }

        var baseUrl = API_UMBRELLA_URL;
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

        return this._http.request(oRequest).map((res: Response) => { return res.json() } );
    }
}
