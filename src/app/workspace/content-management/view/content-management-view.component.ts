import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { IBreadcrumb, OptionsType } from 'sam-ui-elements/src/ui-kit/types';
import { ContentManagementService } from 'api-kit/content-management/content-management.service';
import { FeatureToggleService } from 'api-kit/feature-toggle/feature-toggle.service';
import { MsgFeedService } from 'api-kit/msg-feed/msg-feed.service';
import { CapitalizePipe } from '../../../app-pipes/capitalize.pipe';
import { Observable } from 'rxjs';
import { AlertFooterService } from '../../../app-components/alert-footer';
import { CMSMapping } from '../content-management-mapping';
import * as moment  from 'moment';
import { get } from 'lodash';
import { isString } from '../../../../sam-ui-elements/src/ui-kit/type-check-helpers';

interface SortModel {
  type: string;
  sort: 'asc'|'desc';
}

@Component({
  templateUrl: './content-management-view.template.html',
})
export class HelpContentManagementViewComponent {

  crumbs: Array<IBreadcrumb> = [
    { url: '/help', breadcrumb: 'Help Center' },
    { breadcrumb: '' }
  ];

  recordsPerPage = 5;

  toggleBtn: boolean = false;

  title: string = '';
  curSection: string = '';

  sortOptions: OptionsType[] = [
    { label: 'Latest Update', name: 'Updated', value: 'lastmodifieddate' },
    { label: 'Alphabetical', name: 'Alphabetical', value: 'title' },
    // Relevance removed while we figure out the algorithm to determine relevance
    // { label:'Relevance', name:'Relevance', value:'relevance' },
  ];

  sortDefault: SortModel = { type: 'lastmodifieddate', sort: 'desc' };
  // we need to remember the last sort so that we can detect whether the most recent change was a 'type' change or
  // 'sort' change
  lastSort: SortModel = Object.assign({}, this.sortDefault);
  sortByModel: SortModel = Object.assign({}, this.sortDefault);

  // current results num data variables
  curStart = 0;
  curEnd = 0;
  totalRecords = 0;

  // pagination variables
  curPage = 0;
  totalPages = 10;

  filterObj = {
    keyword: '',
    status: [],
    domains: [],
    section: '',
    subSection: '',
  };

  contents = [];
  noContentsInfo = 'Loading';
  createTextMap = {
    'data-dictionary': 'New Definition',
    'FAQ-repository': 'New Question',
    'video-library': 'New Video',
  };

  cmsMapping = new CMSMapping();
  domainsMapping;
  showCreateButton: boolean = false;

  constructor(private route: ActivatedRoute,
              private _router: Router,
              private contentManagementService: ContentManagementService,
              private capitalPipe: CapitalizePipe,
              private alertFooter: AlertFooterService,
              private featureToggleService: FeatureToggleService,
              private msgFeedService: MsgFeedService) { }

  ngOnInit() {
    this.setToggleFeature();
    this.loadDomains();
    const params$ = Observable.combineLatest(this.route.params, this.route.queryParams);
    params$.subscribe(
      params => {
        const [pathParams, queryParams] = params;
        if (pathParams) {
          const section = pathParams['section'];
          const title = this.getSectionTitle(section);
          this.title = this.crumbs[1].breadcrumb = title;
          this.filterObj.section = this.curSection = section;
        }
        if (queryParams) {
          this.loadQueryParamsFromURL(queryParams);
        }
        this.loadContent(this.filterObj, this.sortByModel, this.curPage);
      });
  }

  setToggleFeature() {
    this.featureToggleService.checkFeatureToggle('cmsBtn').subscribe(
      res => { if (res) this.toggleBtn = res; },
      () => {/* Still hide the button if error occurs */}
    );
  }

  /* update message feeds based on filter obj changes*/
  onFilterChange(filterObj) {
    this.filterObj = filterObj;
    this.curPage = 0;
    if (this.filterObj.section !== this.curSection) {
      this.sortByModel = Object.assign({}, this.sortDefault);
      this.lastSort = Object.assign({}, this.sortDefault);
    }
    this.updateURL();
  }

