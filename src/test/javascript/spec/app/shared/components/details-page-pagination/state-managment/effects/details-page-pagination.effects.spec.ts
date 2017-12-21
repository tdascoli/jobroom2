import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
    DetailsPagePaginationEffects
} from '../../../../../../../../../main/webapp/app/shared/components/details-page-pagination/state-management/effects/details-page-pagination.effects';
import { Observable } from 'rxjs/Observable';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import {
    LoadNextItemAction, LoadPreviousItemAction,
    NextItemLoadedAction,
    NextItemErrorAction, NextItemsPageLoadedAction, LoadNextItemsPageErrorAction
} from '../../../../../../../../../main/webapp/app/shared/components/details-page-pagination/state-management/actions/details-page-pagination.actions';
import { CandidateLoggingService } from '../../../../../../../../../main/webapp/app/candidate-search/services/candidate.logging.service';

describe('DetailsPagePaginationEffects', () => {
    let effects: DetailsPagePaginationEffects;
    let actions$: Observable<any>;
    let store: Store<any>;

    const mockCandidateLoggingService = jasmine.createSpyObj('mockCandidateLoggingService', ['logCandidateEvent', 'logSearchEvent']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({})
            ],
            providers: [
                DetailsPagePaginationEffects,
                provideMockActions(() => actions$),
                { provide: CandidateLoggingService, useValue: mockCandidateLoggingService }
            ],
        });

        effects = TestBed.get(DetailsPagePaginationEffects);
        store = TestBed.get(Store);
    });

    describe('loadNextItem$', () => {
        const job1 = {
            id: '0',
            externalId: 'extId0',
            title: 'title-0',
            publicationEndDate: new Date()
        };
        const job2 = {
            id: '1',
            externalId: 'extId1',
            title: 'title-1',
            publicationEndDate: new Date()
        };

        it('should return NextItemLoadedAction with next item', () => {
            const action = new LoadNextItemAction({
                feature: 'feature',
                itemsList: [job1, job2],
                currentItem: job1
            });
            actions$ = hot('-a', { a: action });
            const nextItemLoadedAction = new NextItemLoadedAction({
                item: job2,
                feature: 'feature'
            });
            const expected = cold('-b', { b: nextItemLoadedAction });

            expect(effects.loadNextItem$).toBeObservable(expected);
        });

        it('should return NextItemLoadedAction with previous item', () => {
            const action = new LoadPreviousItemAction({
                feature: 'feature',
                itemsList: [job1, job2],
                currentItem: job2
            });
            actions$ = hot('-a', { a: action });
            const nextItemLoadedAction = new NextItemLoadedAction({
                item: job1,
                feature: 'feature'
            });
            const expected = cold('-b', { b: nextItemLoadedAction });

            expect(effects.loadNextItem$).toBeObservable(expected);
        });

        it('should return NextItemLoadedAction with next item from another page', () => {
            const loadNextItemAction = new LoadNextItemAction({
                feature: 'feature',
                itemsList: [job1],
                currentItem: job1
            });
            const nextPageLoadedAction = new NextItemsPageLoadedAction({
                feature: 'feature', item: job2
            });
            actions$ = hot('-a-c', { a: loadNextItemAction, c: nextPageLoadedAction });

            const nextItemLoadedAction = new NextItemLoadedAction({
                item: job2,
                feature: 'feature'
            });
            const expected = cold('---b', { b: nextItemLoadedAction });

            expect(effects.loadNextItem$).toBeObservable(expected);
        });

        it('should return NextItemErrorAction on error', () => {
            const action = new LoadNextItemAction({
                feature: 'feature',
                itemsList: [],
                currentItem: job2
            });
            actions$ = hot('-a', { a: action });
            const nextItemLoadedAction = new NextItemErrorAction({
                feature: 'feature'
            });
            const expected = cold('-b', { b: nextItemLoadedAction });

            expect(effects.loadNextItem$).toBeObservable(expected);
        });

        it('should return NextItemErrorAction when fetch from another page', () => {
            const loadNextItemAction = new LoadNextItemAction({
                feature: 'feature',
                itemsList: [job1],
                currentItem: job1
            });
            const nextPageLoadedAction = new LoadNextItemsPageErrorAction({
                feature: 'feature'
            });
            actions$ = hot('-a-c', { a: loadNextItemAction, c: nextPageLoadedAction });

            const nextItemLoadedAction = new NextItemErrorAction({
                feature: 'feature'
            });
            const expected = cold('---b', { b: nextItemLoadedAction });

            expect(effects.loadNextItem$).toBeObservable(expected);
        });
    });
});
