import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Principal } from '../../shared/auth/principal.service';

@Injectable()
export class PeaDashboardGuard implements CanActivate {
    constructor(private principal: Principal) {
    }

    canActivate() {
        return this.principal.identity()
            .then((account) =>
                this.principal.hasAnyAuthority([
                    'ROLE_PRIVATE_EMPLOYMENT_AGENT',
                    'ROLE_PUBLIC_EMPLOYMENT_SERVICE'
                ]));
    }
}
