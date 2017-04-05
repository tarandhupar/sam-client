import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WrapperService {
    private APIs: any = {
        "opportunity": "/opps/v1",
        "search": "/sgs/v1/search",
        "featuredSearch": "/sgs/v1/search/featured",
        "program": "/fac/v1/programs",
        "federalHierarchy": "/federalorganizations/v1/organizations",
        "entities": "/entities",
        "exclusions": "/exclusions",
        "awards": "/awards",
        "alerts": "/alert/v2/alerts",
        "allAlerts": "/alert/v2/alerts/allAlerts",
        "suggestions": "/sgs/v1/suggestions",
        "access": "/rms/v1/access",
        "functions": "/rms/v1/functions",
        "requestaccess": "/rms/v1/requestaccess",
        "accessstatus": "/rms/v1/accessstatus",
        "uiroles": "/rms/v1/uiroles",
        "domains": "/rms/v1/domains",
        "permissions": "/rms/v1/permissions",
        "wageDetermination": "/wdol/v1",
        "location": "/locationservices/v1/api",
        "domainDefinition" : "/rms/v1/domaindefinition",
        "feedback": "/feedback/v1"
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
    call(oApiParam: any, convertToJSON: boolean = true) {
        let method: string = oApiParam.method;
        let oHeader = new Headers({});
        let oURLSearchParams = new URLSearchParams();

        //add Headers
        if(typeof oApiParam.headers !== undefined && typeof oApiParam.headers === "object" && oApiParam.headers !== null) {
          for (var key in oApiParam.headers) {
            oHeader.append(key, oApiParam.headers[key]);
          }
        }

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

        return this._http.request(oRequest).map((res: Response) => { return (convertToJSON) ? res.json() : res; } );
    }
}
