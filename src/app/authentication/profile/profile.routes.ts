import { DetailsComponent } from './details/details.component.ts';

export default [
  { path: '',  pathMatch: 'full', redirectTo: 'details' },
  { path: 'details', component: DetailsComponent }
];
