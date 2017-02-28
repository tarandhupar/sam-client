import { TestBed } from '@angular/core/testing';
import { SamUIKitModule } from 'samUIKit';
import { SamAPIKitModule } from 'api-kit';
import { UserDirectoryPage } from './user-directory.page';
import { ParentOrgsComponent } from '../parent-orgs/parent-orgs.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('User Directory Page', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserDirectoryPage,
        ParentOrgsComponent,
      ],
      providers: [ ],
      imports: [
        RouterTestingModule,
        FormsModule,
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
