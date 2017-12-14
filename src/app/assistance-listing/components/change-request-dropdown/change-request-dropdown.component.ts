import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';

export enum FALChangeRequestListType {
  REQUEST,
  ACTION
}

interface ItemModel {
  permissionCode: string,
  value: string,
  label: string,
  index: number
}

interface ActionItemModel {
  archive_request: ItemModel[],
  title_request: ItemModel[],
  agency_request: ItemModel[],
  unarchive_request: ItemModel[],
  program_number_request: ItemModel[]
}

interface ListItemModel {
  request: ItemModel[],
  action: ActionItemModel
}

@Component({
  selector: 'fal-change-request-dropdown',
  templateUrl: 'change-request-dropdown.template.html'
})
export class FALChangeRequestDropdownComponent implements OnChanges, OnInit {
  //sam-select inputs
  @Input() disabled: boolean;
  @Input() name: string;
  @Input() hint: string = '';

  //component inputs
  @Input() permissions: Object = null;
  @Input() requestTypeAction: string = null;
  @Input() defaultOption: string = null;
  @Output() public clickActionHandler = new EventEmitter();

  renderOptions: any[] = [];
  listType: FALChangeRequestListType = FALChangeRequestListType.REQUEST;

  /**
   * Predefined options for both option types (Request & Action)
   */
  options: ListItemModel = {
    request: [
      {
        permissionCode: "INITIATE_CANCEL_ARCHIVE_CR",
        value: "archive_request",
        label: "Archive",
        index: 1
      },
      {
        permissionCode: "INITIATE_CANCEL_TITLE_CR",
        value: "title_request",
        label: "Title Change",
        index: 2
      },
      {
        permissionCode: "INITIATE_CANCEL_AGENCY_CR",
        value: "agency_request",
        label: "Agency Change",
        index: 5
      },
      {
        permissionCode: "INITIATE_CANCEL_UNARCHIVE_CR",
        value: "unarchive_request",
        label: "Unarchive",
        index: 4
      },
      {
        permissionCode: "INITIATE_CANCEL_NUMBER_CR",
        value: "program_number_request",
        label: "Number Change",
        index: 3
      }
    ],
    action: {
      archive_request: [
        {
          permissionCode: "APPROVE_REJECT_ARCHIVE_CR",
          value: "archive_reject",
          label: "Reject",
          index: 1
        },
        {
          permissionCode: "APPROVE_REJECT_ARCHIVE_CR",
          value: "archive",
          label: "Approve",
          index: 2
        },
        {
          permissionCode: "INITIATE_CANCEL_ARCHIVE_CR",
          value: "archive_cancel",
          label: "Cancel",
          index: 3
        }
      ],
      title_request: [
        {
          permissionCode: "APPROVE_REJECT_TITLE_CR",
          value: "title_reject",
          label: "Reject",
          index: 1
        },
        {
          permissionCode: "APPROVE_REJECT_TITLE_CR",
          value: "title",
          label: "Approve",
          index: 2
        },
        {
          permissionCode: "INITIATE_CANCEL_TITLE_CR",
          value: "title_cancel",
          label: "Cancel",
          index: 3
        }
      ],
      agency_request: [
        {
          permissionCode: "APPROVE_REJECT_AGENCY_CR",
          value: "agency_reject",
          label: "Reject",
          index: 1
        },
        {
          permissionCode: "APPROVE_REJECT_AGENCY_CR",
          value: "agency",
          label: "Approve",
          index: 2
        },
        {
          permissionCode: "INITIATE_CANCEL_AGENCY_CR",
          value: "agency_cancel",
          label: "Cancel",
          index: 3
        }
      ],
      unarchive_request: [
        {
          permissionCode: "APPROVE_REJECT_UNARCHIVE_CR",
          value: "unarchive_reject",
          label: "Reject",
          index: 1
        },
        {
          permissionCode: "APPROVE_REJECT_UNARCHIVE_CR",
          value: "unarchive",
          label: "Approve",
          index: 2
        },
        {
          permissionCode: "INITIATE_CANCEL_UNARCHIVE_CR",
          value: "unarchive_cancel",
          label: "Cancel",
          index: 3
        }
      ],
      program_number_request: [
        {
          permissionCode: "APPROVE_REJECT_NUMBER_CR",
          value: "program_number_reject",
          label: "Reject",
          index: 1
        },
        {
          permissionCode: "APPROVE_REJECT_NUMBER_CR",
          value: "program_number",
          label: "Approve",
          index: 2
        },
        {
          permissionCode: "INITIATE_CANCEL_NUMBER_CR",
          value: "program_number_cancel",
          label: "Cancel",
          index: 3
        }
      ]
    }
  };

  constructor() { }

  ngOnInit() {
    this.populateOptions();
  }

  ngOnChanges() {

  }

  populateOptions() {
    //append default option
    if (!_.isUndefined(this.defaultOption) && !_.isNil(this.defaultOption)) {
      this.renderOptions.push({ value: this.defaultOption, label: this.defaultOption, name: 'empty', disabled: true, index: 0 });
    }

    if (!_.isUndefined(this.permissions) && !_.isNil(this.permissions)) {
      switch (this.listType) {
        case FALChangeRequestListType.REQUEST:
          if (_.isArray(this.options.request)) {
            this.parseAuthorizedItems(this.options.request);
          }
          break;
        default:
          if (!_.isNil(this.requestTypeAction) && !_.isNil(this.options.action[this.requestTypeAction]) &&
            _.isArray(this.options.action[this.requestTypeAction]) && this.options.action[this.requestTypeAction].length > 0) {
            this.parseAuthorizedItems(this.options.action[this.requestTypeAction]);
          }
          break;
      }
    }
  }

  private parseAuthorizedItems(Items: any[]) {
    //parse items and populate only authorized items
    _.forEach(Items, (item: ItemModel) => {
      if (!_.isNil(this.permissions[item.permissionCode]) && this.permissions[item.permissionCode] === true) {
        this.renderOptions.push(item);
      }
    });

    //sort by items by index
    this.renderOptions = _.sortBy(this.renderOptions, ['index']);
  }

  public onSelect(event) {
    this.clickActionHandler.emit(event);
  }
}
