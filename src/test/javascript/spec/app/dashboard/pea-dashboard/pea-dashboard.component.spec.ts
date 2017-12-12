import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PeaDashboardComponent } from '../../../../../../main/webapp/app/dashboard/pea-dashboard/pea-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MockPrincipal } from '../../../helpers/mock-principal.service';
import { Principal } from '../../../../../../main/webapp/app/shared';
import { OrganizationService } from '../../../../../../main/webapp/app/shared/organization/organization.service';

describe('DashboardComponent', () => {
    let component: PeaDashboardComponent;
    let fixture: ComponentFixture<PeaDashboardComponent>;
    const mockOrganizationService = jasmine.createSpyObj('mockOrganizationService', ['findByExternalId']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [PeaDashboardComponent],
            providers: [
                {
                    provide: Principal,
                    useClass: MockPrincipal
                },
                {
                    provide: OrganizationService,
                    useValue: mockOrganizationService
                }
            ]
        })
            .overrideTemplate(PeaDashboardComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PeaDashboardComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        component.jobPublicationFilter = {
            jobTitle: '',
            onlineSinceDays: 3
        };
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
