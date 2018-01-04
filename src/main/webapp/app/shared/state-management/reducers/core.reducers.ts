import { initialState } from '../state/core.state';
import { RESET, ResetAction } from '../actions/core.actions';
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../../custom-router-state-serializer/custom-router-state-serializer';

export function coreReducer(state = initialState, action: ResetAction) {
    let newState;

    switch (action.type) {
        case RESET:
            newState = Object.assign({}, state, { reset: action.payload });
            break;

        default:
            newState = state;
    }

    return newState;
}

export interface CoreState {
    routerReducer: RouterReducerState<RouterStateUrl>,
    coreReducer
}

export const reducers: ActionReducerMap<CoreState> = {
    routerReducer,
    coreReducer
}
