import { JobSearchToolbarComponent } from '../../../../../../main/webapp/app/job-search/job-search-toolbar/job-search-toolbar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { Observable } from 'rxjs/Observable';
import {
    OccupationService,
    TypeaheadMultiselectModel
} from '../../../../../../main/webapp/app/shared/job-search';
import { Store } from '@ngrx/store';
import { ExecuteSearchAction } from '../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';

describe('JobSearchToolbarComponent', () => {
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService',
        ['fetchSuggestions', 'getClassifications', 'getOccupations']);

    mockOccupationService.getClassifications.and.returnValue(Observable.of([new TypeaheadMultiselectModel('classification', 'c1', 'C1')]));
    mockOccupationService.getOccupations.and.returnValue(Observable.of([new TypeaheadMultiselectModel('occupation', 'o1', 'O1')]));

    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));

    let component: JobSearchToolbarComponent;
    let fixture: ComponentFixture<JobSearchToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [JobSearchToolbarComponent],
            providers: [
                { provide: OccupationService, useValue: mockOccupationService },
                { provide: Store, useValue: mockStore }
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

    describe('search', () => {
        it('should dispatch an ExecuteSearchAction', () => {
            // GIVEN
            const queryModel = [
                new TypeaheadMultiselectModel('classification', 'classification_code', 'classification_label'),
                new TypeaheadMultiselectModel('occupation', 'occupation_code', 'occupation_label'),
                new TypeaheadMultiselectModel('free-text', 'free-text_code', 'free-text_code'),
            ];
            component.baseQueryModel = queryModel;
            component.locationQueryModel = [];

            // WHEN
            component.search();

            // THEN
            expect(mockStore.dispatch).toHaveBeenCalledWith(new ExecuteSearchAction(queryModel, []));
        });
    });
});
