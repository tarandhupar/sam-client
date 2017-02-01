import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SamUIKitModule } from "ui-kit";
import { SamHeaderMenuComponent } from "./header-menu.component";

describe('The Sam Header Menu component', () => {
  let component: SamHeaderMenuComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamHeaderMenuComponent],
    });

    fixture = TestBed.createComponent(SamHeaderMenuComponent);
    component = fixture.componentInstance;
  });

  it('Component compiles successfully', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('@Input `open`', () => {
    let component = fixture.componentInstance,
        element = fixture.nativeElement,
        computed = element.currentStyle ? element.currentStyle : getComputedStyle(element, null);

    expect(computed.display).toEqual('none');

    if(computed.display == 'none') {
      component.open = true;
      fixture.detectChanges();
      expect(computed.display).toContain('block');
    }
  });

  it('@Input `onOpen` emits correcty', async(() => {
    let component = fixture.componentInstance,
        menu = fixture.nativeElement,
        isEmit = false;

    component.onOpen = () => { isEmit = true; };

    fixture.detectChanges();
    component.open = true;

    fixture.whenStable().then(() => {
      expect(isEmit).toBe(true);
    });
  }));

  it('@Input `onClose` emits correcty', async(() => {
    let component = fixture.componentInstance,
        menu = fixture.nativeElement,
        isEmit = false;

    component.open = true;
    component.onClose = () => { isEmit = true; };

    fixture.detectChanges();
    component.open = false;

    fixture.whenStable().then(() => {
      expect(isEmit).toBe(true);
    });
  }));


  it('@Input `onSelect` emits', async(() => {
    let component = fixture.componentInstance,
        menuItem,
        isEmit = false;

    fixture.whenStable().then(() => {
      expect(isEmit).toBe(true);
    });

    component.items = [
      { text: 'Menu Link' }
    ];

    component.onSelect = () => { isEmit = true; };
    fixture.detectChanges();

    menuItem = fixture.debugElement.query(By.css('.sam-header-menu'));

    if(menuItem) {
      menuItem.triggerEventHandler('click', null);
    }

    fixture.whenStable().then(() => {
      expect(isEmit).toBe(true);
    });
  }));
});
