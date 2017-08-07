import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FALChangeRequestDropdownComponent, FALChangeRequestListType } from "./change-request-dropdown.component";
import * as _ from 'lodash';

// Animation
import { trigger, state, style, animate, transition } from '@angular/core';

interface ProgramChangeRequestModel {
  id: string,
  status?: {
    code?: string
  },
  latest?: boolean,
  archived?: boolean
}

@Component({
  selector: 'wrapper-fal-change-request-dropdown',
  templateUrl: 'wrapper-change-request-dropdown.template.html',
  animations: [
    trigger('dropdown', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-10%) scale(.8)'
        }),
        animate('100ms ease-in')
      ]),
      transition('* => void', [
        animate('100ms ease-out', style({
          opacity: 0,
          transform: 'translateY(-10%) scale(.8)'
        }))
      ])
    ])
  ]
})
export class FALWrapperChangeRequestDropdownComponent extends FALChangeRequestDropdownComponent implements OnChanges, OnInit {
  @Input() program: ProgramChangeRequestModel;
  @Input() listingType: string = 'request';
  @Output() public clickActionHandler = new EventEmitter();

  //by default hide dropdown
  displayDropdown: boolean = false;
  
  openDropdown: boolean = false;

  constructor() {
    super();
  }

  ngOnChanges(value?) {
    if(value && !_.isNil(value.requestTypeAction) && !_.isNil(value.requestTypeAction.currentValue)){
      this.disableDropDown();
    }
  }

  ngOnInit() {
    //setup the list type of dropdown
    switch (this.listingType.toLowerCase()) {
      case 'request':
        this.listType = FALChangeRequestListType.REQUEST;
        break;
      default:
        this.listType = FALChangeRequestListType.ACTION;
        break;
    }

    //business logic to show the dropdown for published FAL & user's permission (logged in user)
    if (this.program != null && this.program.archived === false && this.program.status.code === 'published' && this.program.latest === true && this.permissions !== null) {
      //remove `unarchive_request` option from the list
      this.options.request = _.filter(this.options.request, item => { return (item.value != "unarchive_request") });
      this.displayDropdown = true;
    }

    //business logic to show the dropdown archived FAL & user's permission (logged in user)
    if (this.program != null && this.program.archived === true && this.program.status.code === 'published' && this.program.latest === true && this.permissions !== null) {
      //remove the other options from the list and keep only `unarchive_request`
      this.options.request = _.filter(this.options.request, { value: 'unarchive_request' });
      this.displayDropdown = true;
    }

    this.disableDropDown();
    this.populateOptions();

    //hide dropdown if the logged-in user doesn't have the permission to see it
    if ((this.renderOptions.length <= 1 && !_.isUndefined(this.defaultOption) && !_.isNil(this.defaultOption)) ||
      (_.isUndefined(this.defaultOption) || _.isNil(this.defaultOption) && this.renderOptions.length == 0)) {
      this.displayDropdown = false;
    }
  }

  public onSelect(event) {
    this.clickActionHandler.emit({ value: event, program: this.program });
  }

  private disableDropDown(){
    //if there a pending request & the list requested is a type of "request" then disabled the dropdown
    if (!_.isNil(this.requestTypeAction) && this.listType === FALChangeRequestListType.REQUEST) {
      this.disabled = true;
    }

    //if there a pending request & the list requested is a type of "action" then disabled the dropdown
    if (!_.isNil(this.requestTypeAction) && this.listType === FALChangeRequestListType.ACTION) {
      this.disabled = false;
    }
  }
}
