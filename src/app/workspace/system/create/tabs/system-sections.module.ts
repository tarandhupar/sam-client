import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from 'app-components/app-components.module';
import { PipesModule } from 'app-pipes/app-pipes.module';

import { SectionComponents, EditComponent, ReviewComponent } from './';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    PipesModule,
  ],

  declarations: [
    SectionComponents,
    EditComponent,
    ReviewComponent,
  ],

  exports: [
    SectionComponents,
    EditComponent,
    ReviewComponent,
  ]
})
export class SystemSectionsModule { }
