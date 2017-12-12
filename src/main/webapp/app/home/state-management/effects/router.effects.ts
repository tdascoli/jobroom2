import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { SelectAgencyTabAction, SelectCompanyTabAction, SelectToolbarItemAction } from '../actions/layout.actions';
import { AgenciesTab, CompaniesTab, ToolbarItem } from '../state/layout.state';
import { HomeState } from '../state/home.state';

@Injectable()
export class HomeRouterEffects {

    @Effect({ dispatch: false })
    selectRoute$: Observable<Action> = this.actions$
        .ofType(ROUTER_NAVIGATION)
        .do((action: RouterNavigationAction) => {
            const url = action.payload.event.url;
            if (url.includes('/jobseekers')) {
                this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.JOB_SEEKERS));
            } else if (url.includes('/companies/jobpublication')) {
                this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.COMPANIES));
                this.store.dispatch(new SelectCompanyTabAction(CompaniesTab.JOB_PUBLICATION));
            } else if (url.includes('/companies/candidates')) {
                this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.COMPANIES));
                this.store.dispatch(new SelectCompanyTabAction(CompaniesTab.CANDIDATE_SEARCH));
            } else if (url.includes('/agents/candidates')) {
                this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.RECRUITMENT_AGENCIES));
                this.store.dispatch(new SelectAgencyTabAction(AgenciesTab.CANDIDATE_SEARCH));
            } else if (url.includes('/agents/jobpublication')) {
                this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.RECRUITMENT_AGENCIES));
                this.store.dispatch(new SelectAgencyTabAction(AgenciesTab.JOB_PUBLICATION));
            }
        });

    constructor(private actions$: Actions,
                private store: Store<HomeState>) {
    }
}
