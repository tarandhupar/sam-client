import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,FormBuilder }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamListBuilderActionComponent } from './sam-listbuilder-action.component';
import { PipesModule } from 'app/app-pipes/app-pipes.module';

describe('The Sam ListBuilderAction component', () => {
    describe("isolated tests", ()=>{
        let component: SamListBuilderActionComponent;

        beforeEach(()=>{
            component = new SamListBuilderActionComponent();
        });

        it("should be able to toggle", ()=>{
            component.toggleDropdown();
            expect(component.dropdownState).toBe(true);
        });

        it("should hide dropdown on clickOutside", ()=>{
            component.dropdownState = true;
            component.clickOutside();
            expect(component.dropdownState).toBe(false);
        });

        it("should emit events on action", ()=>{
            component.action.subscribe(val =>{
                expect(val).toBe("test");
                expect(component.dropdownState).toBe(false);
            });
            component.actionHandler("test");
        });
    });
    describe("rendered tests", ()=>{
        let component: SamListBuilderActionComponent;
        let fixture: any;
        let fb: FormBuilder = new FormBuilder();

        beforeEach(() => {
            TestBed.configureTestingModule({
            declarations: [ SamListBuilderActionComponent ],
            imports: [ SamUIKitModule ]
            });

            fixture = TestBed.createComponent(SamListBuilderActionComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should compile', function () {
            expect(true).toBe(true);
        });
    });
});
