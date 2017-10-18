import { Action } from '@ngrx/store';

export const LOAD_NEXT_ITEM = 'LOAD_NEXT_ITEM';
export const LOAD_PREVIOUS_ITEM = 'LOAD_PREVIOUS_ITEM';
export const NEXT_ITEM_LOADED = 'NEXT_ITEM_LOADED';
export const NEXT_ITEM_ERROR = 'NEXT_ITEM_ERROR';
export const LOAD_NEXT_ITEMS_PAGE = 'LOAD_NEXT_ITEMS_PAGE';
export const LOAD_NEXT_ITEMS_PAGE_ERROR = 'LOAD_NEXT_ITEMS_PAGE_ERROR';
export const NEXT_ITEMS_PAGE_LOADED = 'NEXT_ITEMS_PAGE_LOADED';

export class LoadNextItemAction implements PaginationAction {
    readonly type = LOAD_NEXT_ITEM;

    constructor(public payload: NextItemPayload) {
    }
}

export class LoadPreviousItemAction implements PaginationAction {
    readonly type = LOAD_PREVIOUS_ITEM;

    constructor(public payload: NextItemPayload) {
    }
}

export class NextItemLoadedAction implements PaginationAction {
    readonly type = NEXT_ITEM_LOADED;

    constructor(public payload: ItemPayload) {
    }
}

export class NextItemErrorAction implements PaginationAction {
    readonly type = NEXT_ITEM_ERROR;

    constructor(public payload: Payload) {
    }
}

export class LoadNextItemsPageAction implements PaginationAction {
    readonly type = LOAD_NEXT_ITEMS_PAGE;

    constructor(public payload: Payload) {
    }
}

export class NextItemsPageLoadedAction implements PaginationAction {
    readonly type = NEXT_ITEMS_PAGE_LOADED;

    constructor(public payload: ItemPayload) {
    }
}

export class LoadNextItemsPageErrorAction implements PaginationAction {
    readonly type = LOAD_NEXT_ITEMS_PAGE_ERROR;

    constructor(public payload: Payload) {
    }
}

export interface PaginationAction extends Action {
    payload: Payload;
}

export interface Payload {
    feature: string;
}

export interface NextItemPayload extends Payload {
    currentItem: Item;
    itemsList: Array<Item>;
}

export interface ItemPayload extends Payload {
    item: Item;
}

export interface Item {
    id: string;
}

export type Actions =
    | LoadNextItemAction
    | LoadPreviousItemAction
    | NextItemLoadedAction
    | NextItemErrorAction
    | LoadNextItemsPageAction
    | NextItemsPageLoadedAction
    | LoadNextItemsPageErrorAction;
