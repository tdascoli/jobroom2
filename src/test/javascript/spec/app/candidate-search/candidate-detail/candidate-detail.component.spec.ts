import { CandidateDetailComponent } from '../../../../../../main/webapp/app/candidate-search/candidate-detail/candidate-detail.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { cold } from 'jasmine-marbles';
import { ReferenceService } from '../../../../../../main/webapp/app/shared/reference-service/reference.service';
import { CandidateService } from '../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { OccupationService } from '../../../../../../main/webapp/app/shared/reference-service/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { candidateSearchReducer } from '../../../../../../main/webapp/app/candidate-search/state-management/reducers/candidate-search.reducers';

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
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['findOccupationByCode']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule, StoreModule.forRoot({ candidateSearch: candidateSearchReducer })],
            declarations: [CandidateDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: ReferenceService, useValue: mockReferenceService },
                { provide: CandidateService, useValue: mockCandidateService },
                { provide: OccupationService, useValue: mockOccupationService },
                { provide: TranslateService, useValue: {
                    currentLang: 'en',
                    onLangChange: Observable.never()
                } },
            ]
        })
            .overrideTemplate(CandidateDetailComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateDetailComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should populate occupationLabels', () => {
        // GIVEN
        const occupation$ = cold('-a', {
            a: {
                id: '22222',
                code: 22222,
                labels: {
                    male: 'Text-M',
                    female: 'Text-F'
                }
            }
        });
        mockOccupationService.findOccupationByCode.and.returnValue(occupation$);

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
                occupation: 'Text-M / Text-F',
                wanted: true
            }]
        });

        expect(component.jobExperiences$).toBeObservable(expected);
    });
});
