import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';

import { FHService, PeoplePickerService, WrapperService } from 'api-kit';
import { FHWrapperService } from '../../../api-kit/fh/fhWrapper.service';

import { AgencyPickerComponent } from '../agency-picker/agency-picker.component';
import { SamTitleSubtitleComponent } from '../title-subtitle/title-subtitle.component';
import { SamUserDirectoryComponent } from './user-directory.component';

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
  api: {
    call(oApiParam) {
      return {};
    }
  },

  fh: {
    getDepartments() {
      return response;
    },

    getOrganizationById(id: string, includeChildrenLevels: boolean) {
      return response;
    }
  },

  activatedRoute: {
    params: Observable.of({
      id: 'john.doe@gsa.com'
    })
  },

  router: {
    navigate: jasmine.createSpy('navigate')
  }
};

describe('User Directory Component', () => {
  let component: SamUserDirectoryComponent;
  let fixture: ComponentFixture<SamUserDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule,
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
      ],

      declarations: [
        AgencyPickerComponent,
        SamTitleSubtitleComponent,
        SamUserDirectoryComponent,
      ],

      providers: [
        BaseRequestOptions,
        MockBackend,
        PeoplePickerService,
        FHWrapperService,
        { provide: WrapperService, useValue: stubs.api },
        { provide: FHService, useValue: stubs.fh },
        { provide: Router, useValue: stubs.router },
        { provide: ActivatedRoute, useValue: stubs.activatedRoute },
        {
          provide: Http,
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });

    fixture = TestBed.createComponent(SamUserDirectoryComponent);
    component = fixture.componentInstance;
  });

  it('Verify `searchable`, `sortable`, `filterable` => ON', () => {
    expect(fixture.nativeElement.querySelector('.usa-search-container')).toBeDefined();
    expect(fixture.nativeElement.querySelector('.usa-sort-container')).toBeDefined();
    expect(fixture.nativeElement.querySelector('.usa-filter-container')).toBeDefined();
  });

  it('Verify `searchable` => OFF', () => {
    component.searchable = false;
    expect(fixture.nativeElement.querySelector('.usa-search-container')).toBeNull();
  });

  it('Verify `sortable` => OFF', () => {
    component.sortable = false;
    expect(fixture.nativeElement.querySelector('.usa-sort-container')).toBeNull();
  });

  it('Verify `filterable` => OFF', () => {
    component.filterable = false;
    expect(fixture.nativeElement.querySelector('.usa-filter-container')).toBeNull();
  });
});
