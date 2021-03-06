import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Organization } from '../../shared/organization/organization.model';
import { OrganizationService } from '../../shared/organization/organization.service';

@Injectable()
export class OrganizationPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(private modalService: NgbModal,
                private router: Router,
                private organizationService: OrganizationService) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.organizationService.find(id).subscribe((organization) => {
                    this.ngbModalRef = this.organizationModalRef(component, organization);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.organizationModalRef(component, new Organization());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    organizationModalRef(component: Component, organization: Organization): NgbModalRef {
        const modalRef = this.modalService.open(component, {
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.organization = organization;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
