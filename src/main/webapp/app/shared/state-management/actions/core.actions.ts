import { Action } from '@ngrx/store';

export const RESET = 'CORE:RESET';

export class ResetAction implements Action {
    readonly type = RESET;

    constructor(public payload: number) {
    }
}
