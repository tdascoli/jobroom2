import { homeLayoutReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/layout.reducers';
import {
    initialState,
    ToolbarItem
} from '../../../../../../../main/webapp/app/home/state-management/state/layout.state';
import {
    SelectAgencyTabAction,
    SelectCompanyTabAction,
    SelectToolbarItemAction
} from '../../../../../../../main/webapp/app/home/state-management/actions/layout.actions';

describe('homeLayoutReducer', () => {
    it('should update HomeLayoutState for SELECT_TOOLBAR_ITEM action', () => {
        // GIVEN
        const action = new SelectToolbarItemAction(ToolbarItem.RECRUITMENT_AGENCIES);

        // WHEN
        const newState = homeLayoutReducer(initialState, action);

        // THEN
        expect(newState.activeToolbarItem).toEqual(ToolbarItem.RECRUITMENT_AGENCIES);
    });

    it('should update HomeLayoutState for SELECT_COMPANY_TAB action', () => {
        // GIVEN
        const action = new SelectCompanyTabAction('new-tab');

        // WHEN
        const newState = homeLayoutReducer(initialState, action);

        // THEN
        expect(newState.activeCompanyTabId).toEqual('new-tab');
    });

    it('should update HomeLayoutState for SELECT_AGENCY_TAB action', () => {
        // GIVEN
        const action = new SelectAgencyTabAction('new-tab');

        // WHEN
        const newState = homeLayoutReducer(initialState, action);

        // THEN
        expect(newState.activeAgencyTabId).toEqual('new-tab');
    });
});
