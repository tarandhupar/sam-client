import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WageDeterminationService} from "../../../../api-kit";

@Component({
  selector: 'tabs-cba',
  templateUrl: 'tabs-cba.template.html'
})

export class TabsCBAComponent implements OnInit {
  @Input() data: any;
  @Output() tabClick: EventEmitter<any> = new EventEmitter<any>();
  isEdit: boolean;
  isCreate: boolean;
  isPublic: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canPublic: boolean;
  isRevise: boolean;
  currentRouteConfig: string;
  cookieValue: string;
  tabItems: any = {
    create: {label: "Create", routeConfig: "wage-determination/cba/add"},
    edit: {label: "Edit", routeConfig: "wage-determination/cba/:id/edit"},
    public: {label: "Public", routeConfig: "wage-determination/cba/:id"},
  };

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.currentRouteConfig = this.route.snapshot['_routeConfig'].path;

    this.isEdit = this.currentRouteConfig == this.tabItems.edit.routeConfig;
    this.isCreate = this.currentRouteConfig == this.tabItems.create.routeConfig;
    this.isPublic = this.currentRouteConfig == this.tabItems.public.routeConfig;

    this.canCreate = !!this.data && this.data._links != null && this.data._links['cba:create'] != null;
    this.canEdit = !!this.data && this.data._links != null && this.data._links['cba:update'] != null && this.data.status && this.data.status == 'draft';
    this.canPublic = !!this.data && this.data.status && this.data.status == 'published';

    this.isRevise = !!this.data && this.data.status && this.data.status == 'draft' && this.data.cbaNumber;
  }

  tabClicked(tab) {
    if ((this.currentRouteConfig != tab.routeConfig) && this.data.id) {
      this.tabClick.emit({
        label: tab.label,
        routeConfig: tab.routeConfig
      });
    }
  }
}
