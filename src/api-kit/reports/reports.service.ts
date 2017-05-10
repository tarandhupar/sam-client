import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ReportsService {

  constructor(private oAPIService: WrapperService) {}

  getReportsById(id: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/opportunities/' + id,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getReportsHistoryById(id: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/opportunities/' + id + '/history',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getReportsLocationById(id: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/opportunities/' + id + '/location',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getReportsDictionary(ids: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/dictionaries',
      oParam: {
        ids: ids
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getAttachmentById(id: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/opportunities/' + id + '/attachments',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getPackagesCount(id: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/opportunities/' + id + '/packages/count',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }


  getRelatedOpportunitiesByIdAndType(id: string, type: string, page: number, sort: string) {
    let apiParam = {
      name: 'reports',
      suffix: '/opportunities/' + id + '/relatedopportunities',
      oParam: {
        'type': type,
        'page': page,
        'sort': sort,
      },
      method: 'GET'
    };
    return this.oAPIService.call(apiParam);
  }
}
