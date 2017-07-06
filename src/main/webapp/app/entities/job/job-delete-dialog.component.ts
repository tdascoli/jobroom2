import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Job } from './job.model';
import { JobPopupService } from './job-popup.service';
import { JobService } from './job.service';

@Component({
    selector: 'jhi-job-delete-dialog',
    templateUrl: './job-delete-dialog.component.html'
})
export class JobDeleteDialogComponent {

    job: Job;

    constructor(
        private jobService: JobService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.jobService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'jobListModification',
                content: 'Deleted an job'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('jobroomApp.job.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-job-delete-popup',
    template: ''
})
export class JobDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private jobPopupService: JobPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.jobPopupService
                .open(JobDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
