import { WorkingTimeRangePipe } from '../../../../../../main/webapp/app/shared/pipes/working-time-range.pipe';

describe('WorkingTimeRangePipe', () => {
    let pipe: WorkingTimeRangePipe;

    beforeEach(() => {
        pipe = new WorkingTimeRangePipe();
    });

    describe('transform', () => {
        it('should display a singe value if min and max values are equal', () => {
            // GIVEN
            const value = [80, 80];

            // WHEN
            const formattedValue = pipe.transform(value);

            // THEN
            expect(formattedValue).toEqual('80%');
        });

        it('should display a formatted range if min and max values are not equal', () => {
            // GIVEN
            const value = [80, 100];

            // WHEN
            const formattedValue = pipe.transform(value);

            // THEN
            expect(formattedValue).toEqual('80% - 100%');
        });
    });
});
