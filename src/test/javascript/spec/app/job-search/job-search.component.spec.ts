import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { JobSearchComponent } from '../../../../../main/webapp/app/job-search/job-search.component';
import { JobService } from '../../../../../main/webapp/app/entities/job/job.service';
import { JobroomTestModule } from '../../test.module';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '../../helpers/mock-route.service';
import { Observable } from 'rxjs/Rx';
import { ResponseWrapper } from '../../../../../main/webapp/app/shared/model/response-wrapper.model';
import { Headers } from '@angular/http';
import { JobSearchRequest } from '../../../../../main/webapp/app/job-search/job-search-request';
import { Job } from '../../../../../main/webapp/app/entities/job/job.model';

describe('JobSearchComponent', () => {
    const mockJobService = jasmine.createSpyObj('mockJobService', ['search']);
    mockJobService.search.and.returnValue(Observable.of(new ResponseWrapper(new Headers(), [new Job()], 200)));
    const mockRoute = new MockActivatedRoute({});

    let component: JobSearchComponent;
    let fixture: ComponentFixture<JobSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [JobSearchComponent],
            providers: [
                { provide: JobService, useValue: mockJobService },
                { provide: ActivatedRoute, useValue: mockRoute },
            ]
        })
            .overrideTemplate(JobSearchComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should call jobService.search with default JobSearchRequest if term query param do not exists', fakeAsync(() => {
            // GIVEN
            mockRoute.queryParams = Observable.of({});

            // WHEN
            component.ngOnInit();

            // THEN
            expect(mockJobService.search).toHaveBeenCalledWith(new JobSearchRequest([]));
            expect(component.terms).toEqual('');
            expect(component.totalCount).toEqual(1);
            expect(component.jobList).toContain(new Job());
        }));

        it('should call jobService.search with a valid JobSearchRequest if term query param exists', fakeAsync(() => {
            // GIVEN
            mockRoute.queryParams = Observable.of({ 'classification': 'c1', 'occupation': 'o1', 'query': 'q1' });

            // WHEN
            component.ngOnInit();

            // THEN
            expect(mockJobService.search).toHaveBeenCalledWith(new JobSearchRequest(['c1,o1,q1']));
            expect(component.terms).toEqual('c1,o1,q1');
            expect(component.totalCount).toEqual(1);
            expect(component.jobList).toContain(new Job());
        }));
    });
});
