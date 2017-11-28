import {
    inject,
    TestBed,
    ComponentFixture
  } from '@angular/core/testing';

  import {SamUIKitModule} from "sam-ui-elements/src/ui-kit";
  import {OppPieChartComponent} from './opp-pie-chart.component';

  let component: OppPieChartComponent;
  let fixture: ComponentFixture<OppPieChartComponent>;
  
  describe('Workspace Page: Contract Opportunity Widget - Pie Chart Component', () => {
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OppPieChartComponent],
        imports: [
          SamUIKitModule
        ],
        providers: [
          
        ]
      });
  
      fixture = TestBed.createComponent(OppPieChartComponent);
      component = fixture.componentInstance;
      component.deadlineStatusData = {
                                        'active': 2702,
                                        'archived': 16132,
                                        'outside_week': 3,
                                        'within_week': 0
                                    };
      fixture.detectChanges();
    });

    it('should initialize data without error', () => {
        expect(component.deadlineStatusData).toEqual({
            'active': 2702,
            'archived': 16132,
            'outside_week': 3,
            'within_week': 0
        });
        expect(component.initLoad).toBe(true);
    });

    it('should sum all of the provided counts', () => {
        let labels = ['within_week', 'outside_week'];
        expect(component.sumDataFromLabels(labels, component.deadlineStatusData)).toBe(3);
    });

    it('should correctly prepare labels and values for the pie chart', () => {
        expect(component.prepareVisualizationData(component.deadlineStatusData)).toEqual([
            {label:'Active < 7,0%',value:0},
            {label:'Active > 7,100%',value:100}
        ]);
    });

    it('should have null visualization data', () => {
        component.deadlineStatusData = {
            'active': 1,
            'archived': 1,
            'outside_week': 0,
            'within_week': 0
        };

        expect(component.prepareVisualizationData(component.deadlineStatusData)).toBeNull();
    });
});