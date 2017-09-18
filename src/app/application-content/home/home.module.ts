import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './home.route';
import { AppComponentsModule } from '../../app-components/app-components.module';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppComponentsModule,
    SamUIKitModule,
    SamAPIKitModule,
    routing
  ],
  declarations: [ HomePage ],
})
export class HomeModule { }
