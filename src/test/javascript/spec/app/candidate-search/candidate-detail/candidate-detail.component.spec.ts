import { CandidateDetailComponent } from '../../../../../../main/webapp/app/candidate-search/candidate-detail/candidate-detail.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { cold } from 'jasmine-marbles';
import { ReferenceService } from '../../../../../../main/webapp/app/shared/reference-service/reference.service';
import { CandidateService } from '../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { OccupationPresentationService } from '../../../../../../main/webapp/app/shared/reference-service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { candidateSearchReducer } from '../../../../../../main/webapp/app/candidate-search/state-management/reducers/candidate-search.reducers';
import { CandidateLoggingService } from '../../../../../../main/webapp/app/candidate-search/services/candidate.logging.service';
import { Location } from '@angular/common';

describe('CandidateDetailComponent', () => {
    let component: CandidateDetailComponent;
    let fixture: ComponentFixture<CandidateDetailComponent>;

    const candidateProfile: any = {
        jobExperiences: [
            {
                occupationCode: 22222,
                wanted: true
            }
        ]
    };
    const mockActivatedRoute: any = { data: Observable.of({ 'candidateProfile': candidateProfile }) };
    const mockReferenceService = jasmine.createSpyObj('mockReferenceService', ['resolveJobCenter']);
    const mockCandidateService = jasmine.createSpyObj('mockCandidateService', ['findCandidate']);
    const mockOccupationOccupationPresentationService = jasmine.createSpyObj('mockOccupationOccupationPresentationService', ['findOccupationLabelsByAvamCode']);
    const mockCandidateLoggingService = jasmine.createSpyObj('mockCandidateLoggingService', ['logCandidateEvent']);
    const mockLocation = Observable.of({ type: 'popstate', url: '/candidate-detail/blabla' });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule, StoreModule.forRoot({ candidateSearch: candidateSearchReducer })],
            declarations: [CandidateDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: ReferenceService, useValue: mockReferenceService },
                { provide: CandidateService, useValue: mockCandidateService },
                {
                    provide: OccupationPresentationService,
                    useValue: mockOccupationOccupationPresentationService
                },
                {
                    provide: TranslateService, useValue: {
                    currentLang: 'en',
                    onLangChange: Observable.never()
                }
                },
                { provide: CandidateLoggingService, useValue: mockCandidateLoggingService },
                { provide: Location, useValue: mockLocation }
            ]
        })
            .overrideTemplate(CandidateDetailComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateDetailComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should populate occupationLabels', () => {
        // GIVEN
        const occupation$ = cold('-a', {
            a: {
                male: 'Text-M',
                female: 'Text-F'
            }
        });
        mockOccupationOccupationPresentationService.findOccupationLabelsByAvamCode.and.returnValue(occupation$);

        // WHEN
        fixture.detectChanges();

        // THEN
        const expected = cold('-b', {
            b: [{
                occupationCode: 22222,
                occupationLabels: {
                    male: 'Text-M',
                    female: 'Text-F'
                },
                occupation: 'Text-M',
                wanted: true
            }]
        });

        expect(component.jobExperiences$).toBeObservable(expected);
    });
});
