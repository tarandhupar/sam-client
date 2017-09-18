import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './alerts.route';
import { AlertsPage } from './alerts.page';
import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { AlertItemComponent } from './alert-item/alert-item.component';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AlertFooterService } from '../app-components/alert-footer/alert-footer.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertEditComponent } from './alert-edit/alert-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    SamUIKitModule,
    AppComponentsModule,
    PipesModule
  ],
  declarations: [
    AlertsPage,
    AlertItemComponent,
    AlertEditComponent
  ],
  providers: [],
})
export class AlertsModule { }
