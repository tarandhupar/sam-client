import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './workspace.route';
import {WorkspacePage} from './workspace.page';
import {SamUIKitModule} from 'sam-ui-kit';
import {AppComponentsModule} from '../app-components/app-components.module';
import {AssistanceProgramResult} from '../federal-assistance-program/program-result/assistance-program-result.component';


@NgModule({
  imports: [
    SamUIKitModule,
    BrowserModule,
    routing,
    AppComponentsModule
  ],
  exports: [AssistanceProgramResult],
  declarations: [
    WorkspacePage,
    AssistanceProgramResult
  ],
  providers: [],
})
export class WorkspaceModule {

}
