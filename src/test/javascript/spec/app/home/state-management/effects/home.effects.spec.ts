import { HomeEffects } from '../../../../../../../main/webapp/app/home/state-management/effects/home.effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { CandidateService } from '../../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { Router } from '@angular/router';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolCountedAction,
    UpdateOccupationTranslationAction
} from '../../../../../../../main/webapp/app/home/state-management/actions/candidate-search-tool.actions';
import { initialState as initialCandidateToolState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import { initialState as initialJobToolState } from '../../../../../../../main/webapp/app/home/state-management/state/job-search-tool.state';
import { cold, hot } from 'jasmine-marbles';
import { JobService } from '../../../../../../../main/webapp/app/job-search/services/job.service';
import { JobSearchToolCountedAction } from '../../../../../../../main/webapp/app/home/state-management/index';
import { JobSearchToolCountAction } from '../../../../../../../main/webapp/app/home/state-management/actions/job-search-tool.actions';
import { LanguageChangedAction } from '../../../../../../../main/webapp/app/shared/state-management/actions/core.actions';
import {
    GenderAwareOccupationLabel,
    OccupationPresentationService
} from '../../../../../../../main/webapp/app/shared/reference-service/occupation-presentation.service';

describe('HomeEffects', () => {
    // todo: implement

    let effects: HomeEffects;
    let actions$: Observable<any>;
    let mockState$: Observable<any>;

    const mockCandidateService = jasmine.createSpyObj('mockCandidateService', ['count']);
    const mockJobService = jasmine.createSpyObj('mockJobService', ['count']);
    const mockOccupationPresentationService = jasmine.createSpyObj('mockOccupationPresentationService', ['findOccupationLabelsByCode']);
    const mockStore = jasmine.createSpyObj('mockStore', ['select']);
    const mockRouter = new MockRouter();

    beforeEach(() => {
        mockStore.select.and.returnValue(Observable.defer(() => mockState$));
        TestBed.configureTestingModule({
            providers: [
                HomeEffects,
                provideMockActions(() => actions$),
                { provide: CandidateService, useValue: mockCandidateService },
                { provide: JobService, useValue: mockJobService },
                { provide: Router, useValue: mockRouter },
                { provide: Store, useValue: mockStore },
                {
                    provide: OccupationPresentationService,
                    useValue: mockOccupationPresentationService
                }
            ]
        });

        effects = TestBed.get(HomeEffects);
    });

    describe('candidateSearchToolCount$', () => {
        const action = new CandidateSearchToolCountAction(initialCandidateToolState);

        it('should return new CandidateSearchToolCountedAction with totalCount on success', () => {
            const totalCount = 32;

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: totalCount });
            mockCandidateService.count.and.returnValue(response);

            const countUpdatedAction = new CandidateSearchToolCountedAction(totalCount);
            const expected = cold('--b', { b: countUpdatedAction });

            expect(effects.candidateSearchToolCount$).toBeObservable(expected);
        });

        it('should return new CandidateSearchToolCountedAction with zero totalCount on exception', () => {
            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, 'numberFormatException');
            mockCandidateService.count.and.returnValue(response);

            const countUpdatedAction = new CandidateSearchToolCountedAction(0);
            const expected = cold('--b', { b: countUpdatedAction });

            expect(effects.candidateSearchToolCount$).toBeObservable(expected);
        })
    });

    describe('jobSearchToolCount$', () => {
        const action = new JobSearchToolCountAction(initialJobToolState);

        it('should return new JobSearchToolCountedAction with totalCount on success', () => {
            const totalCount = 32;

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: totalCount });
            mockJobService.count.and.returnValue(response);

            const countUpdatedAction = new JobSearchToolCountedAction(totalCount);
            const expected = cold('--b', { b: countUpdatedAction });

            expect(effects.jobSearchToolCount$).toBeObservable(expected);
        });

        it('should return new JobSearchToolCountedAction with zero totalCount on exception', () => {
            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, 'numberFormatException');
            mockJobService.count.and.returnValue(response);

            const countUpdatedAction = new JobSearchToolCountedAction(0);
            const expected = cold('--b', { b: countUpdatedAction });

            expect(effects.jobSearchToolCount$).toBeObservable(expected);
        })
    });

    describe('languageChange$', () => {

        it('should not return anything if state.occupation is falsy', () => {
            mockState$ = Observable.of({});
            const action = new LanguageChangedAction('de');

            actions$ = hot('-a---', { a: action });

            const expected = cold('-');
            expect(effects.languageChange$).toBeObservable(expected);
        });

        it('should return a new UpdateOccupationTranslationAction if state.occupation exists', () => {
            const occupation = { key: 'avam:7632', label: 'java' };
            mockState$ = Observable.of({ occupation });

            const action = new LanguageChangedAction('de');
            actions$ = hot('-a---', { a: action });

            const label: GenderAwareOccupationLabel = {
                'default': 'java_de',
                female: 'java_f',
                male: 'java_m'
            };

            const response = cold('-a|', { a: label });
            mockOccupationPresentationService.findOccupationLabelsByCode.and.returnValue(response);

            const updateOccupationTranslationAction = new UpdateOccupationTranslationAction(
                { key: 'avam:7632', label: 'java_de' }
            );

            const expected = cold('--b---', { b: updateOccupationTranslationAction });
            expect(effects.languageChange$).toBeObservable(expected);
        });
    })
});
