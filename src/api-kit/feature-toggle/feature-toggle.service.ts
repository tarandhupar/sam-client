import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';

@Injectable()
export class FeatureToggleService {

  keyMap: any = {
    'fh': {prefix: '/federalorganizations', suffix: '/feature'},
    'cms': {prefix: '/cms', suffix: '/cmsuienabled'},
    'cmsBtn': {prefix: '/cms', suffix: '/cmsbuttonsenabled'}
  };

  constructor(private oAPIService: WrapperService){}

  checkFeatureToggle(key: string){
    var oApiParam = {
      prefix: this.keyMap[key].prefix,
      name: 'featureToggle',
      suffix: this.keyMap[key].suffix,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
