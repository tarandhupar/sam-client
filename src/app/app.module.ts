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
import { HomeModule } from './application-content/home';
import { AlertsModule } from './application-content/alerts'
import { PageNotFoundErrorPage } from './application-content/404';
import { ProgramModule } from './assistance-listing';
import { OpportunityModule } from './opportunity';
import { OrganizationModule } from './organization';
import { SearchModule } from './search';
import { UIKitDemoModule } from "./application-content/ui-kit-demo/ui-kit-demo.module";

import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';

// Application wide providers
const APP_PROVIDERS = [
  AppState
];
var useHashValue = document.getElementsByTagName('html')[0].className == "ie9" ? true : false;
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    PageNotFoundErrorPage,
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // Router
    RouterModule.forRoot(ROUTES, { useHash: useHashValue }),

    // Page View Modules
    ProgramModule,
    OpportunityModule,
    OrganizationModule,
    HomeModule,
    AlertsModule,
    SearchModule,
    UIKitDemoModule,

    // Other Modules
    SamUIKitModule,
    SamAPIKitModule,
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
