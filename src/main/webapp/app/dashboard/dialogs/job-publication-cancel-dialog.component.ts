import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JobPublicationService } from '../../shared/job-publication/job-publication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { JobCancellationRequest } from '../../shared/job-publication/job-publication-cancel-request';

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
                jobCenter: [false, Validators.requiredTrue],
                privateAgency: [false, Validators.requiredTrue],
                self: [false, Validators.requiredTrue]
            })
        });
        this.initValueChangeListener();
    }

    private initValueChangeListener() {
        this.jobCancelForm.controls['positionOccupied']
            .valueChanges.takeUntil(this.unsubscribe$)
            .subscribe((value) => {
                if (value) {
                    this.jobCancelForm.controls['occupiedWith'].enable();
                } else {
                    this.jobCancelForm.controls['occupiedWith'].disable();
                }
            });
        this.validateOccupiedWithCheckboxes()
    }

    private validateOccupiedWithCheckboxes() {
        Object.keys(this.getOccupiedWithFormGroup().controls).forEach((controlName) => {
            this.getOccupiedWithFormGroup().controls[controlName].valueChanges
                .distinctUntilChanged()
                .takeUntil(this.unsubscribe$)
                .subscribe((value) => {
                    const validators = this.isOccupiedWithHasValidValue(value) ? [] : [Validators.requiredTrue];
                    this.setValidators(controlName, validators);
                })
        });
    }

    private isOccupiedWithHasValidValue(value: boolean) {
        return value || Object.keys(this.getOccupiedWithFormGroup().controls)
            .map((controlName) => this.getOccupiedWithFormGroup().controls[controlName])
            .find((control) => (control.value as boolean)) !== undefined;

    }

    private setValidators(controlFiredValueChangedEvent: string, validators: ValidatorFn[]) {
        Object.keys(this.getOccupiedWithFormGroup().controls)
            .filter((controlName) => controlName !== controlFiredValueChangedEvent)
            .map((controlName) => this.getOccupiedWithFormGroup().controls[controlName])
            .forEach((control) => {
                control.setValidators(validators);
                control.updateValueAndValidity();
            })
    }

    private getOccupiedWithFormGroup() {
        return (this.jobCancelForm.controls['occupiedWith'] as FormGroup)
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    cancelJobPublication(): void {
        const cancelRequest: JobCancellationRequest = {
            id: this.id,
            accessToken: this.accessToken,
            positionOccupied: this.jobCancelForm.controls['positionOccupied'].value as boolean,
            occupiedWithJobCenter: this.getOccupiedWithBooleanValue('jobCenter'),
            occupiedWithPrivateAgency: this.getOccupiedWithBooleanValue('privateAgency'),
            selfOccupied: this.getOccupiedWithBooleanValue('self')
        };
        this.jobPublicationService
            .cancelJobPublication(cancelRequest)
            .subscribe((_) => this.activeModal.close())
    }

    private getOccupiedWithBooleanValue(key: string): boolean {
        return this.getOccupiedWithFormGroup().controls[key].value as boolean
    }
}
