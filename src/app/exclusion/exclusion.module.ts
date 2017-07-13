import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExclusionsPage }   from './exclusion.page.ts';
import { routing } from './exclusion.route.ts';
import { SamUIKitModule } from 'sam-ui-kit';
import { CommonModule } from '@angular/common';
import { ExclusionAddress } from './exclusion-address.component.ts';
import { ExclusionIcon } from './exclusion-icon.component.ts';
import { ExclusionNatureEffect } from './exclusion-nature-effect-component';
import { ExclusionCrossReference } from './exclusion-cross-reference.component.ts';
import { AppComponentsModule } from "../app-components/app-components.module";

@NgModule({
  imports: [
    BrowserModule,
    routing,
    SamUIKitModule,
    CommonModule,
	AppComponentsModule
  ],
  exports: [
    ExclusionsPage,
    BrowserModule,
    CommonModule,
    ExclusionAddress,
    ExclusionIcon,
    ExclusionNatureEffect,
    ExclusionCrossReference
  ],
  declarations: [
    ExclusionsPage,
    ExclusionAddress,
    ExclusionIcon,
    ExclusionNatureEffect,
    ExclusionCrossReference,
  ],
})
export class ExclusionModule { }
