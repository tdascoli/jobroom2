import { Action } from '@ngrx/store';
import { ToolbarItem } from '../state/layout.state';

export const SELECT_TOOLBAR_ITEM = 'SELECT_TOOLBAR_ITEM';
export const SELECT_COMPANY_TAB = 'SELECT_COMPANY_TAB';
export const SELECT_AGENCY_TAB = 'SELECT_AGENCY_TAB';

export class SelectToolbarItemAction implements Action {
    readonly type = SELECT_TOOLBAR_ITEM;

    constructor(public payload: ToolbarItem) {
    }
}

export class SelectCompanyTabAction implements Action {
    readonly type = SELECT_COMPANY_TAB;

    constructor(public payload: string) {
    }
}

export class SelectAgencyTabAction implements Action {
    readonly type = SELECT_AGENCY_TAB;

    constructor(public payload: string) {
    }
}
