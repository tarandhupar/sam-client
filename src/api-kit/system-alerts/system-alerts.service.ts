import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';


@Injectable()
export class SystemAlertsService {
    constructor(private apiService: WrapperService) {}

    get(limit?: number, offset?: number, statuses?: [string], types?: [string], datePublished?: string, sort?: string) {

      let apiOptions: any = {
        name: 'alerts',
        suffix: '',
        method: 'GET',
        oParam: { }
      };

      // specify defaults
      apiOptions.oParam.limit = limit || 5;
      apiOptions.oParam.offset = offset || 0;

      if (statuses) {
        apiOptions.oParam.statuses = statuses.join(',');
      }

      if (types) {
        apiOptions.oParam.types = types.join(',');
      }

      if (datePublished) {
        apiOptions.oParam.datePublished = datePublished;
      }

      if (sort) {
        apiOptions.oParam.sort = sort;
      }

      return this.apiService.call(apiOptions);
    }
}
