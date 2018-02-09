import {
    CANDIDATE_SEARCH_DEBOUNCE,
    CANDIDATE_SEARCH_SCHEDULER,
    CandidateSearchEffects
} from '../../../../../../../main/webapp/app/candidate-search/state-management/effects/candidate-search.effects';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchState,
    initialState
} from '../../../../../../../main/webapp/app/candidate-search/state-management/state/candidate-search.state';
import { Store, StoreModule } from '@ngrx/store';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { CandidateService } from '../../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { candidateSearchReducer } from '../../../../../../../main/webapp/app/candidate-search/state-management/reducers/candidate-search.reducers';
import { Router } from '@angular/router';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import * as actions from '../../../../../../../main/webapp/app/candidate-search/state-management/actions/candidate-search.actions';
import {
    NextPageLoadedAction,
    ShowCandidateListErrorAction
} from '../../../../../../../main/webapp/app/candidate-search/state-management/actions/candidate-search.actions';
import { ResponseWrapper } from '../../../../../../../main/webapp/app/shared/model/response-wrapper.model';
import { createCandidateProfile } from '../utils';
import { Headers } from '@angular/http';
import {
    LoadNextItemsPageAction,
    LoadNextItemsPageErrorAction,
    NextItemsPageLoadedAction
} from '../../../../../../../main/webapp/app/shared/components/details-page-pagination/state-management/actions/details-page-pagination.actions';
import { WINDOW } from '../../../../../../../main/webapp/app/shared/shared-libs.module';
import { ReplaySubject } from 'rxjs';
import {
    GenderAwareOccupationLabel,
    OccupationPresentationService
} from '../../../../../../../main/webapp/app/shared/reference-service/occupation-presentation.service';
import { LanguageChangedAction } from '../../../../../../../main/webapp/app/shared/state-management/actions/core.actions';

