import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';
import {SavedSearchWorkspacePage} from "./saved-search-workspace/saved-search-workspace.page";
import {SearchAuthGuard} from "./authguard.service";
import {SavedSearchRedirect} from './saved-search-workspace/saved-search-redirect/saved-search-redirect.component';


export const routes: Routes = [
  { path: 'search',  component: SearchPage },
  { path: 'search/fal/regionalOffices', component: SearchPage}
];

  routes.unshift( {path: 'savedsearches/workspace', component: SavedSearchWorkspacePage, canActivate: [SearchAuthGuard] },
                  {path: 'savedsearches/:id', component: SavedSearchRedirect, canActivate: [SearchAuthGuard] });

export const routing = RouterModule.forChild(routes);
