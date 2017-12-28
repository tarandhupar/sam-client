import { Routes, RouterModule } from '@angular/router';
import { ObjectWorkspacePage } from './object-workspace.page';
import { ObjectDetailsPage } from './object-details/object-details.page';
import { RoleDetailsPage } from './role-details/role-details.page';
import { RoleDefinitionPage } from './role-definition/role-definition.page';
import { UserResolve } from './user.resolve';
import { ManageRequestPage } from './manage-request/manage-request';
import { RoleMgmtWorkspace } from './rolemgmt-workspace.page.ts';
import { RolesDirectoryPage } from './roles-directory/roles-directory.page';
import { BulkUpdateComponent } from './bulk-update/bulk-update.component';
import { IsLoggedInGuard } from '../app-services/is-logged-in.guard';
import { RmAccessGuard } from '../app-services/rm-access.guard';
import { RMBackDoorComponent } from './back-door/back-door.component';
import { ViewRequestPage } from './view-request/view-request.page';
import { RequestResponsePage } from './request-response/request-response.page';
import { RequestAccessResolve } from './request-access.resolve';
import { ProfileComponent } from '../users/profile.component';
import { MyAccessPage } from '../users/access/my-access.page';
import { GrantOrEditAccess } from './grant-or-edit-access/grant-or-edit-access';

export const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'users',
      children: [
        {
          path: ':id/edit-access',
          component: GrantOrEditAccess,
          canActivate: [ RmAccessGuard ],
          data: { grantOrEdit: 'edit', pageName: 'users/:id/edit-access' },
        },
        {
          path: ':id/assign-roles',
          component: GrantOrEditAccess,
          canActivate: [ RmAccessGuard ],
          data: { grantOrEdit: 'grant', pageName: 'users/:id/assign-roles' },
        },
      ]
    },
    {
      path: 'users/:id/access',
      component: ProfileComponent,
      canActivate: [ RmAccessGuard ],
      resolve: { user: UserResolve },
      data: {
        isMyAccess: false,
        pageName: 'users/:id/access',
        breadcrumbs: [
          { breadcrumb: 'Their Roles' }
        ]
      },
      children: [
        { path: '', component: MyAccessPage },
      ]
    },
    {
      path: 'bulk-update',
      component: BulkUpdateComponent,
      canActivate: [RmAccessGuard],
      data: {pageName:'access/bulk-update'}
    },
    {
      path: 'workspace',
      component: RoleDefinitionPage,
      canActivate: [RmAccessGuard],
      data: {pageName:'workspace'}
    },
    {
      path: 'objects/new',
      component: ObjectDetailsPage,
      canActivate: [RmAccessGuard],
      data: {pageName:'objects'}
    },
    {
      path: 'roles/new',
      component: RoleDetailsPage,
      canActivate: [RmAccessGuard],
      data: {pageName:'roles'}
    },
    {
      path: 'objects/:objectId/edit',
      component: ObjectDetailsPage,
      canActivate: [RmAccessGuard],
      data: {pageName:'objects'}
    },
    {
      path: 'roles/:roleId/edit',
      component: RoleDetailsPage,
      canActivate: [RmAccessGuard],
      data: { pageName: 'roles' }
    },
    {
      path: 'requests',
      component: RoleMgmtWorkspace,
      canActivate: [RmAccessGuard],
      data: { pageName: 'requests' }
    },
    {
      path: 'roles-directory',
      component: RolesDirectoryPage,
      canActivate: [RmAccessGuard],
      data: {pageName:'roles-directory'},
    },
    {
      path: 'requests/:requestId',
      component: ViewRequestPage,
      data: { pageName: 'requests/:id' },
      canActivate: [ IsLoggedInGuard, RmAccessGuard ],
      resolve: {
        request: RequestAccessResolve,
      },
    },
    {
      path: 'requests/:requestId/respond',
      component: RequestResponsePage,
      data: { pageName: 'requests/:id/respond' },
      canActivate: [ IsLoggedInGuard, RmAccessGuard ],
      resolve: {
        request: RequestAccessResolve,
      },
    },
  ]
}];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'rm', component: RMBackDoorComponent });
}

export const routing = RouterModule.forChild(routes);
