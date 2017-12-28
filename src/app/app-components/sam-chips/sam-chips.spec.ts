import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamChipsComponent } from './sam-chips.component';

describe('The Sam Chips component', () => {
  let component: SamChipsComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamChipsComponent ],
      imports: [ SamUIKitModule, RouterTestingModule, BrowserAnimationsModule, FormsModule ]
    });

    fixture = TestBed.createComponent(SamChipsComponent);
    component = fixture.componentInstance;
    component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value"
    };
    component.options = [{
        key:"aaa",
        value:"aaaa"
    }];
    fixture.detectChanges();
  });

  it('should compile sam chips', ()=>{
    expect(true).toBe(true);
  });

  it("should select on enter", ()=>{
    component.selectOnEnter({
        keyCode: "13",
        target: {
            value: "aaaa"
        }
    });
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
        expect(component.value[0].value).toBe("aaaa");
    });
  });
});
