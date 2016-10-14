import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamSearchbarComponent } from './sam-searchbar.component.ts';
import { SamAngularModule } from '../../sam-angular';

describe('The Sam Search Bar component', () => {
  let component: SamSearchbarComponent;
  let fixture: any;

  // Default configuration for the search bar
  let defaultConfig: any = {
    size: "large",
    keyword: "default",
    placeholder: "",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamSearchbarComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamSearchbarComponent);
    component = fixture.componentInstance;
    component.size = defaultConfig.size;
    component.keyword = defaultConfig.keyword;
    component.placeholder = defaultConfig.placeholder;

  });

  it('should display large search bar with empty keyword and placeholder',function(){
    expect(component.isSizeSmall()).toBe(false);
    expect(component.keyword).toBe("default");
    expect(component.placeholder).toBe("");

  })

  it('should output event with search object when search button clicked', () => {
    let searchBtn: any;
    component.onSearch.subscribe(searchObj => {
      expect(searchObj.keyword).toBe('default');
      expect(searchObj.searchField).toBe('');
    });
    fixture.detectChanges();
    searchBtn = fixture.debugElement.query(By.css('.search-btn'));
    searchBtn.triggerEventHandler('click',null);

  });
  
});
