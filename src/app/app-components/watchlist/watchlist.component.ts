import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Watchlist} from './watchlist.model';
import { WatchlistService } from "../../../api-kit/watchlist/watchlist.service";
import { Router } from "@angular/router";
import { WatchlistType } from "../../../api-kit/watchlist/watchlist.service";

/**
 * The <sam-watch-button> component generates a button to Watch/Unwatch
 */
@Component({
  selector: 'sam-watch-button',
  template: `<button style="border:none; background-color:Transparent; color:#0071bc" [disabled]="disabled" (click)="confirmUnsubscribe()" type="button" onMouseOver="this.style.background-color='Transparent'">
   <span *ngIf="!subscribed">
    <span class="fa-stack crossed-out" aria-hidden="true" title="Subscribe">
      <i class="fa fa-newspaper-o fa-stack-1x"></i>
    </span>Subscribe</span>
   <span *ngIf="subscribed">
    <span class="fa-stack" aria-hidden="true" title="Unsubscribe">
      <i class="fa fa-newspaper-o fa-stack-1x"></i>
    </span>Unsubscribe</span>    
  </button>
  <!--Unsubscribe Modal-->
  <sam-modal #unsubscribeModal
            [showClose]="false"
            [closeOnOutsideClick]="true"
            [closeOnEscape]="true"
            [type]="'warning'"
            [title]="modalConfig.title"
            [description]="modalConfig.description"
            [submitButtonLabel]="'Ok'"
            [cancelButtonLabel]="'Cancel'"
            (onSubmit)="onUnsubscribeModalSubmit()">
  </sam-modal>
`,
})
export class SamWatchComponent implements OnInit{
  /**
  * Sets the id that will assign to the watch element
  */
  @Input() data:WatchlistType;

  @Input() showModal:boolean = false;
  @ViewChild('unsubscribeModal') unsubscribeModal;
  modalConfig = {title:'Confirm Unsubscribe', description:''};

  private watchlist:Watchlist;

  @Output() subscriptionChanaged: EventEmitter<Watchlist> = new EventEmitter<Watchlist>();

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
    if(!this.data) {
      this.watchlist = new Watchlist();
    } else {
      this.watchlist = Watchlist.FromResponse(this.data);
    }
    if(this.watchlist.active() === 'Y') {
        this.subscribed = true;
    }
    if(!this.watchlist.id()) {
      this.watchlist.setActive('N');
      this.watchlist.setFrequency('instant');
    }
    
     if(!this.watchlist.id()) {
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

  confirmUnsubscribe(){
    if(this.showModal && this.watchlist.id()) {
      this.unsubscribeModal.openModal();
      if(this.watchlist.recordId() !== '') {
        this.modalConfig.description = 'Are you sure you wish to unsubscribe from: "' + this.watchlist.recordId() + '"?"';
      } else {
        this.modalConfig.description = 'Are you sure you wish to unsubscribe from this record?';
      }
    }
    else {
      this.performSubscriptionChange();
    }
  }

  performSubscriptionChange() {
      (this.subscribed) ? this.watchlist.setActive('N') : this.watchlist.setActive('Y');
   // console.log("new active flag: " + this.watchlist.active() );
    if(!this.watchlist.id()) {      
      this.watchlist.setUri(this.router.url);
      this.watchlistService.createWatchlist(this.watchlist.raw()).subscribe(resWatch => {
      this.watchlist = Watchlist.FromResponse(resWatch);
      this.subscribed = !this.subscribed;
      this.subscriptionChanaged.emit(this.watchlist);
      });
    } else {
      this.watchlistService.updateWatchlist(this.watchlist.raw()).subscribe(resWatch => {
      this.watchlist = Watchlist.FromResponse(resWatch);
      this.subscribed = !this.subscribed;
      this.subscriptionChanaged.emit(this.watchlist);
      });
    }
  }

  public onUnsubscribeModalSubmit() {
    this.unsubscribeModal.closeModal();
    this.performSubscriptionChange();
  }
}
