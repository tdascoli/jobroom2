import { MockActivatedRoute, MockRouter } from '../../../helpers/mock-route.service';
import { JobSearchToolbarComponent } from '../../../../../../main/webapp/app/job-search/job-search-toolbar/job-search-toolbar.component';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import objectContaining = jasmine.objectContaining;

describe('JobSearchToolbarComponent', () => {
    const mockRoute = new MockActivatedRoute({});
    const mockRouter = new MockRouter();

    let component: JobSearchToolbarComponent;
    let fixture: ComponentFixture<JobSearchToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [JobSearchToolbarComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockRoute },
                { provide: Router, useValue: mockRouter },
            ]
        })
            .overrideTemplate(JobSearchToolbarComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set term from route params', fakeAsync(() => {
            // GIVEN
            mockRoute.queryParams = Observable.of({ 'term': 'test' });

            // WHEN
            component.ngOnInit();

            // THEN
            expect(component.term).toEqual('test');
        }));
    });

    describe('search', () => {
        it('should navigate to job-search with correct parameters', fakeAsync(() => {
            // GIVEN
            component.term = 'test';

            // WHEN
            component.search();

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['job-search'], { queryParams: { term: 'test' } });
        }));
    });
});
