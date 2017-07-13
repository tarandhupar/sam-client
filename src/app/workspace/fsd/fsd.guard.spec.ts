import { ActivatedRoute, Router } from '@angular/router';
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { IAMService } from 'api-kit';

import { FSDGuard } from './fsd.guard';

const router = {
  navigate: jasmine.createSpy('navigate')
};

const activatedRoute = {
  params: Observable.of({
    id: 'john.doe@gsa.com'
  })
}

xdescribe('[IAM] FSD Component Guard', () => {
  let guard: FSDGuard;
  let api: IAMService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FSDGuard,
        IAMService,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });

    guard = TestBed.get(FSDGuard);
    api = TestBed.get(IAMService);
  });

  it('Verify FSD Permission Guard (Requires Authentication)', () => {
    expect(guard.verifyRoute()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });

  it('Verify FSD Permission Guard (Without FSD Role)', () => {
    api.iam.user.states.auth = true;

    expect(guard.verifyRoute()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('Verify FSD Permission Guard (With FSD Role)', () => {
    api.iam.user.states.auth = true;
    api.iam.user.states.fsd = true;

    expect(guard.verifyRoute()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
