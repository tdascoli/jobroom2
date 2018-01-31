import { Action } from '@ngrx/store';

export const LANGUAGE_CHANGED = 'CORE:LANGUAGE_CHANGED';
export const INIT_LANGUAGE = 'CORE:INIT_LANGUAGE';

export class InitLanguageAction implements Action {
    readonly type = INIT_LANGUAGE;

    constructor(public payload: string) {
    }
}

export class LanguageChangedAction implements Action {
    readonly type = LANGUAGE_CHANGED;

    constructor(public payload: string) {
    }
}
