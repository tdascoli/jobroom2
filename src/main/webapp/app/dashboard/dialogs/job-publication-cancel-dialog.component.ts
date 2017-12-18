import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JobPublicationService } from '../../shared/job-publication/job-publication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { JobCancellationRequest } from '../../shared/job-publication/job-publication-cancel-request';

const jobCancelFormValidator: ValidatorFn = (jobCancelForm: FormGroup) => {
    const positionOccupiedValue = jobCancelForm.get('positionOccupied').value;
    const jobCenterValue = jobCancelForm.get('occupiedWith.jobCenter').value;
    const privateAgencyValue = jobCancelForm.get('occupiedWith.privateAgency').value;
    const selfValue = jobCancelForm.get('occupiedWith.self').value;

    if (!positionOccupiedValue) {
        return null;
    } else if (jobCenterValue || privateAgencyValue || selfValue) {
        return null;
    } else {
        return {
            occupiedWith: 'required'
        }
    }
};

@Component({
    selector: 'jr2-job-publication-cancel-dialog',
    templateUrl: './job-publication-cancel-dialog.component.html'
})
export class JobPublicationCancelDialogComponent implements OnInit, OnDestroy {

    @Input() id: string;
    @Input() accessToken: string;

    jobCancelForm: FormGroup;
    private unsubscribe$ = new Subject<void>();

    constructor(private jobPublicationService: JobPublicationService,
                private fb: FormBuilder,
                public activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
        this.jobCancelForm = this.fb.group({
            positionOccupied: true,
            occupiedWith: this.fb.group({
                jobCenter: [false],
                privateAgency: [false],
                self: [false]
            })
        }, {
            validator: jobCancelFormValidator
        });

        this.jobCancelForm.get('positionOccupied').valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((value) => {
                if (value) {
                    this.jobCancelForm.get('occupiedWith').enable();
                } else {
                    this.jobCancelForm.get('occupiedWith').disable();
                }
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    cancelJobPublication(): void {
        const cancelRequest: JobCancellationRequest = {
            id: this.id,
            accessToken: this.accessToken,
            positionOccupied: this.jobCancelForm.get('positionOccupied').value,
            occupiedWithJobCenter: this.jobCancelForm.get('occupiedWith.jobCenter').value,
            occupiedWithPrivateAgency: this.jobCancelForm.get('occupiedWith.privateAgency').value,
            selfOccupied: this.jobCancelForm.get('occupiedWith.self').value
        };
        this.jobPublicationService
            .cancelJobPublication(cancelRequest)
            .subscribe((_) => this.activeModal.close())
    }
}
