import { Injectable } from '@angular/core';
import { ApiParameters, WrapperService } from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';
import { Cookie } from 'ng2-cookies';
import { set, cloneDeep } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

@Injectable()
export class S3Service {

  constructor(private api: WrapperService, private http: Http) {

  }

  _addAuthHeader(options: ApiParameters): ApiParameters {
    const iPlanetCookie = Cookie.get('iPlanetDirectoryPro');

    if (!iPlanetCookie) {
      return options;
    }
    let ret = cloneDeep(options);
    set(ret, 'headers.X-Auth-Token', iPlanetCookie);
    return ret;
  }

  _callUrlService(path: string, method: 'PUT'|'DELETE') {
    const params: ApiParameters = {
      name: 'cms',
      suffix: '/data/s3url',
      method: 'GET',
      oParam: {
        method: method,
        key: path,
      },
    };
    const withHeader = this._addAuthHeader(params);
    return this.api.call(withHeader);
  }

  /*
   * File path is the full file path. It can include folders
   * E.G. 'videos/2017-08-08/my-video.mp4'
   * @Returns Observable of a filepath
   */
  getSignedUrlForUpload(filePath: string): Observable<string> {
    return this._callUrlService(filePath, 'PUT');
  }

/*
 * @Returns Observable of a URL to a file that can be deleted by calling http.delete(url)
 */
  getSignedUrlForDelete(filePath: string): Observable<string> {
    return this._callUrlService(filePath, 'DELETE');
  }

  uploadFile(url: string, file: File) {
    return this.http.put(url, file);
  }

  deleteFile(url: string) {
    return this.http.delete(url);
  }
}
