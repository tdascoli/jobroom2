import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobPublicationCancelDialogComponent } from './job-publication-cancel-dialog.component';
import { Injectable } from '@angular/core';

@Injectable()
export class JobPublicationCancelDialogService {

    constructor(private modalService: NgbModal) {
    }

    open(id: string, accessToken: string) {
        const modalRef = this.modalService.open(JobPublicationCancelDialogComponent, {
            container: 'nav',
            size: 'lg'
        });
        modalRef.componentInstance.id = id;
        modalRef.componentInstance.accessToken = accessToken;
    }
}
