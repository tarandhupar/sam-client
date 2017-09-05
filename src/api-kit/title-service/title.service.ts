import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const mappings = {
  "/forgot": "Forgot Password",
  "/help": "Help",
  "/help/overview": "Help",
  "/help/new": "Help",
  "/help/award": "Help",
  "/profile/details": "Personal Details",
  "/profile/password": "Reset Password",
  "/profile/migrations": "Migrations",
  "/signin": "Sign In",
  "/search": "Search",
  "/signup": "Sign Up",
  "/workspace": "Workspace",
  "/workspace/users": "FSD Users Directory",
  "/workspace/user": "FSD User Profile",
  "/workspace/system": "System Accounts Directory",
  "/workspace/system/profile": "System Account Profile",
  "/workspace/system/password": "System Account Password Reset",
  "/workspace/system/migrations": "System Account Migration",
}

const buildTitle =  function buildTitle(defaultString: string, appendedString: string): string {
  return appendedString ?
          defaultString + ' | ' + appendedString :
          defaultString;
};

@Injectable()
export class SamTitleService {
  private _titleTemplate: string = 'beta.SAM.gov';

  constructor(private ngTitleService: Title) {}

  setTitle(route: string): void {
    // Get rid of route params, not necessary for setting title
    let paramIndex = route.indexOf('?');
    if (paramIndex !== -1) {
      route = route.slice(0, paramIndex);
    };
    let fragmentIndex = route.indexOf('#');
    if (fragmentIndex !== -1) {
      route = route.slice(0, fragmentIndex);
    }
    return this.ngTitleService.setTitle(buildTitle(this._titleTemplate, mappings[route]));
  }

  getTitle(): string {
    return this.ngTitleService.getTitle();
  }
}
