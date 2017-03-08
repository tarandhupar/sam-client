import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AwardsPage }   from './awards.page.ts';
import { routing } from './awards.route.ts';
import { SamUIKitModule } from 'sam-ui-kit';
import { CommonModule } from '@angular/common';

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
    
  ],
  declarations: [
    AwardsPage,
  ],
})
export class AwardsModule { }
