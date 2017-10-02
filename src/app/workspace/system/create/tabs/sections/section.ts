export class Section {
  protected labels = {};

  label(key: string): string {
    return this.labels[key] ? this.labels[key].label : null;
  }

  hint(key: string): string {
    return this.labels[key] ? this.labels[key].hint : null;
  }

  errors() {
    return '';
  }
}
