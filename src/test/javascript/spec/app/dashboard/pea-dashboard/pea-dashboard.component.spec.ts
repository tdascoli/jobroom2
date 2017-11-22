import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PeaDashboardComponent } from '../../../../../../main/webapp/app/dashboard/pea-dashboard/pea-dashboard.component';

describe('DashboardComponent', () => {
    let component: PeaDashboardComponent;
    let fixture: ComponentFixture<PeaDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PeaDashboardComponent],
            providers: []
        })
            .overrideTemplate(PeaDashboardComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PeaDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
