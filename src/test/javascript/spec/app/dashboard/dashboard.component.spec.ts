import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from '../../../../../main/webapp/app/dashboard/dashboard.component';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from '../../../../../main/webapp/app/dashboard/state-management/reducers/dashboard.reducers';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ 'dashboard': dashboardReducer })
            ],
            declarations: [DashboardComponent],
            providers: []
        })
            .overrideTemplate(DashboardComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