  /* update message feeds based on page num changes*/
  onPageNumChange(pageNum) {
    this.curPage = pageNum;
    this.updateURL();
  }

  getDefaultSortOrderForType(type) {
    switch (type) {
      case 'lastmodifieddate': return 'desc';
      case 'title': return 'asc';
      default: return 'asc';
    }
  }

  onSortModelChange() {
    let typeHasChanged: boolean = this.lastSort.type !== this.sortByModel.type;
    this.lastSort = Object.assign(this.sortByModel);

    if (typeHasChanged) {
      const orderForType = this.getDefaultSortOrderForType(this.sortByModel.type);
      this.sortByModel = Object.assign({}, this.sortByModel, { sort: orderForType});
    }
    this.curPage = 0;
    this.updateURL();
  }

  onCreateContentItem() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        mode: 'create',
      }
    };
    this._router.navigate([`/workspace/content-management/${this.filterObj.section}/edit`], navigationExtras);
  }

  onThumbnailImageError(item) {
    document.getElementById(item.refId).setAttribute('src', 'src/assets/img/logo-not-found.png');
  }

  /* search message feeds with filter, sortby, page number and order*/
  loadContent(filterObj, sort, page) {
    this.noContentsInfo = 'Loading';
    this.contents = [];
    this.contentManagementService.getContent(filterObj, sort, page + 1, this.recordsPerPage).subscribe(
      data => {
        try {
          // show the last page if the page is out of boundary
          this.totalRecords = data._embedded.contentDataWrapperList[0]['totalRecords'];
          this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
          if (page + 1 > this.totalPages && this.totalPages >= 1) {
            this.curPage = this.totalPages - 1;
            this.loadContent(filterObj, sort, this.curPage);
          } else {
            this.contents = data._embedded.contentDataWrapperList[0]['contentDataList'];
            this.contents = this.contents.map(item => {
              return {...item, actions: this.getActions(item) };
            });
            this.updateRecordsText();
            if (this.contents.length) {
              this.noContentsInfo = 'No Content Available';
            }
          }

          if (get(data, '_links.create')) {
            this.showCreateButton = true;
          } else {
            this.showCreateButton = false;
          }

        } catch (err) {
          console.log(err);
          this.noContentsInfo = 'No Content Available';
        }

      },
      error => {
        this.noContentsInfo = 'No Content Available';
      });
  }

  loadDomains() {
    this.msgFeedService.getDomains().subscribe(data => {
      this.domainsMapping = data;
    });
  }

  updateRecordsText() {
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if (this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if (this.totalRecords === 0) this.curStart = 0;
  }

  updateURL() {
    let navigationExtras: NavigationExtras = { queryParams: { } };
    if (this.curPage > 0) navigationExtras.queryParams['page'] = this.curPage + 1;
    if (this.filterObj.domains.length > 0) navigationExtras.queryParams['domain'] = this.filterObj.domains.join(',');
    if (this.filterObj.status.length > 0) navigationExtras.queryParams['status'] = this.filterObj.status.join(',');
    if (this.filterObj.keyword !== '') navigationExtras.queryParams['q'] = this.filterObj.keyword;
    if (this.sortByModel['sort'] !== 'asc') {
      navigationExtras.queryParams['order'] = this.sortByModel['sort'] ;
    }
    navigationExtras.queryParams['sort'] = this.sortByModel['type'];
    this._router.navigate(['/workspace/content-management/' + this.filterObj.section], navigationExtras);
  }

  loadQueryParamsFromURL(queryParams) {
    const { q, status, domains, sort, order, page } = queryParams;

    if (q) {
      this.filterObj.keyword = q;
    }
    if (status && status.split) {
      this.filterObj.status = status.split(',');
    }
    if (domains && domains.split) {
      this.filterObj.domains = domains.split(',');
    }

    if (sort) {
      this.sortByModel.type = sort;
    }
    if (sort && !order) {
      this.sortByModel.sort = this.getDefaultSortOrderForType(sort);
    }
    if (order) {
      this.sortByModel.sort = order;
    }

    const pageNumber = +page;
    if (!isNaN(pageNumber)) {
      this.curPage = pageNumber - 1;
    }
  }

  getSectionTitle(section) {
    return section.split('-').map(sec => {
      return sec === sec.toUpperCase() ? sec : this.capitalPipe.transform(sec);
    }).join(' ');
  }

  getThumbnailImage(item) {
    return item.thumbnailUrl || 'src/assets/img/logo-not-found.png';
  }

  onContentItemAction(action, item) {
    switch (action.name) {
      case 'Edit':
        let navigationExtras: NavigationExtras = {
          queryParams: {
            mode: 'edit',
            id: item.contentId,
          }
        };
        this._router.navigate([`/workspace/content-management/${this.filterObj.section}/edit`], navigationExtras);
        break;
      case 'Publish':
        item['status'] = 2;
        this.updateDataContent(item, 'Successfully published ' + item.refId, 'Failed to publish ' + item.refId);
        break;
      case 'Delete':
      case 'Delete Draft':
        item['activeStatus'] = false;
        this.updateDataContent(item, 'Successfully deleted ' + item.refId, 'Failed to delete ' + item.refId);
        break;
      case 'Unarchive':
        item['status'] = 3;
        this.updateDataContent(item, 'Successfully unarchived ' + item.refId, 'Failed to unarchive ' + item.refId);
        break;
      case 'Archive':
        item['status'] = 4;
        this.updateDataContent(item, 'Successfully archived ' + item.refId, 'Failed to archive ' + item.refId);
        break;
      default:
        throw new Error('Unabled to handle type: ' + action.name);
    }
  }

  updateDataContent(content, successMsg, errorMsg) {
    console.log(this.curSection);
    this.contentManagementService.updateContent(content).subscribe(
      data => {
        this.showAlertMessage('success', successMsg);
        this.loadContent(this.filterObj, this.sortByModel, this.curPage);
      },
      err => {
        let errorObject;
        try {
          errorObject = err.json();
        } catch (e) {

        }
        const responseMessage = errorObject && errorObject.errorMessage;
        const responseHasError: boolean = isString(responseMessage);
        const msg = responseHasError ? responseMessage : errorMsg;
        this.showAlertMessage('error', msg);
        this.loadContent(this.filterObj, this.sortByModel, this.curPage);
      }
    );
  }

  getDomainStr(domains) {
    if (!domains || !domains.length || !this.domainsMapping) {
      return 'Not Available';
    }
    return domains.map(d => this.domainsMapping[d]).join(', ');
  }

  getTagStr(tags) {
    if (!tags || !tags.length) {
      return 'Not Available';
    }
    return tags.map(t => t.tagKey).join(', ');
  }

  getDurationText(durationSec) {
    return moment('1900-01-01 00:00:00').add(durationSec, 'seconds').format('HH:mm:ss');
  }


  getActions(item) {
    if (!item._links) {
      return [];
    }
    const editAction = { icon: 'fa fa-pencil', label: 'Edit', name: 'Edit'};
    const publishAction = { icon: '', label: 'Publish', name: 'Publish'};
    const archiveAction = { icon: '', label: 'Archive', name: 'Archive'};
    const unarchiveAction = { icon: '', label: 'Unarchive', name: 'Unarchive'};
    const deleteAction = { icon: 'fa fa-times', label: 'Delete', name: 'Delete'};

    let actions = [];
    const links = item._links;

    if (links.Unarchive) {
      actions.push(unarchiveAction);
    }
    if (links.Publish) {
      actions.push(publishAction);
    }
    if (links.Edit) {
      actions.push(editAction);
    }
    if (links.Archive) {
      actions.push(archiveAction);
    }
    if (links.Delete) {
      actions.push(deleteAction);
    }
    return actions;
  }

  hasActions(item) {
    return item.actions && item.actions.length;
  }

  showAlertMessage(type, message) {
    this.alertFooter.registerFooterAlert({
      title: '',
      description: message,
      type: type,
      timer: 3200
    });
  }

}
