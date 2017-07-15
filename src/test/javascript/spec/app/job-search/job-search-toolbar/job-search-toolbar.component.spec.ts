import { MockActivatedRoute, MockRouter } from '../../../helpers/mock-route.service';
import { JobSearchToolbarComponent } from '../../../../../../main/webapp/app/job-search/job-search-toolbar/job-search-toolbar.component';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OccupationService, TypeaheadMultiselectModel } from '../../../../../../main/webapp/app/shared/job-search';
import objectContaining = jasmine.objectContaining;

describe('JobSearchToolbarComponent', () => {
    const mockRoute = new MockActivatedRoute({});
    const mockRouter = new MockRouter();
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService',
        ['fetchSuggestions', 'getClassifications', 'getOccupations']);

    mockOccupationService.getClassifications.and.returnValue(Observable.of([new TypeaheadMultiselectModel('classification', 'c1', 'C1')]));
    mockOccupationService.getOccupations.and.returnValue(Observable.of([new TypeaheadMultiselectModel('occupation', 'o1', 'O1')]));

    let component: JobSearchToolbarComponent;
    let fixture: ComponentFixture<JobSearchToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [JobSearchToolbarComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockRoute },
                { provide: Router, useValue: mockRouter },
                { provide: OccupationService, useValue: mockOccupationService }
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
        it('should set queryModel from route params', fakeAsync(() => {
            // GIVEN
            mockRoute.queryParams = Observable.of({ 'classification': 'c1', 'occupation': 'o1', 'query': 'q1' });

            // WHEN
            component.ngOnInit();

            // THEN
            expect(component.queryModel).toEqual([
                new TypeaheadMultiselectModel('classification', 'c1', 'C1'),
                new TypeaheadMultiselectModel('occupation', 'o1', 'O1'),
                new TypeaheadMultiselectModel('free-text', 'q1', 'q1'),
            ]);
        }));
    });

    describe('search', () => {
        it('should navigate to job-search with correct parameters', fakeAsync(() => {
            // GIVEN
            component.queryModel = [
                new TypeaheadMultiselectModel('classification', 'classification_code', 'classification_label'),
                new TypeaheadMultiselectModel('occupation', 'occupation_code', 'occupation_label'),
                new TypeaheadMultiselectModel('free-text', 'free-text_code', 'free-text_code'),
            ];

            // WHEN
            component.search();

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['job-search'], {
                queryParams: {
                    query: ['free-text_code'],
                    occupation: ['occupation_label'],
                    classification: ['classification_label'],
                }
            });
        }));
    });
});
