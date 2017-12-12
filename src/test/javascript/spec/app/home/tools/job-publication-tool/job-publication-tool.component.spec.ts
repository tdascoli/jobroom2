import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobPublicationToolComponent } from '../../../../../../../main/webapp/app/home/tools/job-publication-tool/job-publication-tool.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageSkillService } from '../../../../../../../main/webapp/app/candidate-search/services/language-skill.service';
import { OccupationPresentationService } from '../../../../../../../main/webapp/app/shared/reference-service/occupation-presentation.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { JobPublicationService } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.service';

describe('JobPublicationToolComponent', () => {
    let component: JobPublicationToolComponent;
    let fixture: ComponentFixture<JobPublicationToolComponent>;
    const mockOccupationPresentationService = jasmine.createSpyObj('mockOccupationPresentationService',
        ['fetchOccupationSuggestions', 'occupationFormatter']);
    const mockLanguageSkillService = jasmine.createSpyObj('mockLanguageSkillService', ['getLanguages']);
    const mockJobPublicationService = jasmine.createSpyObj('mockJobPublicationService', ['findById', 'save']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [JobPublicationToolComponent],
            providers: [
                {
                    provide: OccupationPresentationService,
                    useValue: mockOccupationPresentationService
                },
                {
                    provide: JobPublicationService,
                    useValue: mockJobPublicationService
                },
                { provide: LanguageSkillService, useValue: mockLanguageSkillService },
                { provide: TranslateService, useValue: { currentLang: 'de', onLangChange: Observable.never() } }
            ]
        })
            .overrideTemplate(JobPublicationToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobPublicationToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
