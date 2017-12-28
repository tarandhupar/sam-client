import { Injectable } from '@angular/core';
import { FHService } from '../../../../api-kit';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { isObject } from '../../../../sam-ui-elements/src/ui-kit/type-check-helpers';

export enum FHAdminType {
  SuperAdmin = 'SuperAdmin',
  OfficeAdmin = 'OfficeAdmin',
  NonAdmin = 'NonAdmin',
}

@Injectable()
export class FhWidgetService {
  constructor(private fh: FHService) {
    this.fetchRecent();
  }

  fetchRecent() {
    const type = 'completed';
    const days = 90;
    return this.fh.getFHWidgetInfo(type, days);
    // this.fh.getFHWidgetInfo(type, days).subscribe(
    //   res => {
    //     this.responses$.next(res);
    //   },
    //   err => {
    //     this.responses$.error(err);
    //   }
    // );
  }

  fetchScheduled() {
    const type = 'scheduled';
    const days = 0;
    return this.fh.getFHWidgetInfo(type, days);
    // this.fh.getFHWidgetInfo(type, days).subscribe(
    //   res => {
    //     this.responses$.next(res);
    //   },
    //   err => {
    //     this.responses$.error(err);
    //   }
    // );
  }

  getAdminType(res): FHAdminType {
    if (!isObject(res)) {
      // No response yet, or invalid response
      return FHAdminType.NonAdmin;
    }
    const links = res._links;
    if (links) {
      const numLinks = Object.keys(links).length;
      if (numLinks === 0) {
        return FHAdminType.NonAdmin;
      }
      if (numLinks === 1) {
        return FHAdminType.OfficeAdmin;
      }
      if (numLinks > 1) {
        return FHAdminType.SuperAdmin;
      }
    } else {
      console.warn('_links was expected but not found');
      return FHAdminType.NonAdmin;
    }
  }
}
