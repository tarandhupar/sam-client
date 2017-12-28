import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamNotificationsComponent } from './sam-notifications.component';
import { PipesModule } from 'app/app-pipes/app-pipes.module';

describe('The Sam Notifications component', () => {
  let component: SamNotificationsComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamNotificationsComponent ],
      imports: [ SamUIKitModule, RouterTestingModule,PipesModule ]
    });

    fixture = TestBed.createComponent(SamNotificationsComponent);
    component = fixture.componentInstance;
    component.notifications = [{link:"/search",datetime:"2017-07-18 10:11:42",username:"Diego Ruiz",text:"You lookin for something? You lookin for something? You lookin for something?"},
    {link:"/help",datetime:"2017-07-16 10:11:42",username:"John Doe",text:"HALP"},
    {link:"/signin",datetime:"2017-07-15 10:11:42",username:"Sharon Lee",text:"Sign In"},
    {link:"/reports/overview",datetime:"2016-07-17 10:11:42",username:"Bob Joe",text:"REPORTS"},];
    fixture.detectChanges();
  });

  it('should compile SamNotificationsComponent', function () {
    expect(true).toBe(true);
  });
});
