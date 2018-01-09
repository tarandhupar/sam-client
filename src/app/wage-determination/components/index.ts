import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SamUIKitModule} from 'sam-ui-elements/src/ui-kit';
import {AppComponentsModule} from '../../app-components';
import {PipesModule} from '../../app-pipes/app-pipes.module';
import {CBAAuthGuard} from './authguard/authguard.service';
import {TabsCBAComponent} from './tabs/tabs-cba.component';

@NgModule({
  imports: [
    CommonModule,
    SamUIKitModule,
    ReactiveFormsModule,
    AppComponentsModule,
    PipesModule
  ],
  declarations: [
    TabsCBAComponent
  ],
  exports: [
    TabsCBAComponent
  ],
  providers: [
    CBAAuthGuard
  ],
})

export class CBAComponentsModule {
}
