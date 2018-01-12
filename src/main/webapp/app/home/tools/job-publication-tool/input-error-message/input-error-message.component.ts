import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'jr2-input-error-message',
    templateUrl: './input-error-message.component.html',
    styleUrls: []
})
export class InputErrorMessageComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() path: string;
    @Input() errorCodes: Array<string>;
    @Input() keys: Array<string>;

    formControl: AbstractControl;

    ngOnInit(): void {
        this.formControl = this.formGroup.get(this.path);
    }

    isErrorShown(errorCode: string) {
        return this.formControl
            && this.formControl.hasError(errorCode)
            && this.formControl.touched;
    }
}
