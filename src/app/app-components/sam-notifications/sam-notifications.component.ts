import { Component,ViewChild, Input, Output, EventEmitter,forwardRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NotificationItem } from "../interfaces";
@Component ({
    selector: 'sam-notifications',
    template: `
    <ul class="notifications-list">
        <li *ngFor="let item of _notifications">
            <a (click)="linkHandler(item.link)">
                <span class="name-block">{{ item.username }}</span>
                <span class="text-block"><span class="text">{{item.text}}</span><br/>{{ item.datetime | dateTimeDisplay }}</span>
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

    constructor(private router:Router){}

    ngOnChanges(c){
        if(this.notifications){
            this._notifications = this.notifications.slice(0,this.maxNumOfNotifications);
            for(var idx in this._notifications){
                this._notifications[idx].text = this._notifications[idx].text.substring(0,this.textMaxLength);
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
