import { Component,ViewChild, Input, Output, EventEmitter,forwardRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NotificationItem } from "../interfaces";
@Component ({
  selector: 'sam-notifications',
  template: `
    <ul class="notifications-list">
        <li *ngFor="let item of _notifications; let i = index" class="link-hover">
            <a (click)="linkHandler(item.link)">
                <div class="name-block p_L-1x">
                    <ng-container [ngSwitch]="item.type">
                        <span *ngSwitchCase="'request'" class="requestor-name">{{ item.username }}</span>
                        <span *ngSwitchCase="'alert'" class="title">{{ item.title}}</span>
                        <span *ngSwitchCase="'subscription'" class="title">Subscription</span>
                    </ng-container>
                    <br/><span class="notification-time">{{ item.datetime | shortDate }}</span>
                </div>
                
                <span class="text-block p_L-1x">
                   <ng-container>
                      <span class="text">{{ item.text.substring(0,textMaxLength) }}<i class="fa fa-ellipsis-h p_L-1x" *ngIf="ellipseControlIndex.includes(i)"></i></span>
                    </ng-container>
                </span>
            </a>
        </li>
        <li class="show-more">
            <a (click)="showMoreHandler()">Show More <i class="fa fa-chevron-circle-right "></i></a>
        </li>
    </ul>`
})
export class SamNotificationsComponent {
  @Input() notifications: NotificationItem[];
  @Output() action:EventEmitter<any> = new EventEmitter<any>();
  private textMaxLength: number = 66;
  private maxNumOfNotifications = 5;
  _notifications: NotificationItem[];
  ellipseControlIndex: any = [];


  constructor(private router:Router){}

  ngOnChanges(c){
    if(this.notifications){
      this._notifications = this.notifications.slice(0,this.maxNumOfNotifications);
      for(var idx in this._notifications){
        if(this._notifications[idx].text.length > this.textMaxLength) this.ellipseControlIndex.push(+idx);
      }
    }
  }

  linkHandler(link){
    this.action.emit({});
    this.router.navigate([link]);
  }

  showMoreHandler(){
    this.action.emit({});
  }
}
