import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';

@Component({
    selector: 'jhi-organization-detail',
    templateUrl: './organization-detail.component.html'
})
export class OrganizationDetailComponent implements OnInit, OnDestroy {

    organization: Organization;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private organizationService: OrganizationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOrganizations();
    }

    load(id) {
        this.organizationService.find(id)
            .subscribe((organizationResponse: HttpResponse<Organization>) => {
                this.organization = organizationResponse.body;
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
