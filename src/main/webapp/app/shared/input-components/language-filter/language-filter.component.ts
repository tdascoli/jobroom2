import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CEFR_Level, LanguageSkill } from '../../';

const MAX_LANGUAGE_OPTIONS_NUM = 5;

// fixme: Review change detection strategy!!
@Component({
    selector: 'jr2-language-filter',
    templateUrl: './language-filter.component.html',
    styleUrls: ['./language-filter.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LanguageFilterComponent),
        multi: true
    }]
})
export class LanguageFilterComponent implements ControlValueAccessor {
    @Input() languageOptions: Array<string>;

    languageLevels = CEFR_Level;
    selectedLanguageSkills: Array<LanguageSkill> = [];

    writeValue(obj: any): void {
        const value = obj === null ? [] : obj;
        if (Array.isArray(value)) {
            this.selectedLanguageSkills = [...value];

            if (this.selectedLanguageSkills.length === 0) {
                this.addNewLanguageSkill();
            }
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    addNewLanguageSkill() {
        this.selectedLanguageSkills.push({
            code: null,
            written: null,
            spoken: null
        });
    }

    changeLanguage(i: number, code: any) {
        const skills = [...this.selectedLanguageSkills];
        skills[i].code = code;
        if (!code) {
            skills[i].spoken = null;
            skills[i].written = null;

            const validSkills = [...skills];
            validSkills.splice(i, 1);
            this._onChange(validSkills);
        } else {
            skills[i].spoken = CEFR_Level.NONE;
            skills[i].written = CEFR_Level.NONE;

            this._onChange(skills);
        }

        this.writeValue(skills);
    }

    changeSpokenLevel(i: number, level: CEFR_Level) {
        const skills = [...this.selectedLanguageSkills];
        skills[i].spoken = level;

        this._onChange(skills);
        this.writeValue(skills);
    }

    changeWrittenLevel(i: number, level: CEFR_Level) {
        const skills = [...this.selectedLanguageSkills];
        skills[i].written = level;

        this._onChange(skills);
        this.writeValue(skills);
    }

    getLanguageOptions(currentValue: string) {
        const codes = this.selectedLanguageSkills.map((skill) => skill.code);
        const options = this.languageOptions.filter((option) => codes.indexOf(option) < 0);

        return currentValue ? [currentValue, ...options] : [...options];
    }

    isAddEnabled() {
        const allValid = this.selectedLanguageSkills
            .reduce((acc, curr) => acc && !!curr.code, true);
        const canSelect = this.getLanguageOptions(null).length > 0;
        const maxNotReached = this.selectedLanguageSkills.length < MAX_LANGUAGE_OPTIONS_NUM;

        return allValid && canSelect && maxNotReached;
    }

    removeByIndex(idx: number) {
        const skills = [...this.selectedLanguageSkills];
        skills.splice(idx, 1);

        this._onChange(skills);
        this.writeValue(skills);
    }

    private _onChange = (_: any) => {
    }

    private _onTouched = () => {
    }
}
