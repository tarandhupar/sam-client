import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './error.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { GenericErrorPage } from './error.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SamUIKitModule,
    SamAPIKitModule,
    routing
  ],
  declarations: [ GenericErrorPage ],
})
export class ErrorModule { }
