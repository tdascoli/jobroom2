import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { JobPublication } from '../../shared/job-publication/job-publication.model';
import { Organization } from '../../shared/organization/organization.model';
import { OrganizationService } from '../../shared/organization/organization.service';
import {
    JobPublicationFilter
} from '../state-management/state/dashboard.state';

@Component({
    selector: 'jr2-pea-dashboard',
    templateUrl: './pea-dashboard.component.html',
    styleUrls: ['./pea-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeaDashboardComponent implements OnInit {
    readonly PAGE_SIZE = ITEMS_PER_PAGE;

    @Input()
    jobPublicationFilter: JobPublicationFilter;
    @Input()
    jobPublicationList: JobPublication[];
    @Input()
    totalCount: number;
    @Input()
    page: number;

    @Output()
    filterJobPublications = new EventEmitter<JobPublicationFilter>();
    @Output()
    pageChange = new EventEmitter<number>();

    identity$: Observable<any>;
    organization$: Observable<Organization>;
    jobFilterForm: FormGroup;

    constructor(private fb: FormBuilder,
                private principal: Principal,
                private organizationService: OrganizationService) {
    }

    ngOnInit(): void {
        this.jobFilterForm = this.fb.group({
            jobTitle: [this.jobPublicationFilter.jobTitle],
            onlineSinceDays: [this.jobPublicationFilter.onlineSinceDays]
        });

        this.identity$ = Observable.fromPromise(this.principal.identity());
        this.organization$ = this.identity$
            .flatMap((identity) => this.organizationService.findByExternalId(identity.organizationId));
    }

    filter(): void {
        this.filterJobPublications.emit(Object.assign({}, this.jobFilterForm.value));
    }

    changePage(page: number): void {
        this.pageChange.emit(page);
    }

}
