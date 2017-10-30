import { LOCALE_ID, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { KeysPipe } from './pipes/enum-keys.pipe';

import {
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLanguageHelper,
    JobroomSharedLibsModule
} from './';
import {
    LanguageSelectorComponent,
    MultiselectComponent,
    RangeInputComponent,
    SearchButtonComponent,
    TypeaheadMultiselectComponent,
    TypeaheadSingleselectComponent
} from './input-components';

@NgModule({
    imports: [
        JobroomSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        KeysPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TypeaheadMultiselectComponent,
        RangeInputComponent,
        MultiselectComponent,
        TypeaheadSingleselectComponent,
        LanguageSelectorComponent,
        SearchButtonComponent
    ],
    providers: [
        JhiLanguageHelper,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'de'
        },
        KeysPipe
    ],
    exports: [
        JobroomSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TypeaheadMultiselectComponent,
        RangeInputComponent,
        MultiselectComponent,
        TypeaheadSingleselectComponent,
        LanguageSelectorComponent,
        SearchButtonComponent,
        KeysPipe
    ]
})
export class JobroomSharedCommonModule {
}
