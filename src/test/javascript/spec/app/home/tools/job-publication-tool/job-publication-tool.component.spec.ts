import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobPublicationToolComponent } from '../../../../../../../main/webapp/app/home/tools/job-publication-tool/job-publication-tool.component';
import { OccupationService } from '../../../../../../../main/webapp/app/shared/reference-service/occupation.service';

describe('JobPublicationToolComponent', () => {
    let component: JobPublicationToolComponent;
    let fixture: ComponentFixture<JobPublicationToolComponent>;
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['fetchSuggestions']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JobPublicationToolComponent],
            providers: [
                { provide: OccupationService, useValue: mockOccupationService }
            ]
        })
            .overrideTemplate(JobPublicationToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobPublicationToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
