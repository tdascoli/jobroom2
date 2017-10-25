import { Component, Input } from '@angular/core';
import { LanguageSkill } from '../../model/shared-types';

@Component({
    selector: 'jr2-languages',
    template: `
        <div *ngIf="languages?.length" [class]="containerClass">
            <h4 [class]="titleClass">{{ 'global.reference.languages' | translate }}</h4>

            <div [class]="itemClass" *ngFor="let language of languages">
                <strong>
                    {{ 'global.reference.language.' + language.code | lowercase | translate }}
                </strong>
                <span>
                    <ng-container *ngIf="language.spokenLevel">
                        {{ 'global.reference.language.spoken' | translate }}: {{ 'global.reference.language.level.' + language.spokenLevel | translate}}, </ng-container>
                    <ng-container *ngIf="language.writtenLevel">
                        {{ 'global.reference.language.written' | translate }}: {{ 'global.reference.language.level.' + language.writtenLevel | translate}}</ng-container>
                </span>
            </div>
        </div>
    `
})

export class LanguageComponent {
    @Input() languages: LanguageSkill[];
    @Input() containerClass = 'job-detail__content';
    @Input() titleClass = 'job-detail__content__title';
    @Input() itemClass = 'content__item';

    constructor() {
    }
}
