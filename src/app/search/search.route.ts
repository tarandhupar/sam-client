import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';
import {SavedSearchWorkspacePage} from "./saved-search-workspace/saved-search-workspace.page";
import {SearchAuthGuard} from "./authguard.service";
import {SavedSearchRedirect} from './saved-search-workspace/saved-search-redirect/saved-search-redirect.component';
import { WageDeterminationRevisedDBAPage } from "../wage-determination/to-be-revised/revised-dba.page";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  { path: 'search',  component: SearchPage, canDeactivate:[FeedbackFormService] },
  { path: 'search/fal/regionalAssistanceLocations', component: SearchPage},
  { path: 'wage-determination/toberevised/dba', component: WageDeterminationRevisedDBAPage },
];

  routes.unshift( {path: 'savedsearches/workspace', component: SavedSearchWorkspacePage, canActivate: [SearchAuthGuard], canDeactivate:[FeedbackFormService] },
                  {path: 'savedsearches/:id', component: SavedSearchRedirect, canActivate: [SearchAuthGuard] });

export const routing = RouterModule.forChild(routes);
