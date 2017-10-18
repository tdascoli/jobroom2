import { Injectable } from '@angular/core';
import {
    LOAD_NEXT_ITEM, LOAD_PREVIOUS_ITEM, LoadNextItemAction, LoadNextItemsPageAction,
    LoadPreviousItemAction, NEXT_ITEMS_PAGE_LOADED, NextItemErrorAction, NextItemLoadedAction,
    NextItemsPageLoadedAction,
    LOAD_NEXT_ITEMS_PAGE_ERROR, Item, LoadNextItemsPageErrorAction,
} from '../actions/details-page-pagination.actions';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';

@Injectable()
export class DetailsPagePaginationEffects {

    @Effect()
    loadNextItem$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_ITEM, LOAD_PREVIOUS_ITEM)
        .distinctUntilChanged()
        .switchMap((action) =>
            this.getNextItem(action as LoadNextItemAction | LoadPreviousItemAction))
        .withLatestFrom(this.actions$
            .ofType(LOAD_NEXT_ITEM, LOAD_PREVIOUS_ITEM))
        .map(([selectedItem, action]: [Item, LoadNextItemAction | LoadPreviousItemAction]) => selectedItem
            ? new NextItemLoadedAction({ feature: action.payload.feature, item: selectedItem })
            : new NextItemErrorAction({ feature: action.payload.feature }));

    constructor(private actions$: Actions,
                private store: Store<any>) {
    }

    private getNextItem(loadItemAction: LoadNextItemAction | LoadPreviousItemAction): Observable<Item> {
        if (!loadItemAction.payload.itemsList || !loadItemAction.payload.itemsList.length) {
            return Observable.of(null);
        }

        const feature = loadItemAction.payload.feature;
        const selectedItemIndex = loadItemAction.payload.itemsList
            .findIndex((item) => item.id === loadItemAction.payload.currentItem.id);
        const nextItemIndex = selectedItemIndex
            + (loadItemAction instanceof LoadPreviousItemAction ? -1 : 1);
        const nextItem = loadItemAction.payload.itemsList[nextItemIndex];

        if (nextItem) {
            return Observable.of(nextItem);
        } else {
            this.store.dispatch(new LoadNextItemsPageAction({ feature }));

            return Observable.merge(
                this.actions$
                    .ofType(NEXT_ITEMS_PAGE_LOADED)
                    .filter((action: NextItemsPageLoadedAction) => action.payload.feature === feature)
                    .map((action: NextItemsPageLoadedAction) => action.payload.item),
                this.actions$
                    .ofType(LOAD_NEXT_ITEMS_PAGE_ERROR)
                    .filter((action: LoadNextItemsPageErrorAction) => action.payload.feature === feature)
                    .map((action) => null))
                .take(1);
        }
    }
}
