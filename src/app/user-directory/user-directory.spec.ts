import { TestBed } from '@angular/core/testing';
import { SamUIKitModule } from "ui-kit";
import { SamAPIKitModule } from "api-kit";
import { UserDirectoryPage } from "./user-directory.page";

describe('User Directory Page', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      providers: [ ],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
      ]
    });

    fixture = TestBed.createComponent(UserDirectoryPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
	});
});
