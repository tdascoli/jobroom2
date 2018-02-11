import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Organization } from './organization.model';
import { OrganizationPopupService } from './organization-popup.service';
import { OrganizationService } from './organization.service';

@Component({
    selector: 'jhi-organization-dialog',
    templateUrl: './organization-dialog.component.html'
})
export class OrganizationDialogComponent implements OnInit {

    organization: Organization;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private organizationService: OrganizationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.organization.id !== undefined) {
            this.subscribeToSaveResponse(
                this.organizationService.update(this.organization));
        } else {
            this.subscribeToSaveResponse(
                this.organizationService.create(this.organization));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Organization>>) {
        result.subscribe((res: HttpResponse<Organization>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Organization) {
        this.eventManager.broadcast({ name: 'organizationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-organization-popup',
    template: ''
})
export class OrganizationPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private organizationPopupService: OrganizationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.organizationPopupService
                    .open(OrganizationDialogComponent as Component, params['id']);
            } else {
                this.organizationPopupService
                    .open(OrganizationDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
