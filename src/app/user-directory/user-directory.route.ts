import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryPage } from './user-directory.page';

export const routes: Routes = [
  { path: 'users',  component: UserDirectoryPage },
];

export const routing = RouterModule.forChild(routes);
