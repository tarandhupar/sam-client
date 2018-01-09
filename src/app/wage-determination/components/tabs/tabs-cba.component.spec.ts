import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ExclusionsResult} from './exclusions-result.component';
import {TabsCBAComponent} from './tabs-cba.component';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

class MockActivatedRoute extends ActivatedRoute {
  constructor() {
    super();
    this.params = Observable.of({id: '5'});
  }
}

describe('TabsCBAComponent - isEdit', () => {
  let fixture: ComponentFixture<TabsCBAComponent>;
  let component: TabsCBAComponent;
  let MockRoute = {
    'snapshot': {
      '_routeConfig': {
        path: 'wage-determination/cba/:id/edit'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsCBAComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: MockRoute
        }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(TabsCBAComponent);
      component = fixture.componentInstance;
    });
  }));

  it('test populated current route config', () => {
    fixture.detectChanges();
    expect(typeof component.currentRouteConfig).toBe('string');
    expect(component.currentRouteConfig).toBe(MockRoute.snapshot._routeConfig.path);
  });

  it('test is edit', () => {
    fixture.detectChanges();
    expect(typeof component.isEdit).toBe('boolean');
    expect(component.isEdit).toBeTruthy();
  });
});

describe('TabsCBAComponent - permissions', () => {
  let fixture: ComponentFixture<TabsCBAComponent>;
  let component: TabsCBAComponent;
  let MockRoute = {
    'snapshot': {
      '_routeConfig': {
        path: 'wage-determination/cba/:id/edit'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsCBAComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: MockRoute
        }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(TabsCBAComponent);
      component = fixture.componentInstance;
    });
  }));

  it('test null cba', () => {
    component.data = null;
    fixture.detectChanges();
    expect(typeof component.canEdit).toBe('boolean');
    expect(component.canEdit).toBeFalsy();
    expect(component.canEdit).toBe(false);
  });

  it('test no links', () => {
    component.data = {
      status: 'draft'
    };
    fixture.detectChanges();
    expect(typeof component.canEdit).toBe('boolean');
    expect(component.canEdit).toBeFalsy();
    expect(component.canEdit).toBe(false);
  });

  it('test missing edit', () => {
    component.data = {
      status: 'draft',
      _links: {
        'cba:create': {
          'href': '/wdol/v1/cba'
        }
      }
    };
    fixture.detectChanges();
    expect(typeof component.canEdit).toBe('boolean');
    expect(component.canEdit).toBeFalsy();
    expect(component.canEdit).toBe(false);
  });

  it('test missing status', () => {
    component.data = {
      _links: {
        'cba:create': {
          'href': '/wdol/v1/cba'
        }
      }
    };
    fixture.detectChanges();
    expect(typeof component.canEdit).toBe('boolean');
    expect(component.canEdit).toBeFalsy();
    expect(component.canEdit).toBe(false);
  });

  it('test published', () => {
    component.data = {
      status: 'published',
      _links: {
        'cba:create': {
          'href': '/wdol/v1/cba'
        }
      }
    };
    fixture.detectChanges();
    expect(typeof component.canEdit).toBe('boolean');
    expect(component.canEdit).toBeFalsy();
    expect(component.canEdit).toBe(false);
  });

  it('test can edit', () => {
    component.data = {
      status: 'draft',
      _links: {
        'cba:update': {
          'href': '/wdol/v1/cba/1'
        }
      }
    };
    fixture.detectChanges();
    expect(typeof component.canEdit).toBe('boolean');
    expect(component.canEdit).toBeTruthy();
    expect(component.canEdit).toBe(true);
  });
});

describe('TabsCBAComponent - tabClicked', () => {
  let fixture: ComponentFixture<TabsCBAComponent>;
  let component: TabsCBAComponent;
  let MockRoute = {
    'snapshot': {
      '_routeConfig': {
        path: 'wage-determination/cba/:id/edit'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsCBAComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: MockRoute
        }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(TabsCBAComponent);
      component = fixture.componentInstance;
    });
  }));

  it('test no id', () => {
    let tab = {
      label: 'TEST_LABEL',
      routeConfig: 'TEST_ROUTE_CONFIG'
    };
    component.data = { text: 'TEST_ID' };
    spyOn(component.tabClick, 'emit');
    fixture.detectChanges();
    component.tabClicked(tab);
    expect(component.tabClick.emit).toHaveBeenCalledTimes(0);
  });

  it('test current route', () => {
    let tab = {
      label: 'TEST_LABEL',
      routeConfig: 'wage-determination/cba/:id/edit'
    };
    component.data = { text: 'TEST_ID' };
    spyOn(component.tabClick, 'emit');
    fixture.detectChanges();
    component.tabClicked(tab);
    expect(component.tabClick.emit).toHaveBeenCalledTimes(0);
  });

  it('test calling emit', () => {
    let tab = {
      label: 'TEST_LABEL',
      routeConfig: 'TEST_ROUTE_CONFIG'
    };
    component.data = { id: 'TEST_ID' };
    spyOn(component.tabClick, 'emit');
    fixture.detectChanges();
    component.tabClicked(tab);
    expect(component.tabClick.emit).toHaveBeenCalled();
    expect(component.tabClick.emit).toHaveBeenCalledWith({
      label: 'TEST_LABEL',
      routeConfig: 'TEST_ROUTE_CONFIG'
    });
  });
});
