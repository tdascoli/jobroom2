import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { JobPublicationCancelDialogService } from '../../../../../../../main/webapp/app/dashboard/dialogs/job-publication-cancel-dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobPublicationService } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.service';
import { HttpModule } from '@angular/http';
import { Principal } from '../../../../../../../main/webapp/app/shared/auth/principal.service';
import { TranslateModule } from '@ngx-translate/core';
import { JobPublicationDetailEffects } from '../../../../../../../main/webapp/app/dashboard/state-management/effects/job-publication-detail.effects';
import { JobPublicationDetailState } from '../../../../../../../main/webapp/app/dashboard/state-management/state/job-publication-detail.state';
import { jobPublicationDetailReducer } from '../../../../../../../main/webapp/app/dashboard/state-management/reducers/job-publication-detail.reducers';

describe('JobPublicationCancelEffects', () => {
    let effects: JobPublicationDetailEffects;
    let actions$: Observable<any>;
    let store: Store<JobPublicationDetailState>;

    const mockJobPublicationCancelDialogService = jasmine.createSpyObj('mockJobPublicationCancelDialogService', ['open']);
    const mockPrincipal = jasmine.createSpyObj('mockPrincipal', ['getAuthenticationState']);
    const mockJobPublicationService = jasmine.createSpyObj('mockJobPublicationService', ['cancelJobPublication']);

    mockPrincipal.getAuthenticationState.and.returnValue(Observable.of({ email: 'email' }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ jobPublicationDetail: jobPublicationDetailReducer }),
                HttpModule,
                TranslateModule.forRoot()
            ],
            providers: [
                JobPublicationDetailEffects,
                NgbActiveModal,
                provideMockActions(() => actions$),
                {
                    provide: JobPublicationCancelDialogService,
                    useValue: mockJobPublicationCancelDialogService
                },
                {
                    provide: JobPublicationService,
                    useValue: mockJobPublicationService
                },
                {
                    provide: Principal,
                    useValue: mockPrincipal
                }
            ]
        });

        effects = TestBed.get(JobPublicationDetailEffects);
        store = TestBed.get(Store);
    });

    describe('loadJobPublication$', () => {
        // todo: implement
    });
});
