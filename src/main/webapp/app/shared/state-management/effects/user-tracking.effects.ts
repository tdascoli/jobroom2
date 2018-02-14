import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as candidateSearch from '../../../candidate-search/state-management/actions/candidate-search.actions';
import {
    CandidateProfileListLoadedAction,
    MAIL_TO_OPENED,
    PHONE_TO_OPENED,
    PRINT_CANDIDATE,
    SearchCandidatesAction
} from '../../../candidate-search/state-management/actions/candidate-search.actions';
import * as routerStore from '@ngrx/router-store';
import { RouterNavigationAction } from '@ngrx/router-store';
import {
    LOAD_NEXT_ITEM,
    LOAD_PREVIOUS_ITEM,
    NEXT_ITEM_LOADED
} from '../../components/details-page-pagination/state-management/actions/details-page-pagination.actions';
import { Action, Store } from '@ngrx/store';
import {
    CandidateSearchState,
    getCandidateProfileList,
    getSelectedCandidateProfile
} from '../../../candidate-search/state-management/state/candidate-search.state';
import { UserTrackingService } from '../../user-tracking/user-tracking.service';
import { TrackingItem } from '../../user-tracking/tracking-event';

const HIT_MATCHER_REGEX = /\/candidate-search->\/candidate-detail\/[\w-]+$/;
const SELECTED_CANDIDATE_PROFILE_ID_IDX = 3;

@Injectable()
export class UserTrackingEffects {

    @Effect({ dispatch: false })
    logCandidateSearch$: Observable<any> = this.actions$
        .ofType(candidateSearch.SEARCH_CANDIDATES)
        .switchMap((action: SearchCandidatesAction) =>
            this.trackingService.logEvent(new TrackingItem('search', {
                filter: action.payload
            })));

    @Effect({ dispatch: false })
    logResult$: Observable<any> = this.actions$
        .ofType(candidateSearch.CANDIDATE_LIST_LOADED)
        .switchMap((action: CandidateProfileListLoadedAction) =>
            this.trackingService.logEvent(new TrackingItem('result', {
                result: action.payload
            })));

    @Effect({ dispatch: false })
    logHit$: Observable<any> = this.actions$
        .ofType(routerStore.ROUTER_NAVIGATION)
        .map((action: RouterNavigationAction) => action.payload.routerState.url)
        .pairwise()
        .map(([prevUrl, actUrl]) => `${prevUrl}->${actUrl}`)
        .distinctUntilChanged()
        .filter((t) => HIT_MATCHER_REGEX.test(t))
        .map((t) => t.split('/')[SELECTED_CANDIDATE_PROFILE_ID_IDX])
        .withLatestFrom(this.getCandidateProfileList())
        .switchMap(([id, profileList]) => {
            const selectedProfile = profileList.find((profile) => profile.id === id);
            const rank = profileList[0].id === selectedProfile.id ? 1 : 0;

            return this.trackingService.logEvent(new TrackingItem('hit', { rank }));
        });

    @Effect({ dispatch: false })
    logNav$: Observable<any> = this.actions$
        .ofType(NEXT_ITEM_LOADED)
        .filter((action: any) => action.payload.feature === 'candidate-detail')
        .map((action: any) => action.payload.item.externalId)
        .withLatestFrom(this.getDirection())
        .switchMap(([externalId, direction]) =>
            this.trackingService.logEvent(new TrackingItem('nav', {
                direction,
                externalId
            }))
        );

    @Effect({ dispatch: false })
    logPrint$: Observable<any> = this.actions$
        .ofType(PRINT_CANDIDATE)
        .withLatestFrom(this.getSelectedCandidateProfile())
        .switchMap(([action, selectedProfile]) =>
            this.trackingService.logEvent(new TrackingItem('print', {
                externalId: selectedProfile.externalId
            })));

    @Effect({ dispatch: false })
    logMailTo: Observable<any> = this.actions$
        .ofType(MAIL_TO_OPENED)
        .withLatestFrom(this.getSelectedCandidateProfile())
        .switchMap(([action, selectedProfile]) =>
            this.trackingService.logEvent(new TrackingItem('mailto', {
                externalId: selectedProfile.externalId,
                target: (action as any).payload
            })));

    @Effect({ dispatch: false })
    logPhoneTo: Observable<any> = this.actions$
        .ofType(PHONE_TO_OPENED)
        .withLatestFrom(this.getSelectedCandidateProfile())
        .switchMap(([action, selectedProfile]) =>
            this.trackingService.logEvent(new TrackingItem('phoneto', {
                externalId: selectedProfile.externalId,
                target: (action as any).payload
            })));

    constructor(private actions$: Actions,
                private store: Store<CandidateSearchState>,
                private trackingService: UserTrackingService) {
    }

    private getDirection() {
        return this.actions$
            .ofType(LOAD_PREVIOUS_ITEM, LOAD_NEXT_ITEM)
            .map((action: any) => action.type);
    }

    private getSelectedCandidateProfile() {
        return this.store.select(getSelectedCandidateProfile);
    }

    private getCandidateProfileList() {
        return this.store.select(getCandidateProfileList)
    }
}
