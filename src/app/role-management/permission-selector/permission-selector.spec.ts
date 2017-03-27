import { TestBed } from '@angular/core/testing';
import { PermissionSelectorComponent } from "./permission-selector";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

describe('The Permissions Selector component', () => {
  let component: PermissionSelectorComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionSelectorComponent],
      imports: [FormsModule],
    });

    fixture = TestBed.createComponent(PermissionSelectorComponent);
    component = fixture.componentInstance;
    component.options = [
      { value: 0, label: 'label-0' },
      { value: 1, label: 'label-1' }
    ];
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should select all permissions', () => {
    fixture.debugElement.query(By.css('.check-all')).nativeElement.click();
    fixture.detectChanges();
    expect(component.options[1].isSelected).toBeTruthy();
  });

  it('should select all defaults', () => {
    fixture.debugElement.query(By.css('.check-all-defaults')).nativeElement.click();
    fixture.detectChanges();
    expect(component.options[1].isDefault).toBeTruthy();
  })
});
