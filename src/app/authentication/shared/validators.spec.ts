import { FormControl } from '@angular/forms';
import { Validators } from './validators';

const runTests = ((control: FormControl, tests: { [value: string]: boolean; }) => {
  let test;

  for(test in tests) {
    control.patchValue(test);
    expect(control.valid).toBe(tests[test]);
  }
});

describe('[IAM] Custom Validators', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('Testing validator "email" (is a valid email format)', () => {
    control.setValidators(Validators.email);

    runTests(control, {
      'john.doe@gmail.com': true,
      'john+doe@gmail.com': true,
      'john!doe@gmail.com': false,
      'john_doe@gmail.com': true,
      'john+doe':           false,
      'john.doe@':          false,
      'john.doe@gmail':     false,
    });
  });

  it('Testing validator "numeric" (atleast 1 numeric)', () => {
    control.setValidators(Validators.numeric);

    runTests(control, {
      'password':  false,
      'password!': false,
      'password0': true,
      '0':         true,
    });
  });

  it('Testing validator "special" (atleast 1 special character)', () => {
    control.setValidators(Validators.special);

    runTests(control, {
      'string':  false,
      '123456':  false,
      'string1': false,
      'string)': true,
      '12345!':  true,
      '%':       true,
    });
  });

  it('Testing validator  "uppercase" (atleast 1 uppercase character)', () => {
    control.setValidators(Validators.uppercase);

    runTests(control, {
      'lowercase':  false,
      '123456':     false,
      '!mixed':     false,
      '!Mixed)':    true,
      'O':          true,
    });
  });

  it('Testing validator: "minlength" (minimum length requirement)', () => {
    control.setValidators(Validators.minlength(12));
    control.markAsDirty();

    runTests(control, {
      '12345678901':   false,
      '123456789012':  true,
      '1234567890123': true,
      '':              false,
      ' ':             false,
      '123 space !2':  true,
    });
  });

  it('Testing validator "consecutive" (no more than 2 consecutive characters can match any of the provided array of substrings)', () => {
    control.setValidators(Validators.consecutive(['java','php','node','ruby']));

    runTests(control, {
      'ava':        false,
      'a1sauce':    true,
      'coldfusion': true,
      'python':     true,
      'javascript': false,
      'php-node':   false,
      'ph':         false,
      '12':         true,
      '!!':         true,
      'h':          true,
      '':           true,
    });
  });
});
