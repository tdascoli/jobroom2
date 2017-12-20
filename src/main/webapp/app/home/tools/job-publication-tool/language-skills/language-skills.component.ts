import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ValidationErrors
} from '@angular/forms';
import { CEFR_Level, LanguageSkill } from '../../../../shared';
import { Subscription } from 'rxjs/Subscription';

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

    private subscription: Subscription;

    constructor(private fb: FormBuilder) {
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
        const selectedSkills = this.languageSkills.value as Array<LanguageSkill>;
        const allCodeValid = selectedSkills.reduce((acc, curr) => acc && !!curr.code, true);
        const allGroupValid = this.languageSkills.controls
            .map((group) => group.valid)
            .reduce((acc, curr) => acc && curr, true);
        const canSelect = this.getLanguageOptions(null).length > 0;
        const maxNotReached = selectedSkills.length < MAX_LANGUAGE_OPTIONS_NUM;

        return allCodeValid && allGroupValid && canSelect && maxNotReached;
    }

    getLanguageOptions(currentValue: string) {
        const selectedSkills = this.languageSkills.value as Array<LanguageSkill>;
        const codes = selectedSkills.map((skill) => skill.code);
        const options = this.languageOptions.filter((option) => codes.indexOf(option) < 0);

        return currentValue ? [currentValue, ...options] : [...options];
    }

    removeByIndex(idx: number) {
        const languageSkills = this.group.get(this.controlName) as FormArray;
        languageSkills.removeAt(idx);
    }

    get languageSkills(): FormArray {
        return this.group.get(this.controlName) as FormArray;
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
