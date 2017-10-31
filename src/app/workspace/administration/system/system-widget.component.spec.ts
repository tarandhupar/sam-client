import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from 'app-components/app-components.module';
import { PipesModule } from 'app-pipes/app-pipes.module';

import { SystemWidgetComponent } from './system-widget.component';

@Component({
  template: `<system-widget></system-widget>`,
})
class SystemWidgetTestComponent {
  @ViewChild(SystemWidgetComponent) widget: SystemWidgetComponent;
}

xdescribe('[Workspace] System Account Widget', () => {
  let component: SystemWidgetTestComponent,
      fixture: ComponentFixture<SystemWidgetTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        SamUIKitModule,
        AppComponentsModule,
        PipesModule,
      ],

      declarations: [
        SystemWidgetTestComponent,
        SystemWidgetComponent,
      ],
    });

    fixture = TestBed.createComponent(SystemWidgetTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('verify status values are displayed', () => {
    let de = fixture.debugElement,
        items = de.queryAll(By.css('system-widget .column:nth-child(1) .list a'));

    expect(items.length).toBe(4);
  });

  it('verify roles => ["System Admin","System Manager"]', () => {
    let de = fixture.debugElement,
        items;

    component.widget.user.systemAccount = true;

    fixture.detectChanges();

    items = de.queryAll(By.css('system-widget .column:nth-child(2) .list a'));

    expect(items.length).toBe(1);
  });
});
