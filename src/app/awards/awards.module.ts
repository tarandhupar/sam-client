import { NgModule } from '@angular/core';
import { AwardsPage }   from './awards.page.ts';
import { routing } from './awards.route.ts';
import { SamUIKitModule } from 'sam-ui-kit';
import { CommonModule } from '@angular/common';
import { DatexPipe } from './string-to-date.pipe';
import { PhonePipe } from './phone.pipe';
import { ZipCodePipe } from './zipCode.pipe';
import { BusCategoriesPipe } from './busCategories.pipe';
import { AwardsAddress } from './awards-address.component.ts';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SamUIKitModule,
    CommonModule
  ],
  exports: [
    AwardsPage,
    CommonModule,
    DatexPipe,
    PhonePipe,
    ZipCodePipe,
    BusCategoriesPipe,
    AwardsAddress
  ],
  declarations: [
    AwardsPage,
    DatexPipe,
    PhonePipe,
    ZipCodePipe,
    BusCategoriesPipe,
    AwardsAddress
  ],
})
export class AwardsModule { }
