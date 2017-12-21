import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PeaDashboardComponent } from '../../../../../../main/webapp/app/dashboard/pea-dashboard/pea-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MockPrincipal } from '../../../helpers/mock-principal.service';
import { Principal } from '../../../../../../main/webapp/app/shared';
import { OrganizationService } from '../../../../../../main/webapp/app/shared/organization/organization.service';
import { JobPublicationCancelDialogService } from '../../../../../../main/webapp/app/dashboard/dialogs/job-publication-cancel-dialog.service';
import { JobPublicationService } from '../../../../../../main/webapp/app/shared/job-publication/job-publication.service';
import { HttpModule } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

describe('PEA-DashboardComponent', () => {
    let component: PeaDashboardComponent;
    let fixture: ComponentFixture<PeaDashboardComponent>;
    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));
    const mockOrganizationService = jasmine.createSpyObj('mockOrganizationService', ['findByExternalId']);
    const mockJobPublicationCancelDialogService = jasmine.createSpyObj('mockJobPublicationCancelDialogService', ['open']);
    const mockTranslateService = jasmine.createSpyObj('mockTranslateService', ['v']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                HttpModule,
            ],
            declarations: [PeaDashboardComponent],
            providers: [
                {
                    provide: Principal,
                    useClass: MockPrincipal
                },
                {
                    provide: OrganizationService,
                    useValue: mockOrganizationService
                },
                {
                    provide: JobPublicationCancelDialogService,
                    useValue: mockJobPublicationCancelDialogService
                },
                {
                    provide: TranslateService,
                    useValue: mockTranslateService
                },
                { provide: Store, useValue: mockStore },
                JobPublicationService
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
