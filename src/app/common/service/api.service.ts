import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {
  private APIs: any = {
    "search": "/v1/search",
  };

  constructor(private _http: Http){}

  /**
   * common function to perform an API CALL
   *
   * @param Object oApiParam {
    *          name: '',
    *          suffix: '',
    *          oParam: {},
    *          method: '' (GET|POST|PUT...)
    *      }
   * @returns Observable
   */
  call(oApiParam: any) {
    let method: string = oApiParam.method;
    let oHeader = new Headers({});
    let oURLSearchParams = new URLSearchParams();
    // let SEARCHAPI: string = "http://gsaiae-samdotgov-search-api-dev02.reisys.com";

    //loop through oParam & add them as request parameter
    for (var key in oApiParam.oParam) {
      oURLSearchParams.set(key, oApiParam.oParam[key]);
    }

    let jsonOption = {
      "search": oURLSearchParams,
      "method": RequestMethod.Get,
      "headers": oHeader,
      "body": "",
      //todo: find a way to pass environment varibles
      "url": process.env.SEARCHAPI + this.APIs[oApiParam.name] + ((oApiParam.suffix !== '') ? oApiParam.suffix : '' )
    };

    let oRequestOptions = new RequestOptions(jsonOption);
    let oRequest = new Request(oRequestOptions);

    console.log(jsonOption);
    return this._http.request(oRequest).map((res: Response) => { return res.json() } );
  }
}
