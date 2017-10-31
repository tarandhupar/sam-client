import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { PageNotFoundErrorPage } from './application-content/404';
import { ProgramModule } from './assistance-listing';
import { OpportunityModule } from './opportunity';
import { WageDeterminationModule } from './wage-determination';
import { EntityModule } from './entity';
import { ExclusionModule } from './exclusion';
import { OrganizationModule } from './organization';
import { SearchModule } from './search';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from './app-components/app-components.module';
import { UsersModule } from './users';
import { OrganizationDetailModule } from "./organization-detail/organization-detail.module";
import { FALFormModule } from "./assistance-listing/assistance-listing-operations/fal-form.module";
import { ForbiddenModule } from "./application-content/403/403.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { DictionaryService } from "../api-kit/dictionary/dictionary.service";
import { SearchDictionariesService } from "../api-kit/search/search-dictionaries.service";
import { SamTitleService } from 'api-kit/title-service/title.service';
import { SamErrorService } from 'api-kit/error-service';
import { AlertFooterService } from './app-components/alert-footer/alert-footer.service';
import { LoginService } from './app-components/login/login.service';


// Application wide providers
const APP_PROVIDERS = [
  AppState,
  DictionaryService,
  SearchDictionariesService,
  SamTitleService,
  SamErrorService,
  AlertFooterService,
  LoginService
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
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,

    // Router
    RouterModule.forRoot(ROUTES),

    // Page View Modules
    UsersModule,
    AuthenticationModule,
    ProgramModule,
    OpportunityModule,
    EntityModule,
    ExclusionModule,
    OrganizationModule,
    HomeModule,
    SearchModule,
    WageDeterminationModule,
    OrganizationDetailModule,
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
    APP_PROVIDERS,
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
