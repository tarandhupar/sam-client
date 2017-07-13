import {
  SystemDirectoryComponent,
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
} from './';

export default [
  { path: '', component: SystemDirectoryComponent,  data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts Directory' },
    ]
  } },
  { path: 'profile', component: SystemProfileComponent,    data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts', url: '/workspace/system' },
      { breadcrumb: 'System Account Profile' },
    ]
  } },
  { path: 'profile/:id', component: SystemProfileComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts', url: '/workspace/system' },
      { breadcrumb: 'System Account Profile' },
    ]
  } },
  { path: 'password', component: SystemPasswordComponent,   data: {
    breadcrumbs: [
      { breadcrumb: 'System Account Password Reset' },
    ]
  } },
  { path: 'password/:id', component: SystemPasswordComponent,   data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts', url: '/workspace/system' },
      { breadcrumb: 'System Account Password Reset' },
    ]
  } },
  { path: 'migrations', component: SystemMigrationsComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts', url: '/workspace/system' },
      { breadcrumb: 'System Account Migration' },
    ]
  } },
];
