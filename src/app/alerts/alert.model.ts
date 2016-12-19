export class Alert {
  private response: any;

  constructor() {
    this.response = {
      content: { }
    };
    this.setArchived(true);
    this.setDescription('');
    this.setTitle('');
    this.setEndDate(null);
    this.setPublishedDate(null);
  }

  id(): number {
    return this.response.id;
  }
  setId(id: number) {
    this.response.id = id;
  }

  archived(): boolean {
    return this.response.archived.toLowerCase() === 'y';
  }
  setArchived(archived: boolean) {
    this.response.archived = archived ? 'Inactive' : 'Active';
  }

  status(): string {
    return this.archived() ? 'Inactive' : 'Active';
  }

  title(): string {
    return this.response.content.title;
  }
  setTitle(title: string) {
    this.response.content.title = title;
  }

  description(): string {
    return this.response.content.description;
  }
  setDescription(desc: string) {
    this.response.content.description = desc;
  }

  severity(): string {
    return this.response.content.severity;
  }
  setSeverity(severity: string) {
    this.response.content.severity = severity;
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
    return this.response.content.published;
  }
  setPublishedDate(publishedDate: string) {
    this.response.content.published = publishedDate;
  }

  endDate(): string {
    return this.response.content.expires;
  }
  setEndDate(endDate: string) {
    this.response.content.expires = endDate;
  }

  static FromResponse(obj: Object): Alert {
    let a = new Alert();
    a.response = obj;
    return a;
  }
}
