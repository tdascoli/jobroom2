import { NgbDateMomentParserFormatter } from '../../../../../../main/webapp/app/shared/util/ngb-date-moment-parser-formatter';

describe('NgbDateMomentParserFormatter', () => {

    let parser: NgbDateMomentParserFormatter;

    beforeAll(() => {
        parser = new NgbDateMomentParserFormatter();
    });

    describe('parse', () => {
        it('should return null when value is null', () => {
            const ngbDateStruct = parser.parse(null);
            expect(ngbDateStruct).toEqual(null);
        });

        it('should return null when invalid value is passed', () => {
            const ngbDateStruct = parser.parse('22.13.2017');
            expect(ngbDateStruct).toEqual(null);
        });

        it('should return valid NgbDateStruct', () => {
            const ngbDateStruct = parser.parse('22.12.2017');
            expect(ngbDateStruct).toEqual({
                year: 2017,
                month: 12,
                day: 22
            });
        });
    });

    describe('format', () => {
        it('should return empty string when dateStruct is null', () => {
            const formattedDate = parser.format(null);
            expect(formattedDate).toEqual('');
        });

        it('should return empty string when dateStruct contains invalid day', () => {
            const formattedDate = parser.format({
                year: 2017,
                month: 12,
                day: 32
            });
            expect(formattedDate).toEqual('');
        });

        it('should return 22.12.2017', () => {
            const formattedDate = parser.format({
                year: 2017,
                month: 12,
                day: 22
            });
            expect(formattedDate).toEqual('22.12.2017');
        })
    })
});
