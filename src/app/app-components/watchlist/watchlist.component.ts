import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Watchlist} from './watchlist.model';
import { WatchlistService } from "../../../api-kit/watchlist/watchlist.service";
import { Router } from "@angular/router";

/**
 * The <sam-watch-button> component generates a button to Watch/Unwatch
 */
@Component({
  selector: 'sam-watch-button',
  template: `<button style="border:none; background-color:#ffffff; color:#0071bc" [disabled]="disabled" (click)="onClick($event)" type="button" onMouseOver="this.style.background-color='#ffffff'">
   <span *ngIf="!subscribed">
    <span class="fa-stack crossed-out" aria-hidden="true" title="Subscribe">
      <i class="fa fa-newspaper-o fa-stack-1x"></i>
    </span>Subscribe</span>
   <span *ngIf="subscribed">
    <span class="fa-stack" aria-hidden="true" title="Unsubscribe">
      <i class="fa fa-newspaper-o fa-stack-1x"></i>
    </span>Unsubscribe</span>    
  </button>`,
})
export class SamWatchComponent implements OnInit{
  /**
  * Sets the id that will assign to the watch element
  */
  private watchlist:Watchlist;

  @Input() domainId:string;

  @Input() type:string;

  @Input() recordId: string;

  //@Output() click: EventEmitter<Watchlist> = new EventEmitter<Watchlist>();

  subscribed:boolean = false;
  
  //@Output() onClick: EventEmitter<any> = new EventEmitter();

  private btnClassMap: any = {
    subscribe:"usa-button-outline; border:none",
    unsbscribe:"usa-button-outline; border:none",
    disabled:"usa-button-disabled" 
  };

  disabled: boolean = false;

  get btnClass():String {
    let classMap = [];

    if(!this.subscribed){
      classMap.push(this.btnClassMap["subscribe"]);
    } else {
      classMap.push(this.btnClassMap["unsbscribe"]);
    }

    return classMap.join(' ');
  }

  constructor(private watchlistService: WatchlistService, private router:Router) {
  } 

  ngOnInit() {
    if(!this.watchlist) {
      this.watchlist = new Watchlist();
      this.watchlist.setActive('N');
      this.watchlist.setDomainId(this.domainId);
      this.watchlist.setRecordId(this.recordId);
      this.watchlist.setType(this.type);
     this.watchlistService.getByRecordId(this.watchlist.raw()).subscribe(resWatch => {  
        if(resWatch)    {
          
          let tmpWatchlist = Watchlist.FromResponse(resWatch);
        
          if(tmpWatchlist) {
            this.watchlist =tmpWatchlist;
          //  console.log("this.watchlist1: " +JSON.stringify(this.watchlist));
          //  console.log("this.watchlist.active(): " +JSON.stringify(this.watchlist));
          //  console.log("(this.watchlist.active() === 'Y'): " + (this.watchlist.active() === 'Y'));
            (this.watchlist.active() === 'Y') ? this.subscribed = true : this.subscribed = false;
          //  console.log("SUbscribed flag in init: " + this.subscribed);
           }
        }
      }, (e) => console.log("error " + e.status));
    }

  }

  onClick(event) {
    //this.subscribed = !this.subscribed;
    //this.click.emit(this.watchlist);
   // console.log("this.watchlist: " +JSON.stringify(this.watchlist));
   // console.log("subscribed flag before api call :" + this.subscribed);
    (this.subscribed) ? this.watchlist.setActive('N') : this.watchlist.setActive('Y');
   // console.log("new active flag: " + this.watchlist.active() );
     this.watchlist.setUri(this.router.url);
    if(!this.watchlist.id()) {
      this.watchlistService.createWatchlist(this.watchlist.raw()).subscribe(resWatch => {
      this.watchlist = Watchlist.FromResponse(resWatch);
      this.subscribed = !this.subscribed;
      });
    } else {
      this.watchlistService.updateWatchlist(this.watchlist.raw()).subscribe(resWatch => {
      this.watchlist = Watchlist.FromResponse(resWatch);
      this.subscribed = !this.subscribed;
      });
    }

  }
}
