import {
  SystemDirectoryComponent,
  SystemCreateComponent,
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
  SystemStatusComponent,
} from './';

export default [
  { path: '', component: SystemDirectoryComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts Directory' },
    ]
  } },
  { path: 'new', component: SystemCreateComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts', url: '/workspace/system' },
      { breadcrumb: 'New System Account' },
    ]
  } },
  { path: 'new/:id', component: SystemCreateComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'System Accounts', url: '/workspace/system' },
      { breadcrumb: 'New System Account' },
    ]
  } },
  { path: 'profile', component: SystemProfileComponent, data: {
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
  { path: 'password', component: SystemPasswordComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'System Account Password Reset' },
    ]
  } },
  { path: 'password/:id', component: SystemPasswordComponent, data: {
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
  { path: 'status/:id', component: SystemStatusComponent, data: {
    breadcrumbs: false
  } },
];
