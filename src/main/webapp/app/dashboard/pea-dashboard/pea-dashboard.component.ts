import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { JobPublication } from '../../shared/job-publication/job-publication.model';
import { Organization } from '../../shared/organization/organization.model';
import { OrganizationService } from '../../shared/organization/organization.service';
import {
    JobPublicationFilter,
    PEADashboardState
} from '../state-management/state/pea-dashboard.state';
import { JobPublicationService } from '../../shared/job-publication/job-publication.service';
import { Store } from '@ngrx/store';
import { JobPublicationDetailState } from '../state-management/state/job-publication-detail.state';
import { JobPublicationCancelDialogService } from '../dialogs/job-publication-cancel-dialog.service';
import { SubmitCancellationAction } from '../state-management/actions/pea-dashboard.actions';

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
                private organizationService: OrganizationService,
                private store: Store<PEADashboardState>,
                private jobPublicationService: JobPublicationService,
                private jobPublicationCancelDialogService: JobPublicationCancelDialogService) {
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

    isJobPublicationCancellable(status: string) {
        return this.jobPublicationService.isJobPublicationCancellable(status);
    }

    showCancellationDialog(id: string, accessToken: string) {
        const onSubmit = (cancellationData) => this.store.dispatch(new SubmitCancellationAction(cancellationData));
        this.jobPublicationCancelDialogService.open(id, accessToken, onSubmit);
    }
}
