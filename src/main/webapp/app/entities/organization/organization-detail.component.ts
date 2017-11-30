import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Organization } from '../../shared/organization/organization.model';
import { OrganizationService } from '../../shared/organization/organization.service';

@Component({
    selector: 'jhi-organization-detail',
    templateUrl: './organization-detail.component.html'
})
export class OrganizationDetailComponent implements OnInit, OnDestroy {

    organization: Organization;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(private eventManager: JhiEventManager,
                private organizationService: OrganizationService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOrganizations();
    }

    load(id) {
        this.organizationService.find(id).subscribe((organization) => {
            this.organization = organization;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOrganizations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'organizationListModification',
            (response) => this.load(this.organization.id)
        );
    }
}
