import { ActivatedRoute } from '@angular/router';
import { DebugElement } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';

import { FHService, WrapperService } from 'api-kit';
import { FHWrapperService } from '../../../../api-kit/fh/fhWrapper.service';

import { UserComponent } from './user.component';

const response = Observable.of({
  _embedded: [{
    org: {
      type:           'DEPARTMENT',
      hierarchy:      [100006688],
      level:          'D',
      fullParentPath: '',
      elementId:      1000000,
      l1Name:         'Dummy'
    }
  }]
});

const stubs = {
  ActivatedRoute: {
    params: Observable.of({
      id: 'john.doe@gsa.com'
    })
  },

  FHService: {
    getDepartments() {
      return response;
    },

    getOrganizationById(id: string, includeChildrenLevels: boolean) {
      return response;
    }
  },

  WrapperService: {
    call(oApiParam) {
      return {};
    }
  }
};

xdescribe('[IAM] UserComponent]', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        SamUIKitModule
      ],

      declarations: [
        UserComponent
      ],

      providers: [
        { provide: ActivatedRoute, useValue: stubs.ActivatedRoute },
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: WrapperService, useValue: stubs.WrapperService },
        { provide: FHService, useValue: stubs.FHService },
        FHWrapperService,
      ]
    });

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('verify account deactivation', () => {
    let button = fixture.debugElement.query(By.css('sam-button button')).nativeElement;

    button.click();

    fixture.whenStable().then(() => {
      expect(component.confirmDeactivation()).toHaveBeenCalled();
    });
  });

  it('verify password reset', () => {
    let button = fixture.debugElement.query(By.css('button:last-child')).nativeElement;

    button.click();

    fixture.whenStable().then(() => {
      expect(component.sendPasswordReset()).toHaveBeenCalled();
    });
  });
});
