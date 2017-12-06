import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const mappings = {
  "/": "Home",
  "/forgot": "Forgot Password",
  "/help": "Help",
  "/help/overview": "Help",
  "/help/new": "Help",
  "/help/award": "Help",
  "/profile/details": "Personal Details",
  "/profile/password": "Reset Password",
  "/profile/access": "My Roles",
  "/profile/migrations": "Role Migrations",
  "/profile/request-access": "Request Access",
  "/profile/subscriptions": "Manage Subscriptions",
  "/role-management/bulk-update": "Bulk Update",
  "/role-management/roles-directory": "Roles Directory",
  "/role-management/requests": "Requests",
  "/federal-hierarchy": "FH Landing",
  "/org/detail": "FH Organization Detail",
  "/org/create": "FH Create Organization",
  "/signin": "Sign In",
  "/search": "Search",
  "/signup": "Sign Up",
  "/workspace": "Workspace",
  "/workspace/users": "FSD Users Directory",
  "/workspace/user": "FSD User Profile",
  "/workspace/system": "System Accounts Directory",
  "/workspace/system/new": "System Account Application",
  "/workspace/system/profile": "System Account Profile",
  "/workspace/system/password": "System Account Password Reset",
  "/workspace/system/migrations": "System Account Migration",
  "/workspace/requests/system": "System Account Request",
}

const buildTitle =  function buildTitle(defaultString: string, appendedString: string): string {
  return appendedString ?
          defaultString + ' | ' + appendedString :
          defaultString;
};

@Injectable()
export class SamTitleService {
  public _titleTemplate: string = 'beta.SAM.gov';

  constructor(private ngTitleService: Title) {}

  setTitleString(postFix) {
    const t = this._titleTemplate + ' | ' + postFix;
    this.ngTitleService.setTitle(t);
  }

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

    // Support for numeric route parameters (Only on the end of route)
    route = route.replace(/(\/[0-9]+)$/, '');

    return this.ngTitleService.setTitle(buildTitle(this._titleTemplate, mappings[route]));
  }

  getTitle(): string {
    return this.ngTitleService.getTitle();
  }
}
