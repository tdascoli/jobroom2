import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { User, UserService } from '../../shared';
import { OrganizationSuggestion } from '../../shared/organization/organization.model';
import { OrganizationService } from '../../shared/organization/organization.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jhi-user-mgmt-detail',
    templateUrl: './user-management-detail.component.html'
})
export class UserMgmtDetailComponent implements OnInit, OnDestroy {

    user: User;
    userOrganization$: Observable<OrganizationSuggestion>;
    private subscription: Subscription;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private organizationService: OrganizationService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['login']);
        });
    }

    load(login) {
        this.userService.find(login).subscribe((user) => {
            this.user = user;
            if (this.user.organizationId) {
                this.userOrganization$ = this.organizationService.findByExternalId(this.user.organizationId)
                    .map((organization) => organization as OrganizationSuggestion);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