describe('CandidateSearchEffects', () => {
    let effects: CandidateSearchEffects;
    let actions$: Observable<any>;
    let store: Store<CandidateSearchState>;
    let mockState$: Observable<CandidateSearchState>;

    const mockCandidateService = jasmine.createSpyObj('mockCandidateService', ['search']);
    const mockOccupationPresentationService = jasmine.createSpyObj('mockOccupationPresentationService', ['findOccupationLabelsByCode']);
    const mockRouter = new MockRouter();

    const mockWindow = jasmine.createSpyObj('mockWindow', ['scroll']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ candidateSearch: candidateSearchReducer })
            ],
            providers: [
                CandidateSearchEffects,
                provideMockActions(() => actions$),
                { provide: CandidateService, useValue: mockCandidateService },
                {
                    provide: OccupationPresentationService,
                    useValue: mockOccupationPresentationService
                },
                { provide: Router, useValue: mockRouter },
                { provide: CANDIDATE_SEARCH_SCHEDULER, useFactory: getTestScheduler },
                { provide: CANDIDATE_SEARCH_DEBOUNCE, useValue: 30 },
                { provide: WINDOW, useValue: mockWindow }
            ],
        });

        effects = TestBed.get(CandidateSearchEffects);
        store = TestBed.get(Store);
    });

    describe('initCandidateSearch$', () => {
        const action = new actions.InitCandidateSearchAction();

        it('should return new CandidateProfileListLoadedAction if store is in initial state', () => {
            mockState$ = hot('-a|', { a: initialState })
            const candidateProfileList = [
                createCandidateProfile('c1'),
                createCandidateProfile('c2'),
                createCandidateProfile('c3')
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), candidateProfileList, 200);

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockCandidateService.search.and.returnValue(response);

            const candidateListLoadedAction = new actions.CandidateProfileListLoadedAction({
                candidateProfileList,
                totalCandidateCount: 100,
                page: 0
            });
            const expected = cold('--b|', { b: candidateListLoadedAction });

            expect(effects.initCandidateSearch$).toBeObservable(expected);
        });

        it('should not return anything if store is not in initial state', () => {
            const candidateListLoadedAction = new actions.CandidateProfileListLoadedAction({
                candidateProfileList: [],
                totalCandidateCount: 100,
                page: 0
            });

            store.dispatch(candidateListLoadedAction);

            actions$ = hot('-a', { a: action });

            const expected = cold('-');

            expect(effects.initCandidateSearch$).toBeObservable(expected);
        });

        it('should return a new ShowCandidateListErrorAction on error', () => {
            actions$ = hot('-a---', { a: action });
            const response = cold('-#|', {}, 'error');
            mockCandidateService.search.and.returnValue(response);

            const showCandidateListErrorAction = new actions.ShowCandidateListErrorAction('error');
            const expected = cold('--(b|)', { b: showCandidateListErrorAction });

            expect(effects.initCandidateSearch$).toBeObservable(expected);
        });
    });

    describe('loadCandidateList$', () => {
        it('should return a new ShowCandidateListErrorAction on error', () => {
            const action = new actions.SearchCandidatesAction({});

            actions$ = hot('-a---', { a: action });
            const response = cold('-#|', {}, 'error');
            mockCandidateService.search.and.returnValue(response);

            const showCandidateListErrorAction = new actions.ShowCandidateListErrorAction('error');
            const expected = cold('-----b', { b: showCandidateListErrorAction });

            expect(effects.loadCandidateList$).toBeObservable(expected);
        });

        it('should return a new CandidateProfileListLoadedAction on success', () => {
            const action = new actions.SearchCandidatesAction({});
            const candidateProfileList = [
                createCandidateProfile('c1'),
                createCandidateProfile('c2'),
                createCandidateProfile('c3')
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), candidateProfileList, 200);

            actions$ = hot('-a---', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockCandidateService.search.and.returnValue(response);

            const profileListLoadedAction = new actions.CandidateProfileListLoadedAction({
                candidateProfileList,
                totalCandidateCount: 100,
                page: 0
            });
            const expected = cold('-----b', { b: profileListLoadedAction });

            expect(effects.loadCandidateList$).toBeObservable(expected);
        });

        it('should call window.scroll(0,0) ', () => {
            // GIVEN
            const action = new actions.SearchCandidatesAction({});
            actions$ = new ReplaySubject(1);

            // WHEN
            (actions$ as ReplaySubject<any>).next(action);
            effects.loadCandidateList$.subscribe();

            // THEN
            expect(mockWindow.scroll).toHaveBeenCalledWith(0, 0);
        });
    });

    describe('loadNextPage$', () => {
        it('should return a new ShowCandidateListErrorAction on error', () => {
            const action = new actions.LoadNextPageAction();

            actions$ = hot('-a---', { a: action });
            const response = cold('-#|', {}, 'error');
            mockCandidateService.search.and.returnValue(response);

            const showCandidateListErrorAction = new actions.ShowCandidateListErrorAction('error');
            const expected = cold('--b', { b: showCandidateListErrorAction });

            expect(effects.loadNextPage$).toBeObservable(expected);
        });

        it('should return a new NextPageLoadedAction on success', () => {
            const action = new actions.LoadNextPageAction();
            const candidateProfileList = [
                createCandidateProfile('c1'),
                createCandidateProfile('c2'),
                createCandidateProfile('c3')
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), candidateProfileList, 200);

            actions$ = hot('-a---', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockCandidateService.search.and.returnValue(response);

            const pageLoadedAction = new actions.NextPageLoadedAction(candidateProfileList);
            const expected = cold('--b', { b: pageLoadedAction });

            expect(effects.loadNextPage$).toBeObservable(expected);
        });
    });

    describe('nextItemsPageLoaded$', () => {
        const candidateProfile1 = createCandidateProfile('c1');
        const candidateProfileList = [candidateProfile1];

        it('should return NextItemsPageLoadedAction on success', () => {
            const loadNextItemsPageAction = new LoadNextItemsPageAction({
                feature: 'candidate-detail'
            });
            const nextPageLoadedAction = new NextPageLoadedAction(candidateProfileList);

            actions$ = hot('-a-b', {
                a: loadNextItemsPageAction,
                b: nextPageLoadedAction
            });

            const nextItemsPageLoadedAction = new NextItemsPageLoadedAction({
                feature: 'candidate-detail',
                item: candidateProfile1
            });
            const expected = cold('---b', { b: nextItemsPageLoadedAction });

            expect(effects.nextItemsPageLoaded$).toBeObservable(expected);
        });

        it('should return ShowCandidateListErrorAction on error', () => {
            const loadNextItemsPageAction = new LoadNextItemsPageAction({
                feature: 'candidate-detail'
            });
            const showCandidateListErrorAction = new ShowCandidateListErrorAction({});

            actions$ = hot('-a-b', {
                a: loadNextItemsPageAction,
                b: showCandidateListErrorAction
            });

            const loadNextItemsPageErrorAction = new LoadNextItemsPageErrorAction({
                feature: 'candidate-detail'
            });
            const expected = cold('---b', { b: loadNextItemsPageErrorAction });

            expect(effects.nextItemsPageLoaded$).toBeObservable(expected);
        });
    });

    describe('languageChange$', () => {

        it('should not return anything if state.occupation is falsy', () => {
            const action = new LanguageChangedAction('de');

            actions$ = hot('-a---', { a: action });

            const expected = cold('-');
            expect(effects.languageChange$).toBeObservable(expected);
        });

        it('should return a new UpdateOccupationTranslationAction if state.occupation exists', () => {
            const occupation = { key: 'avam:7632', label: 'java' };
            store.dispatch(new actions.SearchCandidatesAction({ occupation }));
            const action = new LanguageChangedAction('de');
            actions$ = hot('-a---', { a: action });

            const label: GenderAwareOccupationLabel = {
                'default': 'java_de',
                female: 'java_f',
                male: 'java_m'
            };

            const response = cold('-a|', { a: label });
            mockOccupationPresentationService.findOccupationLabelsByCode.and.returnValue(response);

            const updateOccupationTranslationAction = new actions.UpdateOccupationTranslationAction(
                { key: 'avam:7632', label: 'java_de' }
            );

            const expected = cold('--b---', { b: updateOccupationTranslationAction });
            expect(effects.languageChange$).toBeObservable(expected);
        });
    })
});
