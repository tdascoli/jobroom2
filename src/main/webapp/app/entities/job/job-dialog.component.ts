import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { Job } from './job.model';
import { JobPopupService } from './job-popup.service';
import { JobService } from './job.service';

@Component({
    selector: 'jhi-job-dialog',
    templateUrl: './job-dialog.component.html'
})
export class JobDialogComponent implements OnInit {

    job: Job;
    authorities: any[];
    isSaving: boolean;
    publicationStartDateDp: any;
    publicationEndDateDp: any;
    registrationDateDp: any;
    cancellationDateDp: any;
    startDateDp: any;
    endDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private jobService: JobService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, job, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                job[field] = base64Data;
                job[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.job.id !== undefined) {
            this.subscribeToSaveResponse(
                this.jobService.update(this.job), false);
        } else {
            this.subscribeToSaveResponse(
                this.jobService.create(this.job), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Job>, isCreated: boolean) {
        result.subscribe((res: Job) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Job, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'jobroomApp.job.created'
            : 'jobroomApp.job.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'jobListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-job-popup',
    template: ''
})
export class JobPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private jobPopupService: JobPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.jobPopupService
                    .open(JobDialogComponent, params['id']);
            } else {
                this.modalRef = this.jobPopupService
                    .open(JobDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
