export class TypeaheadMultiselectModel {

    constructor(public type: string,
                public code: string,
                public label: string,
                public order = 0) {
    }

    equals(other: TypeaheadMultiselectModel): boolean {
        return !!other && other.type === this.type && other.label === this.label;
    }

    compare(other: TypeaheadMultiselectModel): number {
        return this.order <= other.order ? (this.order === other.order ? 0 : -1) : 1;
    }
}
