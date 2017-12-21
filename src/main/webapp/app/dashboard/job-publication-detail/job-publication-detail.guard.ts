import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    getLoadingStatus,
    JobPublicationDetailState,
    LoadingStatus
} from '../state-management/state/job-publication-detail.state';
import { Store } from '@ngrx/store';
import { LoadJobPublicationAction } from '../state-management/actions/job-publication-detail.actions';

@Injectable()
export class JobPublicationDetailGuard implements CanActivate {

    constructor(private store: Store<JobPublicationDetailState>,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = route.params['id'];
        const accessToken = route.params['accessToken'];

        this.store.dispatch(new LoadJobPublicationAction({ id, accessToken }));

        return this.store.select(getLoadingStatus)
            .filter((status: LoadingStatus) => status !== LoadingStatus.INITIAL)
            .take(1)
            .switchMap((status: LoadingStatus) => {
                if (status === LoadingStatus.OK) {
                    return Observable.of(true)
                } else {
                    this.router.navigate(['/error']);

                    return Observable.of(false)
                }
            })
    }
}
