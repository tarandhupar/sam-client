import * as Cookies from 'js-cookie';
import {CBAAuthGuard} from "./authguard.service";

describe('CBAAuthGuard - hasCookie', () => {
  let originalCookieFn = null;
  beforeEach(() => {
    originalCookieFn = Cookies.get;
  });

  afterEach(() => {
    Cookies.get = originalCookieFn;
  });

  it('has cookie', () => {
    Cookies.get = (s: string) => {
      return 'TEST_COOKIE';
    };

    let result = CBAAuthGuard.hasCookie();
    expect(typeof result).toEqual('boolean');
    expect(result).toBeTruthy();
    expect(result).toBe(true);
  });

  it('does not have cookie', () => {
    Cookies.get = (s: string) => {
      return null;
    };

    let result = CBAAuthGuard.hasCookie();
    expect(typeof result).toEqual('boolean');
    expect(result).toBeFalsy();
    expect(result).toBe(false);
  });
});
