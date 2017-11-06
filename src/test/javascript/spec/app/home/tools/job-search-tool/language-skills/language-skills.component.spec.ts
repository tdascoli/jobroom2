import { LanguageSkillsComponent } from '../../../../../../../../main/webapp/app/home/tools/job-publication-tool/language-skills/language-skills.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CEFR_Level } from '../../../../../../../../main/webapp/app/shared/model/shared-types';

describe('LanguageSkillsComponent', () => {
    let component: LanguageSkillsComponent;
    let fixture: ComponentFixture<LanguageSkillsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [LanguageSkillsComponent]
        })
            .overrideTemplate(LanguageSkillsComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageSkillsComponent);
        component = fixture.componentInstance;
        component.group = new FormGroup({});
        component.controlName = 'languageSkills';
        component.languageOptions = ['de', 'fr', 'it', 'en'];
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should add an form array with an empty group', () => {
            component.ngOnInit();

            const formArray = component.group.get('languageSkills');
            expect(formArray.value).toEqual([
                {
                    'code': null,
                    'spoken': null,
                    'written': null
                }
            ])
        });
    });

    describe('addNewLanguageSkill', () => {
        it('should add an empty language skill', () => {
            component.ngOnInit();

            component.addNewLanguageSkill();
            const formArray = component.group.get('languageSkills');
            expect(formArray.value).toEqual([
                {
                    'code': null,
                    'spoken': null,
                    'written': null
                },
                {
                    'code': null,
                    'spoken': null,
                    'written': null
                }
            ])
        });
    });

    describe('handleLanguageChange', () => {
        it('it should remove the changed language skill if null is selected and there are more than one skill', () => {
            component.ngOnInit();
            component.addNewLanguageSkill();

            component.handleLanguageChange(0);

            const formArray = component.group.get('languageSkills');
            expect(formArray.value).toEqual([
                {
                    'code': null,
                    'spoken': null,
                    'written': null
                }
            ])
        })
    });

    describe('isAddEnabled', () => {
        beforeEach(() => {
            component.ngOnInit();
        });

        it('should be falsy if there is a skill without code', () => {
            const enabled = component.isAddEnabled();
            expect(enabled).toBeFalsy();
        });

        it('should be falsy if there is an invalid form group', () => {
            const formArray = component.group.get('languageSkills') as FormArray;
            const firstGroup = formArray.at(0);
            firstGroup.get('code').setValue('en');

            const enabled = component.isAddEnabled();
            expect(enabled).toBeFalsy();
        });

        it('should be falsy if all languages are selected', () => {
            const formArray = component.group.get('languageSkills') as FormArray;

            formArray.at(0).get('code').setValue('de');
            formArray.at(0).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(1).get('code').setValue('fr');
            formArray.at(1).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(2).get('code').setValue('it');
            formArray.at(2).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(3).get('code').setValue('en');
            formArray.at(3).get('spoken').setValue(CEFR_Level.BASIC);

            const enabled = component.isAddEnabled();
            expect(enabled).toBeFalsy();
        });

        it('should be falsy if max language options num is reached', () => {
            component.languageOptions = ['de', 'fr', 'it', 'en', 'es', 'jp'];

            const formArray = component.group.get('languageSkills') as FormArray;

            formArray.at(0).get('code').setValue('de');
            formArray.at(0).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(1).get('code').setValue('fr');
            formArray.at(1).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(2).get('code').setValue('it');
            formArray.at(2).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(3).get('code').setValue('en');
            formArray.at(3).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(4).get('code').setValue('es');
            formArray.at(4).get('spoken').setValue(CEFR_Level.BASIC);

            const enabled = component.isAddEnabled();
            expect(enabled).toBeFalsy();
        });

        it('should be truthy if the selected opotions are valid', () => {
            const formArray = component.group.get('languageSkills') as FormArray;

            formArray.at(0).get('code').setValue('de');
            formArray.at(0).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(1).get('code').setValue('fr');
            formArray.at(1).get('spoken').setValue(CEFR_Level.BASIC);

            const enabled = component.isAddEnabled();
            expect(enabled).toBeTruthy();
        });
    });

    describe('getLanguageOptions', () => {
        it('should not return already selected language', () => {
            component.ngOnInit();

            const formArray = component.group.get('languageSkills') as FormArray;
            formArray.at(0).get('code').setValue('de');
            formArray.at(0).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(1).get('code').setValue('fr');
            formArray.at(1).get('spoken').setValue(CEFR_Level.BASIC);

            const availableOptions = component.getLanguageOptions('de');
            expect(availableOptions).toEqual(['de', 'it', 'en'])
        })
    });

    describe('removeByIndex', () => {
        it('should remove the selected language option', () => {
            component.ngOnInit();

            const formArray = component.group.get('languageSkills') as FormArray;
            formArray.at(0).get('code').setValue('de');
            formArray.at(0).get('spoken').setValue(CEFR_Level.BASIC);

            component.addNewLanguageSkill();
            formArray.at(1).get('code').setValue('fr');
            formArray.at(1).get('spoken').setValue(CEFR_Level.BASIC);

            component.removeByIndex(0)

            expect(formArray.value).toEqual([
                {
                    'code': 'fr',
                    'spoken': CEFR_Level.BASIC,
                    'written': null
                }
            ])
        })
    })
});
