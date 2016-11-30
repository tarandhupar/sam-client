export class Alert {
  private response: any;

  constructor() {

  }

  status(): string {
    return "OK";
  }

  title(): string {
    return this.response.content.title;
  }

  description(): string {
    return this.response.content.description;
  }

  type(): string {
    return this.response.content.severity;
  }

  colorClass(): string {
    switch (this.response.content.severity.toLowerCase()) {
      case 'warning':
        return 'usa-color-warning';
      case 'informational':
        return 'usa-color-info';
      case 'error':
        return 'usa-color-error';
      default:
        return 'usa-color-error';
    }
  }

  iconClass(): string {
    switch (this.response.content.severity.toLowerCase()) {
      case 'warning':
        return 'fa-exclamation-circle';
      case 'informational':
        return 'fa-info-circle';
      case 'error':
        return 'fa-exclamation-triangle';
      default:
        return 'fa-exclamation-triangle';
    }
  }

  publishedDate(): string {
    return this.response.content.published;
  }

  endDate(): string {
    return this.response.content.expires;
  }

  static FromResponse(obj: Object): Alert {
    let a = new Alert();
    a.response = obj;
    return a;
  }
}
