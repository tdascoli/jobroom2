import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup
} from '@angular/forms';
import { CEFR_Level, LanguageSkill } from '../../../../shared';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { LanguageFilterService } from '../../../../shared/input-components/language-filter/language-filter.service';

const MAX_LANGUAGE_OPTIONS_NUM = 5;

@Component({
    selector: 'jr2-language-skills',
    templateUrl: './language-skills.component.html',
    styleUrls: ['./language-skills.component.scss']
})
export class LanguageSkillsComponent implements OnInit, OnDestroy {
    @Input() group: FormGroup;
    @Input() controlName: string;
    @Input() languageOptions: Array<string>;

    languageLevels = CEFR_Level;
    languageOptionTranslations$: Observable<Array<{ key: string, value: string }>>;

    private subscription: Subscription;

    constructor(private fb: FormBuilder,
                private languageFilterService: LanguageFilterService) {
    }

    ngOnInit(): void {
        let value = [this.createEmptyGroup()];
        if (this.group.get(this.controlName)
            && this.group.get(this.controlName).value
            && this.group.get(this.controlName).value.length) {
            value = this.group.get(this.controlName).value
                .map((val) => this.createGroup(val));
        }
        this.group.removeControl(this.controlName);
        this.group.addControl(this.controlName, new FormArray(value));

        this.registerRemovingEmptyItems();

        this.languageOptionTranslations$ = this.languageFilterService
            .getSorterLanguageTranslations(this.languageOptions);
    }

    /*
        It's a trick. FormArray.reset() does not care about array length, so when we reset to an empty array
        (e.g.: formArray.reset([]))
        it just resets all its values, but array length remains the same :(
     */
    private registerRemovingEmptyItems() {
        this.subscription = this.group.get(this.controlName).valueChanges
            .filter((change: any[]) => change && change.length > 1)
            .filter((change: any[]) => change.every((el) => !el.code))
            .subscribe((change: any[]) => {
                this.removeByIndex(change.length - 1);
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    addNewLanguageSkill() {
        const languageSkills = this.group.get(this.controlName) as FormArray;
        languageSkills.push(this.createEmptyGroup());
    }

    handleLanguageChange(idx: number) {
        const ctrl = this.languageSkills.at(idx).get('code');
        if (!ctrl.value && this.languageSkills.length > 1) {
            this.languageSkills.removeAt(idx);
        }
    }

    isAddEnabled() {
        const allCodeValid = this.selectedSkills.reduce((acc, curr) => acc && !!curr.code, true);
        const allGroupValid = this.languageSkills.controls
            .map((group) => group.valid)
            .reduce((acc, curr) => acc && curr, true);
        const selectedSkillCodes = this.selectedSkills.map((skill) => skill.code);
        const canSelect = this.languageOptions
            .some((option) => selectedSkillCodes.indexOf(option) < 0);
        const maxNotReached = this.selectedSkills.length < MAX_LANGUAGE_OPTIONS_NUM;

        return allCodeValid && allGroupValid && canSelect && maxNotReached;
    }

    getLanguageOptionTranslation(currentValue: string,
                                 languageOptionTranslations: Array<{ key: string, value: string }>): Array<{ key: string, value: string }> {
        const codes = this.selectedSkills.map((skill) => skill.code);
        return languageOptionTranslations
            .filter((translation) => currentValue && currentValue === translation.key
                ? true
                : codes.indexOf(translation.key) < 0);
    }

    removeByIndex(idx: number) {
        const languageSkills = this.group.get(this.controlName) as FormArray;
        languageSkills.removeAt(idx);
    }

    get languageSkills(): FormArray {
        return this.group.get(this.controlName) as FormArray;
    }

    get selectedSkills(): Array<LanguageSkill> {
        return this.languageSkills.value as Array<LanguageSkill>;
    }

    private createEmptyGroup(): FormGroup {
        return this.createGroup({
            code: null,
            spoken: CEFR_Level[CEFR_Level.BASIC],
            written: CEFR_Level[CEFR_Level.NONE]
        });
    }

    private createGroup(value): FormGroup {
        return this.fb.group({
            code: [value.code],
            spoken: [value.spoken],
            written: [value.written]
        })
    }
}
