import { initialState } from '../state/core.state';
import { LANGUAGE_CHANGED, LanguageChangedAction } from '../actions/core.actions';
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../../custom-router-state-serializer/custom-router-state-serializer';

export function coreReducer(state = initialState, action: LanguageChangedAction) {
    let newState;

    switch (action.type) {
        case LANGUAGE_CHANGED:
            newState = Object.assign({}, state, { language: action.payload });
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
