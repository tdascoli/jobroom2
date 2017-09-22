import { initialState, HomeLayoutState } from '../state/layout.state';
import { Actions } from '../index';
import {
    SELECT_AGENCY_TAB,
    SELECT_COMPANY_TAB,
    SELECT_TOOLBAR_ITEM
} from '../actions/layout.actions';

export function homeLayoutReducer(state = initialState, action: Actions): HomeLayoutState {
    let newState;
    switch (action.type) {
        case SELECT_TOOLBAR_ITEM:
            newState = Object.assign({}, state, {
                activeToolbarItem: action.payload
            });
            break;

        case SELECT_COMPANY_TAB:
            newState = Object.assign({}, state, {
                activeCompanyTabId: action.payload
            });
            break;

        case SELECT_AGENCY_TAB:
            newState = Object.assign({}, state, {
                activeAgencyTabId: action.payload
            });
            break;

        default:
            newState = state;
    }

    return newState;
}
