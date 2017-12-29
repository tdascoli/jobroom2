import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Principal, User } from '../../../../shared';
import { OrganizationService } from '../../../../shared/organization/organization.service';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../../../shared/organization/organization.model';

export interface UserData extends User {
    organization?: Organization;
}

@Injectable()
export class UserDataResolverService implements Resolve<UserData> {

    constructor(private principal: Principal,
                private organizationService: OrganizationService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserData> {
        const identity$ = Observable.fromPromise(this.principal.identity())
            .flatMap((identity: User) => Observable.fromPromise(this.principal.hasAnyAuthority([
                'ROLE_PRIVATE_EMPLOYMENT_AGENT',
                'ROLE_PUBLIC_EMPLOYMENT_SERVICE']))
                .map((isAgent: boolean) => isAgent ? identity : null));

        const organization$ = identity$
            .flatMap((identity: User) => identity && identity.organizationId
                ? this.organizationService.findByExternalId(identity.organizationId)
                : Observable.of(null));

        return identity$
            .zip(organization$)
            .map(([identity, organization]) => Object.assign({}, identity, { organization }));
    }

}
