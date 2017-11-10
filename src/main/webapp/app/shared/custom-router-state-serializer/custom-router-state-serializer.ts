import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { Params, RouterStateSnapshot } from '@angular/router';
import {
    StoreRouterConnectingModule,
    routerReducer,
    RouterReducerState,
    RouterStateSerializer
} from '@ngrx/router-store';

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
}

export interface State {
    routerReducer: RouterReducerState<RouterStateUrl>;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        const { url } = routerState;
        const queryParams = routerState.root.queryParams;

        // Only return an object including the URL and query params
        // instead of the entire snapshot
        return { url, queryParams };
    }
}

export const reducers: ActionReducerMap<State> = {
    routerReducer: routerReducer
};
