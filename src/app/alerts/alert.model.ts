import { AlertType } from "../../api-kit/system-alerts/system-alerts.service";

export class Alert {
  private _raw: AlertType = {
    content: {
      title: '',
      description: '',
    }
  };

  constructor() {  }

  id(): number {
    return this._raw.id;
  }

  status(): string {
    return this._raw.status;
  }

  title(): string {
    return this._raw.content.title;
  }
  setTitle(title: string) {
    this._raw.content.title = title;
  }

  description(): string {
    return this._raw.content.description;
  }
  setDescription(desc: string) {
    this._raw.content.description = desc;
  }

  severity(): string {
    return this._raw.content.severity;
  }
  setSeverity(severity: string) {
    this._raw.content.severity = severity;
  }

  colorClass(): string {
    switch (this.severity().toLowerCase()) {
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
    switch (this.severity().toLowerCase()) {
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

  alertClass(): string {
    switch (this.severity().toLowerCase()) {
      case 'warning':
        return 'usa-alert-warning';
      case 'informational':
        return 'usa-alert-info';
      case 'error':
        return 'usa-alert-error';
      default:
        return 'usa-alert-error';
    }
  }

  publishedDate(): string {
    return this._raw.content.published;
  }
  setPublishedDate(publishedDate: string) {
    this._raw.content.published = publishedDate;
  }

  endDate(): string {
    return this._raw.content.expires;
  }
  setEndDate(endDate: string) {
    this._raw.content.expires = endDate;
  }

  raw(): AlertType {
    return this._raw;
  }

  static FromResponse(res: AlertType): Alert {
    let a = new Alert();
    a._raw = res;
    return a;
  }
}
