import { OccupationCode } from '../../../../../../main/webapp/app/shared/reference-service/occupation-code';

describe('OccupationCode', () => {

    describe('toString', () => {
        it('should return patten: type:code if classification no present', () => {
            // given
            const occupationCode = new OccupationCode(11, 'test');

            // when
            const codeString = OccupationCode.toString(occupationCode);

            // then
            expect(codeString).toEqual('test:11');
        });

        it('should return patten: type:code:classification if classification present', () => {
            // given
            const occupationCode = new OccupationCode(11, 'test', 'class');

            // when
            const codeString = OccupationCode.toString(occupationCode);

            // then
            expect(codeString).toEqual('test:11:class');
        });
    });

    describe('fromString', () => {
        it('should parse occupation code string with classification', () => {
            // given
            const codeString = 'test:11:class';

            // when
            const code = OccupationCode.fromString(codeString);

            // then
            expect(code).toEqual(new OccupationCode(11, 'test', 'class'));
        });

        it('should parse occupation code string without classification', () => {
            // given
            const codeString = 'test:11';

            // when
            const code = OccupationCode.fromString(codeString);

            // then
            expect(code).toEqual(new OccupationCode(11, 'test'));
        });
    });
});
