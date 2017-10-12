import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';
import {SavedSearchWorkspacePage} from "./saved-search-workspace/saved-search-workspace.page";
import {AuthGuard} from "../../api-kit/authguard/authguard.service";
import {SavedSearchRedirect} from './saved-search-workspace/saved-search-redirect/saved-search-redirect.component';


export const routes: Routes = [
  { path: 'search',  component: SearchPage },
  { path: 'search/fal/regionalOffices', component: SearchPage}
];

  routes.unshift( {path: 'savedsearches/workspace', component: SavedSearchWorkspacePage, canActivate: [AuthGuard] },
                  {path: 'savedsearches/:id', component: SavedSearchRedirect, canActivate: [AuthGuard] });

export const routing = RouterModule.forChild(routes);
