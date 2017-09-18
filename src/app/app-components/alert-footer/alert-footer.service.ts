import { Component, Injectable } from '@angular/core';
import { SamEventListener } from '../../app-utils/event-listener';

@Injectable()
export class AlertFooterService {
  public addEventListener: (type: string, fn: Function, context?: any) => any;
  public removeEventListener: (type: string, fn: Function, context?: any) => any;
  private alerts: any = [];
  private subscribers: any = {
    any: [],
    register: [],
    dismiss: [],
    dismissAll: [],
    init: [],
    destroy: []
  };
  private events: any;
  
  constructor() {
    this.events = new SamEventListener('register', 'dismiss', 'dismissAll', 'init', 'destroy');
    this.addEventListener = this.events.addEventListener.bind(this.events);
    this.removeEventListener = this.events.removeEventListener.bind(this.events);
  }

  ngOnInit() {
    this.events.fire('init');
  }

  ngOnDestroy() {
    this.events.fire('destroy');
  }

  getAlerts(){
    return this.alerts;
  }

  registerFooterAlert(data){
    this.alerts.unshift(data);
    this.events.fire('register', data);
    return this;
  }

  dismissAll() {
    this.alerts = [];
    this.events.fire('dismissAll');
    return this;
  }

  dismissFooterAlert(i){
    const dismissed = Object.assign({}, this.alerts[i]);
    this.alerts = this.alerts.filter((obj, idx) => idx !== i);
    this.events.fire('dismiss', dismissed);
    return this;
  }
}
