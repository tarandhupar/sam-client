import { SamEventListener } from '../../app/app-utils/event-listener';

const initialState = {
  errors: [],
  unacknowledgedErrors: [],
  acknowledgedErrors: [],
  ignoredURLs: {},
  messages: {
    default: 'The service is currently unavailable. Please wait a moment and try again. If problem persists, contact help desk.',
  }
}

export class SamErrorService {
  public addEventListener: any;
  public removeEventListener: any;
  /**
   * Events:
   * newError
   * removeError
   * clearAll
   */

  /**
   * errors
   *   name
   *     suffic
   *      method: []
   */
  private errors: any = {};
  private store;
  private idIncrementor = 0;
  private events: any;

  constructor() {
    this.events = new SamEventListener('newError', 'removeError', 'clearAll');
    this.addEventListener = this.events.addEventListener.bind(this.events);
    this.removeEventListener = this.events.removeEventListener.bind(this.events);
  }

  public addError(errObj: { req, res }): void {
    if (!errObj && !errObj.req && !errObj.res) {
      return;
    }

    if (errObj.req.name && !this.errors[errObj.req.name]) {
      this.errors[errObj.req.name] = {};
    }

    if (errObj.req.suffix && !this.errors[errObj.req.name][errObj.req.suffix]) {
      this.errors[errObj.req.name][errObj.req.suffix] = {};
    }

    if (errObj.req.method && !this.errors[errObj.req.name][errObj.req.suffix][errObj.req.method]) {
      this.errors[errObj.req.name][errObj.req.suffix][errObj.req.method] = [errObj];
      const message = this.generateErrorMessage(errObj.res.statusCode);
      const returnError: any = errObj;
      returnError.message = message;
      this.events.fire('newError', returnError);
    }
  }

  public removeError(errObj) {
    delete this.errors[errObj.req.name][errObj.req.suffix][errObj.req.method];
    this.events.fire('removeError', errObj);
  }

  public clearAllErrors() {
    this.errors = {};
    this.events.fire('clearAll');
  }

  public getErrors(): any[] {
    return this.errors;
  }

  private generateErrorMessage(errorCode) {
    switch (errorCode) {
      case 0:
        return { title: "Connection Unavailable",
                 description: "We can't find a connection. Check your internet connection and try again." };
      case 400:
        return { title: "Bad Request",
                 description: "There is something wrong with your request. Please change parameters and try again." };
      case 401:
        return { title: "Service Unavailable",
                 description: "We're having a problem now. Please try again in a few minutes." }
      case 403:
        return { title: "Service Unavailable",
                 description: "We're having a problem now. Please try again in a few minutes." }
      case 405:
        return { title: "Service Unavailable",
                description: "We're having a problem now. Please try again in a few minutes." }
      case 500:
        return { title: "Service Unavailable",
                description: "We're having a problem now. Please try again in a few minutes." }
      case 501:
        return { title: "Service Unavailable",
                description: "We're having a problem now. Please try again in a few minutes." }
      case 503:
        return { title: "Service Unavailable",
                  description: "We're having a problem now. Please try again in a few minutes." }
      default:
      return { title: "Service Unavailable",
               description: "We're having a problem now. Please try again in a few minutes." }        
    }
  }

}