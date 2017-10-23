import { HomeEffects } from '../../../../../../../main/webapp/app/home/state-management/effects/home.effects';
import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { CandidateSearchFilter } from '../../../../../../../main/webapp/app/candidate-search/state-management/state/candidate-search.state';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { CandidateService } from '../../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { Router } from '@angular/router';
import { candidateSearchToolReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/candidate-search-tool.reducers';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolCountedAction
} from '../../../../../../../main/webapp/app/home/state-management/actions/candidate-search-tool.actions';
import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import { cold, hot } from 'jasmine-marbles';

describe('HomeEffects', () => {
    // todo: implement

    let effects: HomeEffects;
    let actions$: Observable<any>;
    let store: Store<CandidateSearchFilter>;

    const mockCandidateService = jasmine.createSpyObj('mockCandidateService', ['count']);
    const mockRouter = new MockRouter();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ candidateSearch: candidateSearchToolReducer })
            ],
            providers: [
                HomeEffects,
                provideMockActions(() => actions$),
                { provide: CandidateService, useValue: mockCandidateService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        effects = TestBed.get(HomeEffects);
        store = TestBed.get(Store);
    });

    describe('candidateSearchToolCount$', () => {
        const action = new CandidateSearchToolCountAction(initialState);

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
    })
});
