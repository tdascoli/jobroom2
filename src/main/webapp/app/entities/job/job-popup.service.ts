import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Job } from './job.model';
import { JobService } from './job.service';

@Injectable()
export class JobPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private jobService: JobService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.jobService.find(id).subscribe((job) => {
                if (job.publicationStartDate) {
                    job.publicationStartDate = {
                        year: job.publicationStartDate.getFullYear(),
                        month: job.publicationStartDate.getMonth() + 1,
                        day: job.publicationStartDate.getDate()
                    };
                }
                if (job.publicationEndDate) {
                    job.publicationEndDate = {
                        year: job.publicationEndDate.getFullYear(),
                        month: job.publicationEndDate.getMonth() + 1,
                        day: job.publicationEndDate.getDate()
                    };
                }
                if (job.registrationDate) {
                    job.registrationDate = {
                        year: job.registrationDate.getFullYear(),
                        month: job.registrationDate.getMonth() + 1,
                        day: job.registrationDate.getDate()
                    };
                }
                if (job.cancellationDate) {
                    job.cancellationDate = {
                        year: job.cancellationDate.getFullYear(),
                        month: job.cancellationDate.getMonth() + 1,
                        day: job.cancellationDate.getDate()
                    };
                }
                if (job.startDate) {
                    job.startDate = {
                        year: job.startDate.getFullYear(),
                        month: job.startDate.getMonth() + 1,
                        day: job.startDate.getDate()
                    };
                }
                if (job.endDate) {
                    job.endDate = {
                        year: job.endDate.getFullYear(),
                        month: job.endDate.getMonth() + 1,
                        day: job.endDate.getDate()
                    };
                }
                this.jobModalRef(component, job);
            });
        } else {
            return this.jobModalRef(component, new Job());
        }
    }

    jobModalRef(component: Component, job: Job): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.job = job;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
