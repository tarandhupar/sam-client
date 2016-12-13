import { Component, Injectable } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'
import { Router } from "@angular/router";
import {SYSTEM_ALERTS_PAGE_PATH} from "../alerts.route";
import {Alert} from "../alert.model";

@Injectable()
export class AlertFooterService {

  private alerts: any = [];
  
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  getAlerts(){
    return this.alerts;
  }

  registerFooterAlert(data){
    this.alerts.unshift(data);
  }

  dismissFooterAlert(i){
    this.alerts = this.alerts.filter(function(obj,idx){
      if(idx==i){
        return false;
      }
      return true;
    });
  }

}
