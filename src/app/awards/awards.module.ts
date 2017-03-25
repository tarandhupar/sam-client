import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AwardsPage }   from './awards.page.ts';
import { routing } from './awards.route.ts';
import { SamUIKitModule } from 'sam-ui-kit';
import { CommonModule } from '@angular/common';
import {DatexPipe} from './string-to-date.pipe';
import { AwardsAddress } from './awards-address.component.ts';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    SamUIKitModule,
    CommonModule
  ],
  exports: [
    AwardsPage,
    BrowserModule,
    CommonModule,
    DatexPipe,
    AwardsAddress
  ],
  declarations: [
    AwardsPage,
    DatexPipe,
    AwardsAddress
  ],
})
export class AwardsModule { }
