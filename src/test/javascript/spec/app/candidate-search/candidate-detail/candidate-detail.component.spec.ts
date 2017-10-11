import { CandidateDetailComponent } from '../../../../../../main/webapp/app/candidate-search/candidate-detail/candidate-detail.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { cold } from 'jasmine-marbles';
import { ReferenceService } from '../../../../../../main/webapp/app/shared/reference-service/reference.service';
import { CandidateService } from '../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { OccupationService } from '../../../../../../main/webapp/app/shared/reference-service/occupation.service';
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

describe('CandidateDetailComponent', () => {
    let component: CandidateDetailComponent;
    let fixture: ComponentFixture<CandidateDetailComponent>;

    let candidateProfile: any = {
        jobExperiences: [
            {
                occupationCode: 22222
            }
        ]
    };
    let mockActivatedRoute: any = { data: Observable.of({ 'candidateProfile': candidateProfile }) };
    let mockReferenceService = jasmine.createSpyObj('mockReferenceService', ['resolveJobCenter']);
    let mockCandidateService = jasmine.createSpyObj('mockCandidateService', ['findCandidate']);
    let mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['findOccupationByCode']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [CandidateDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: ReferenceService, useValue: mockReferenceService },
                { provide: CandidateService, useValue: mockCandidateService },
                { provide: OccupationService, useValue: mockOccupationService },
                { provide: TranslateService, useValue: {} },
            ]
        })
            .overrideTemplate(CandidateDetailComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateDetailComponent);
        component = fixture.componentInstance;
    });

    it('should populate occupationLabels',
        inject([TranslateService], (mockTranslateService: any) => {
            //given
            let occupation$ = cold('-a', { a: {
                code: 22222,
                labels: {
                    en: 'Text'
                }
            } });
            mockOccupationService.findOccupationByCode.and.returnValue(occupation$);

            mockTranslateService.currentLang = 'en';
            mockTranslateService.onLangChange = cold('-b', { b: { lang: 'en' } });

            //when
            fixture.detectChanges();

            //then
            fixture.whenStable().then(() => {
                expect(candidateProfile.jobExperiences[0].occupation).toEqual('Text')
            });
        })
    );
});
