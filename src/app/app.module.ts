import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.route';
// App is our top level component
import { App } from './app.component';
import { AppState } from './app.service';
import { AuthenticationModule } from './authentication';
import { HomeModule } from './application-content/home';
import { AlertsModule } from './alerts';
import { HelpModule } from './Help';
import { ReportsModule } from './Reports';
import { PageNotFoundErrorPage } from './application-content/404';
import { ErrorModule } from './application-content/error/error.module';
import { ProgramModule } from './assistance-listing';
import { OpportunityModule } from './opportunity';
import { WageDeterminationModule } from './wage-determination';
import { EntityModule } from './entity';
import { ExclusionModule } from './exclusion';
import { AwardsModule } from './awards';
import { OrganizationModule } from './organization';
import { SearchModule } from './search';
import { UIKitDemoModule } from "./application-content/ui-kit-demo/ui-kit-demo.module";


import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from './app-components/app-components.module';
import { UserDirectoryModule } from './users';
import { OrganizationDetailModule } from "./organization-detail/organization-detail.module";
import { RoleManagementModule } from "./role-management/role-management.module";
import { FALFormModule } from "./assistance-listing/assistance-listing-operations/fal-form.module";
import { ForbiddenModule } from "./application-content/403/403.module";
import { WorkspaceModule } from "./workspace/workspace.module";

// Application wide providers
const APP_PROVIDERS = [
  AppState
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    PageNotFoundErrorPage
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // Router
    RouterModule.forRoot(ROUTES),

    // Page View Modules
    UserDirectoryModule,
    AuthenticationModule,
    ProgramModule,
    OpportunityModule,
    EntityModule,
    ExclusionModule,
    AwardsModule,
    OrganizationModule,
    HomeModule,
    AlertsModule,
    HelpModule,
    ReportsModule,
    SearchModule,
    ErrorModule,
    UIKitDemoModule,
    WageDeterminationModule,
    OrganizationDetailModule,
    RoleManagementModule,
    ForbiddenModule,
    WorkspaceModule,

    //  Data Entry
    FALFormModule,

    // Other Modules
    SamAPIKitModule,
    SamUIKitModule,
    AppComponentsModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}
  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    this.appState._state = store.state;
    this.appRef.tick();
    delete store.state;
  }
  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    const state = this.appState._state;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
