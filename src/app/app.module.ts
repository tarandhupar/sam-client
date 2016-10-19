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
import { ROUTES } from './app.routes';
// App is our top level component
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { HomeModule } from './app-pages/home';
import { NoContent } from './common/no-content';
import { ProgramModule } from './fal';
import { DisplayModule } from './display';
import { SearchModule } from './search';
import { UIKitDemoModule } from "./app-pages/ui-kit/ui-kit.module";

import { SamAngularModule } from './common/samuikit/samuikit.module';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from '../api-kit/api-kit.module';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    NoContent,
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // Router
    RouterModule.forRoot(ROUTES, { useHash: false }),

    // Page View Modules
    ProgramModule,
    DisplayModule,
    HomeModule,
    SearchModule,
    UIKitDemoModule,

    // Other Modules
    SamAngularModule,
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
