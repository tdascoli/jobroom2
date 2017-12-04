export class OccupationCode {
    static toString(occupationCode: OccupationCode) {
        if (occupationCode.classifier) {
            return `${occupationCode.type}:${occupationCode.code}:${occupationCode.classifier }`;
        } else {
            return `${occupationCode.type}:${occupationCode.code}`;
        }
    }

    static fromString(codeAsString: string): OccupationCode {
        const codeArray = codeAsString.split(':');
        const type = codeArray[0];
        const code = +codeArray[1];
        const classifier = codeArray[2];

        return new OccupationCode(code, type, classifier);
    }

    constructor(public code: number,
                public type: string,
                public classifier = null) {
    }

    toString(): string {
        return OccupationCode.toString(this);
    }
}
