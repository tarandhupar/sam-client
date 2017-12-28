import { NgModule } from '@angular/core';
import { EntityPage }   from './entity.page.ts';
import { routing } from './entity.route.ts';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { CommonModule } from '@angular/common';
import { EntityObjectPOC } from './entity-object-poc.component.ts';
import { EntityObjectAddress } from './entity-object-address.component.ts';
import { AppComponentsModule } from "../app-components/app-components.module";

@NgModule({
  imports: [
    CommonModule,
    routing,
    SamUIKitModule,
    CommonModule,
	AppComponentsModule
  ],
  declarations: [
    EntityPage,
    EntityObjectPOC,
    EntityObjectAddress
  ],
})
export class EntityModule { }
