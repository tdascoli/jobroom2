export class OccupationCode {
    static toString(occupationCode: OccupationCode) {
        if (occupationCode.classifier) {
            return `${occupationCode.type}:${occupationCode.value}:${occupationCode.classifier }`;
        } else {
            return `${occupationCode.type}:${occupationCode.value}`;
        }
    }

    static fromString(codeAsString: string): OccupationCode {
        const codeArray = codeAsString.split(':');
        const type = codeArray[0];
        const value = +codeArray[1];
        const classifier = codeArray[2];

        return new OccupationCode(value, type, classifier);
    }

    constructor(public value: number,
                public type: string,
                public classifier = null) {
    }

    toString(): string {
        return OccupationCode.toString(this);
    }
}
