import { DateUtils } from '../../../../../../main/webapp/app/shared';

describe('DateUtils', () => {

    describe('mapDateToNgbDateStruct', () => {
        it('should map Date To NgbDateStruct', () => {
            // GIVEN
            const date = new Date(2017, 11, 19);

            // WHEN
            const result = DateUtils.mapDateToNgbDateStruct(date);

            // THEN
            expect(result).toEqual({
                year: 2017,
                month: 12,
                day: 19
            });
        });

        it('should map current Date To NgbDateStruct', () => {
            // GIVEN
            const date = new Date();

            // WHEN
            const result = DateUtils.mapDateToNgbDateStruct();

            // THEN
            expect(result).toEqual({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            });
        });
    });

    describe('mapNgbDateStructToDate', () => {
        it('should map NgbDateStruct To Date', () => {
            // GIVEN
            const dateStruct = {
                year: 2017,
                month: 12,
                day: 19
            };

            // WHEN
            const result = DateUtils.mapNgbDateStructToDate(dateStruct);

            // THEN
            expect(result.getFullYear()).toEqual(2017);
            expect(result.getMonth()).toEqual(11);
            expect(result.getDate()).toEqual(19);
        });
    });

    describe('dateStringToToNgbDateStruct', () => {
        it('should map date string To NgbDateStruct', () => {
            // GIVEN
            const date = '2017-12-19';

            // WHEN
            const result = DateUtils.dateStringToToNgbDateStruct(date);

            // THEN
            expect(result).toEqual({
                year: 2017,
                month: 12,
                day: 19
            })
        });

        it('should not map empty date string To NgbDateStruct', () => {
            // GIVEN
            const date = '';

            // WHEN
            const result = DateUtils.dateStringToToNgbDateStruct(date);

            // THEN
            expect(result).toBeNull();
        });

        it('should throw error for wrong date format', () => {
            // GIVEN
            const date = 'sfaw32234-4324-2dd34';

            // WHEN
            const result = () => DateUtils.dateStringToToNgbDateStruct(date);

            // THEN
            expect(result).toThrow();
        });
    });

    describe('convertNgbDateStructToString', () => {
        it('should convert NgbDateStruct To String', () => {
            // GIVEN
            const dateStruct = {
                year: 2017,
                month: 12,
                day: 19
            };

            // WHEN
            const result = DateUtils.convertNgbDateStructToString(dateStruct);

            // THEN
            expect(result).toBe('2017-12-19');
        });

        it('should return null when dateStruct is not provided', () => {
            // WHEN
            const result = DateUtils.convertNgbDateStructToString(null);

            // THEN
            expect(result).toBeNull();
        });
    });
});
