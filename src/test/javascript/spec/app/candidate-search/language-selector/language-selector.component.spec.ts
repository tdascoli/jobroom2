import { LanguageSelectorComponent } from '../../../../../../main/webapp/app/candidate-search/language-selector/language-selector.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import {
    CEFR_Level,
    LanguageSkill
} from '../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';

describe('LanguageSelectorComponent', () => {
    let component: LanguageSelectorComponent;
    let fixture: ComponentFixture<LanguageSelectorComponent>;
    let mockModelChangeListener: { (newValue: any): void };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [LanguageSelectorComponent]
        })
            .overrideTemplate(LanguageSelectorComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        mockModelChangeListener = jasmine.createSpy('mockModelChangeListener');
        fixture = TestBed.createComponent(LanguageSelectorComponent);
        component = fixture.componentInstance;
        component.languageOptions = ['en', 'de', 'fr', 'it'];
        component.registerOnChange(mockModelChangeListener);
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('writeValue', () => {
        it('should not fail with non arrays', () => {
            component.writeValue(null);

            expect(component.selectedLanguageSkills).toEqual([]);
        });

        it('should copy non empty arrays to the selectedLanguageSkills', () => {
            // GIVEN
            const selectedLanguageSkills: Array<LanguageSkill> = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null }
            ];

            // WHEN
            component.writeValue(selectedLanguageSkills);

            // THEN
            expect(component.selectedLanguageSkills).toEqual(selectedLanguageSkills);
        });

        it('should add an empty skill if parameter is an emty array', () => {
            // GIVEN
            const selectedLanguageSkills: Array<LanguageSkill> = [];

            // WHEN
            component.writeValue(selectedLanguageSkills);

            // THEN
            expect(component.selectedLanguageSkills).toEqual([
                { code: null, spoken: null, written: null }
            ]);
        })
    });

    describe('changeLanguage', () => {
        it('should handle change to a valid language', () => {
            // GIVEN
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null },
                { code: 'it', spoken: null, written: null },
            ];

            // WHEN
            component.changeLanguage(0, 'fr');

            // THEN
            const skills = [
                { code: 'fr', spoken: null, written: null },
                { code: 'de', spoken: null, written: null },
                { code: 'it', spoken: null, written: null }
            ];

            expect(component.selectedLanguageSkills).toEqual(skills);
            expect(mockModelChangeListener).toHaveBeenCalledWith(skills)
        });

        it('should handle change to an invalid language', () => {
            // GIVEN
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: 1, written: 1 },
                { code: 'it', spoken: null, written: null },
            ];

            // WHEN
            component.changeLanguage(1, null);

            // THEN
            const skills = [
                { code: 'en', spoken: null, written: null },
                { code: null, spoken: null, written: null },
                { code: 'it', spoken: null, written: null },
            ];
            const validSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'it', spoken: null, written: null }
            ];
            expect(component.selectedLanguageSkills).toEqual(skills);
            expect(mockModelChangeListener).toHaveBeenCalledWith(validSkills);
        });
    });

    describe('changeSpokenLevel', () => {
        it('should change spoken level of the selectedLanguageSkills item', () => {
            // GIVEN
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null },
                { code: 'it', spoken: null, written: null },
            ];

            // WHEN
            component.changeSpokenLevel(1, CEFR_Level.INTERMEDIATE);

            // THEN
            const skills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: CEFR_Level.INTERMEDIATE, written: null },
                { code: 'it', spoken: null, written: null },
            ];
            expect(component.selectedLanguageSkills).toEqual(skills);
            expect(mockModelChangeListener).toHaveBeenCalledWith(skills);
        });
    });

    describe('changeWrittenLevel', () => {
        it('should change written level of the selectedLanguageSkills item', () => {
            // GIVEN
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null },
                { code: 'it', spoken: null, written: null },
            ];

            // WHEN
            component.changeWrittenLevel(1, CEFR_Level.INTERMEDIATE);

            // THEN
            const skills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: CEFR_Level.INTERMEDIATE },
                { code: 'it', spoken: null, written: null },
            ];
            expect(component.selectedLanguageSkills).toEqual(skills);
            expect(mockModelChangeListener).toHaveBeenCalledWith(skills);
        });
    });

    describe('getLanguageOptions', () => {
        it('should not return already selected languages', () => {
            // GIVEN
            component.languageOptions = ['en', 'de', 'fr', 'it'];
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null }
            ];

            // WHEN
            const languageOptions = component.getLanguageOptions(null);

            // THEN
            expect(languageOptions).toEqual(['fr', 'it']);
        });

        it('should not return current selection', () => {
            // GIVEN
            component.languageOptions = ['en', 'de', 'fr', 'it'];
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null }
            ];

            // WHEN
            const languageOptions = component.getLanguageOptions('en');

            // THEN
            expect(languageOptions).toEqual(['en', 'fr', 'it']);
        });
    });

    describe('isAddEnabled', () => {
        it('should false if there is an invlid language skill', () => {
            // GIVEN
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: null, spoken: null, written: null }
            ];

            // WHEN
            const enabled = component.isAddEnabled();

            // THEN
            expect(enabled).toBeFalsy();
        });

        it('should false if all language are selected', () => {
            // GIVEN
            component.languageOptions = ['en', 'de'];
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null }
            ];

            // WHEN
            const enabled = component.isAddEnabled();

            // THEN
            expect(enabled).toBeFalsy();
        });

        it('should false if MAX_LANGUAGE_OPTIONS_NUM is reached', () => {
            // GIVEN
            component.languageOptions = ['en', 'de', 'it', 'fr', 'ch-de', 'es'];
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null },
                { code: 'it', spoken: null, written: null },
                { code: 'fr', spoken: null, written: null },
                { code: 'es', spoken: null, written: null },
            ];

            // WHEN
            const enabled = component.isAddEnabled();

            // THEN
            expect(enabled).toBeFalsy();
        });
    });

    describe('removeByIndex', () => {
        it('should remove selected language skill', () => {
            // GIVEN
            component.selectedLanguageSkills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null },
                { code: 'it', spoken: null, written: null },
            ];

            // WHEN
            const enabled = component.removeByIndex(2);

            // THEN
            const skills = [
                { code: 'en', spoken: null, written: null },
                { code: 'de', spoken: null, written: null }
            ];
            expect(component.selectedLanguageSkills).toEqual(skills);
            expect(mockModelChangeListener).toHaveBeenCalledWith(skills);
        });
    });
});
