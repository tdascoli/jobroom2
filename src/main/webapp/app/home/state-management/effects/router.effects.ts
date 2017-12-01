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
            switch (url) {
                case '/jobseekers':
                    this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.JOB_SEEKERS));
                    break;
                case '/companies/jobpublication':
                    this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.COMPANIES));
                    this.store.dispatch(new SelectCompanyTabAction(CompaniesTab.JOB_PUBLICATION));
                    break;
                case '/companies/candidates':
                    this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.COMPANIES));
                    this.store.dispatch(new SelectCompanyTabAction(CompaniesTab.CANDIDATE_SEARCH));
                    break;
                case '/agents/candidates':
                    this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.RECRUITMENT_AGENCIES));
                    this.store.dispatch(new SelectAgencyTabAction(AgenciesTab.CANDIDATE_SEARCH));
                    break;
                case '/agents/jobpublication':
                    this.store.dispatch(new SelectToolbarItemAction(ToolbarItem.RECRUITMENT_AGENCIES));
                    this.store.dispatch(new SelectAgencyTabAction(AgenciesTab.JOB_PUBLICATION));
                    break;
            }
        });

    constructor(private actions$: Actions,
                private store: Store<HomeState>) {
    }
}
