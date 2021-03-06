import { JobSearchToolbarComponent } from '../../../../../../main/webapp/app/job-search/job-search-toolbar/job-search-toolbar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
    LocalityService,
    OccupationPresentationService
} from '../../../../../../main/webapp/app/shared/reference-service';
import { ReactiveFormsModule } from '@angular/forms';
import { ToolbarChangedAction } from '../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
import { initialState } from '../../../../../../main/webapp/app/job-search/state-management/state/job-search.state';
import { LocalityInputType } from '../../../../../../main/webapp/app/shared/reference-service/locality-autocomplete';
import { TypeaheadMultiselectModel } from '../../../../../../main/webapp/app/shared/input-components';

describe('JobSearchToolbarComponent', () => {
    const mockOccupationOccupationPresentationService = jasmine.createSpyObj('mockOccupationOccupationPresentationService',
        ['fetchSuggestions']);

    mockOccupationOccupationPresentationService.fetchSuggestions.and.returnValue(Observable.of([new TypeaheadMultiselectModel('occupation', 'o1', 'O1')]));

    const mockLocalityService = jasmine.createSpyObj('mockLocalityService', ['fetchSuggestions']);

    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));

    let component: JobSearchToolbarComponent;
    let fixture: ComponentFixture<JobSearchToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule, ReactiveFormsModule],
            declarations: [JobSearchToolbarComponent],
            providers: [
                {
                    provide: OccupationPresentationService,
                    useValue: mockOccupationOccupationPresentationService
                },
                { provide: LocalityService, useValue: mockLocalityService },
                { provide: Store, useValue: mockStore }
            ]
        })
            .overrideTemplate(JobSearchToolbarComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchToolbarComponent);
        component = fixture.componentInstance;
        component.searchQuery = initialState.searchQuery;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should subscribe to toolbarForm value changes', () => {
            // WHEN
            component.toolbarForm.setValue({
                'baseQuery': [new TypeaheadMultiselectModel('type1', 'code1', 'label1')],
                'localityQuery': [new TypeaheadMultiselectModel('type2', 'code2', 'label2')],
            }, { emitEvent: true });

            // THEN
            expect(mockStore.dispatch).toHaveBeenCalledWith(new ToolbarChangedAction({
                baseQuery: [new TypeaheadMultiselectModel('type1', 'code1', 'label1')],
                localityQuery: [new TypeaheadMultiselectModel('type2', 'code2', 'label2')],
            }));
        });
    });

    describe('handleLocalitySelect', () => {
        it('should add non existing locality', () => {
            // GIVEN
            component.toolbarForm.get('localityQuery').setValue([new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, '371', 'Biel')]);

            // WHEN
            component.handleLocalitySelect({
                city: 'Bern',
                communalCode: 351,
                cantonCode: 'BE',
                regionCode: 'BE01',
                zipCode: '33333'
            });

            // THEN
            expect(component.toolbarForm.value).toEqual({
                baseQuery: [],
                localityQuery: [
                    new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, '371', 'Biel'),
                    new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, '351', 'Bern')
                ]
            });
        });

        it('should not add existing locality', () => {
            // GIVEN
            component.toolbarForm.get('localityQuery').setValue([new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, '371', 'Biel')]);

            // WHEN
            component.handleLocalitySelect({
                city: 'Biel',
                communalCode: 371,
                cantonCode: 'BE',
                regionCode: 'BE08',
                zipCode: '33333'
            });

            // THEN
            expect(component.toolbarForm.value).toEqual({
                baseQuery: [],
                localityQuery: [
                    new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, '371', 'Biel')
                ]
            });
        });
    });
});
