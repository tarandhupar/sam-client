import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FHWrapperService {

  private API_KEY:string = "";
  private fhAPI_URLs = {
    "comp":"https://57federalhierarchyapicomp.apps.prod-iae.bsp.gsa.gov",
    "minc":"https://57federalhierarchyapiminc.apps.prod-iae.bsp.gsa.gov",
    "prodlike":"https://57federalhierarchyapiprodlike.apps.prod-iae.bsp.gsa.gov",
  };
  private APIs: any = {
    'federalCreateOrg':'/v1/organization',
    'federalHierarchy':'/v1/org'
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
    let env = API_UMBRELLA_URL.substr(API_UMBRELLA_URL.lastIndexOf('/')+1);

    //add Headers
    if(typeof oApiParam.headers !== undefined && typeof oApiParam.headers === "object" && oApiParam.headers !== null) {
      for (var key in oApiParam.headers) {
        oHeader.append(key, oApiParam.headers[key]);
      }
    }

    //disable API-Umbrella key for fh services
    //oURLSearchParams.set("api_key", this.API_KEY);

    //loop through oParam & add them as request parameter
    for (var key in oApiParam.oParam) {
      oURLSearchParams.set(key, (typeof oApiParam.oParam[key] === 'object') ? JSON.stringify(oApiParam.oParam[key]) : oApiParam.oParam[key]);
    }

    //Use fh api url

    var baseUrl = this.fhAPI_URLs[env];

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