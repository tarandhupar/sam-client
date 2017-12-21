import {Injectable} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  Request,
  RequestMethod,
  Response,
  URLSearchParams,
  QueryEncoder,
  RequestOptionsArgs,
  ResponseContentType
} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';

export interface ApiParameters {
  name?: string;
  // method defaults to 'GET', options: 'POST'|'post'|'PUT'|'put'|'PATCH'|'patch'|'DELETE'|'delete'|'GET'|'get',
  method?: string;
  headers?: {[key: string]: string };
  oParam?: {[key: string|number]: any };
  body?: any;
  prefix?: string;
  suffix?: string;
  responseType?: ResponseContentType;
}

@Injectable()
export class WrapperService {
    public APIs: any = {
        'opportunity': '/opps/v1',
        'contractOpportunity': '/opps/v2',
        'search': '/sgs/v1/search',
        'featuredSearch': '/sgs/v1/search/featured',
        'savedSearch': '/preferences/v1/search',
        'program': '/fac/v1/programs',
        'fh' : '/federalorganizations/v1',
        'fhDetail': '/federalorganizations/v2',
        'federalHierarchy': '/federalorganizations/v1/organizations',
        'federalCreateOrg': '/federalorganizations/v1/organization',
        'federalHierarchyActive': '/federalorganizations/v1/activeorganizations',
        'featureToggle': '/feature/v1/read',
        'entities': '/entities',
        'exclusions': '/exclusions',
        'awards': '/awards',
        'alerts': '/alert/v2/alerts',
        'allAlerts': '/alert/v2/alerts/allAlerts',
        'suggestions': '/sgs/v1/suggestions',
        'functions': '/rms/v1/functions',
        'requestaccess': '/rms/v1/requestaccess',
        'accessstatus': '/rms/v1/accessstatus',
        'uiroles': '/rms/v2/uiroles',
        'permissions': '/rms/v1/permissions',
        'wageDetermination': '/wdol/v1',
        'location': '/locationservices/v1/api',
        'domainDefinition' : '/rms/v1/domaindefinition',
        'feedback': '/feedback/v1',
        'rms': '/rms/v1',
        'rms2': '/rms/v2',
        'relatedPrograms': '/fac/v1/programs/relatedprograms',
        'aac': '/aac/v1',
        'aac2': '/v2/aac',
        'searchDictionaries': '/sgs/v1/dictionaries',
        'preferences': '/preferences',
        'fileExtracts': '/fileextractservices/v1/api/listfiles',
        'userPicker': '/picker/v2/users',
        'iam': '/iam/auth/v4',
		    'watchlist': '/watchlistservice/v1/api/recorddetail',
        'subscriptions': '/watchlistservice/v1/api/subscriptions',
        'myFeeds': '/feeds/v1',
        'gettoggeServices': '/feature/v1/',
        'cms': '/content/v1',
    };

  constructor(private _http: Http) { }

  /**
   * common function to perform an API CALL
   *
   * @returns Observable
   */
  call(oApiParam: ApiParameters, convertToJSON: boolean = true, queryEncoder: QueryEncoder = null) {
    const method: string = oApiParam.method || 'GET';
    const headerObject = oApiParam.headers || {};
    let oHeader = new Headers(headerObject);
    let oURLSearchParams = new URLSearchParams();
    if (queryEncoder) {
      oURLSearchParams = new URLSearchParams('', queryEncoder);
    }

    // add API-Umbrella key
    oURLSearchParams.set('api_key', API_UMBRELLA_KEY);

    // loop through oParam & add them as request parameter
    for (let key in oApiParam.oParam) {
        oURLSearchParams.set(key, (typeof oApiParam.oParam[key] === 'object') ? JSON.stringify(oApiParam.oParam[key]) : oApiParam.oParam[key]);
    }

    const prefix = oApiParam.prefix || '';
    const middle = oApiParam.name ? this.APIs[oApiParam.name] : '';
    const suffix = oApiParam.suffix || '';
    let jsonOption: RequestOptionsArgs = {
        'search': oURLSearchParams,
        'method': RequestMethod.Get,
        'headers': oHeader,
        'body': oApiParam.body,
        'url': `${API_UMBRELLA_URL}${prefix}${middle}${suffix}`,
    };

    if (oApiParam.responseType) {
      jsonOption['responseType'] = oApiParam.responseType;
    }

    switch (method.toUpperCase()) {
        case 'POST':
            jsonOption.method = RequestMethod.Post;
        break;
        case 'PUT':
            jsonOption.method = RequestMethod.Put;
        break;
        case 'PATCH':
            jsonOption.method = RequestMethod.Patch;
        break;
        case 'DELETE':
            jsonOption.method = RequestMethod.Delete;
        break;
    }

    let oRequestOptions = new RequestOptions(jsonOption);
    let oRequest = new Request(oRequestOptions);

    return this._http
      .request(oRequest)
      .map((res: Response) => { return (convertToJSON) ? res.json() : res; } );
  }
}
