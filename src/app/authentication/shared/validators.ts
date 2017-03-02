import { indexOf } from 'lodash';
import { FormControl } from '@angular/forms';

export const Validators = {
  email(c: FormControl) {
    const PATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return PATTERN.test(c.value) ? null : {
      email: {
        valid: false
      }
    };
  },

  numeric(c: FormControl) {
    const PATTERN = /[0-9]/;
    return PATTERN.test(c.value) ? null : {
      numeric: {
        valid: false
      }
    };
  },

  special(c: FormControl) {
    const PATTERN = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return PATTERN.test(c.value) ? null : {
      special: {
        valid: false
      }
    };
  },

  uppercase(c: FormControl) {
    const PATTERN = /[A-Z]/;
    return PATTERN.test(c.value) ? null : {
      uppercase: {
        valid: false
      }
    };
  },

  unique(targetName) {
    return (c: FormControl) => {
      let elements = document.querySelectorAll(`input[name="${targetName}"]`),
          intElement,
          occurrences = 0;

      for(intElement = 0; intElement < elements.length; intElement++) {
        if(c.value === (<HTMLInputElement>elements[intElement]).value && c.value !== '        ') {
          occurrences++;
        }
      }

      return occurrences <= 1 ? null : {
        unique: {
          valid: false
        }
      };
    };
  },

  match(targetName) {
    return (c: FormControl) => {
      let element = document.querySelector(`input[name="${targetName}"]`),
          target = (element && <HTMLInputElement>element).value || null;

      if(!element) {
        console.warn(`There was no input found with the name attribute "${targetName}"`)
      }

      return (c.value === target) ? null : {
        match: {
          valid: false
        }
      };
    };
  },

  minlength(min) {
    return (c: FormControl) => {
      return (c.value || '').trim().length >= min ? null : {
        minlength: {
          valid: false
        }
      }
    };
  }
}
