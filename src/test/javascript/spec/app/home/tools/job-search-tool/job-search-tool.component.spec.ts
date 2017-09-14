import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { JobSearchToolComponent } from '../../../../../../../main/webapp/app/home/tools/job-search-tools/job-search-tool.component';
import { OccupationService } from '../../../../../../../main/webapp/app/shared/job-search/service/occupation.service';
import { LocalityService } from "../../../../../../../main/webapp/app/shared/job-search/service/locality.service";

describe('JobSearchToolComponent', () => {
    const mockRouter = new MockRouter();
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['fetchSuggestions']);
    const mockLocalityService = jasmine.createSpyObj('mockLocalityService', ['fetchSuggestions']);

    let component: JobSearchToolComponent;
    let fixture: ComponentFixture<JobSearchToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [JobSearchToolComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: OccupationService, useValue: mockOccupationService },
                { provide: LocalityService, useValue: mockLocalityService },
            ]
        })
            .overrideTemplate(JobSearchToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
