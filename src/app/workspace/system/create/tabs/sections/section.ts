import { FormGroup } from '@angular/forms';

export class Section {
  protected labels = {};

  label(key: string): string {
    return this.labels[key] ? this.labels[key].label : null;
  }

  hint(key: string): string {
    return this.labels[key] ? this.labels[key].hint : null;
  }

  getError(form: FormGroup, controlKey: (Array<string|number>|string), submitted: boolean = false): string {
    let control = form.get(controlKey),
        errors = '',
        key;

    if(submitted && control.errors) {
      for(key in control.errors) {
        switch(key) {
          case 'required':
            errors = 'This field is required';
            break;
        }

        if(errors.length) {
          return errors;
        }
      }
    }

    return errors;
  }
}
