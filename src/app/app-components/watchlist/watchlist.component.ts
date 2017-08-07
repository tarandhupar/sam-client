import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Watchlist} from './watchlist.model';
import { WatchlistService } from "../../../api-kit/watchlist/watchlist.service";

/**
 * The <sam-watch-button> component generates a button to Watch/Unwatch
 */
@Component({
  selector: 'sam-watch-button',
  template: `<button [ngClass]="btnClass" [disabled]="disabled" (click)="onClick($event)" type="button">
   <span *ngIf="!subscribed">Subscribe</span>
   <span *ngIf="subscribed">Unsubscribe</span>  
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
    subscribe:"",
    unsbscribe:"usa-button-primary-alt",
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

  constructor(private watchlistService: WatchlistService) {
  } 

  ngOnInit() {
    if(!this.watchlist) {
      this.watchlist = new Watchlist();
      this.watchlist.setActive('N');
      this.watchlist.setDomainId(this.domainId);
      this.watchlist.setRecordId(this.recordId);
      this.watchlistService.getByRecordId(this.watchlist.raw()).subscribe(resWatch => {
        this.watchlist = Watchlist.FromResponse(resWatch);
      });
    }
     (this.watchlist.active() === 'Y') ? this.subscribed = true : this.subscribed = false;
  }

  onClick(event) {
    //this.click.emit(this.watchlist);
    (this.subscribed) ? this.watchlist.setActive('N') : this.watchlist.setActive('Y');
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
