import { KeysPipe } from '../../../../../../main/webapp/app/shared/pipes/enum-keys.pipe';

describe('KeysPipe', () => {
    let pipe: KeysPipe;

    beforeEach(() => {
        pipe = new KeysPipe();
    });

    it('transforms ENUM to map', () => {
        enum ENUM {
            A, B, C, D
        }

        const expectedResult = [
            { key: 0, value: 'A' },
            { key: 1, value: 'B' },
            { key: 2, value: 'C' },
            { key: 3, value: 'D' },
        ];
        expect(pipe.transform(ENUM, null)).toEqual(expectedResult);
    });

    it('transforms ENUM with numbers to map', () => {
        enum ENUM {
            _1, _2, _3, _4
        }

        const expectedResult = [
            { key: 0, value: '1' },
            { key: 1, value: '2' },
            { key: 2, value: '3' },
            { key: 3, value: '4' },
        ];
        expect(pipe.transform(ENUM, null)).toEqual(expectedResult);
    });
});
