import { CandidateService } from '../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { JobExperience } from '../../../../../../main/webapp/app/candidate-search/services/candidate';
import {
    Experience,
    Graduation,
    ISCED_1997
} from '../../../../../../main/webapp/app/shared/model/shared-types';

describe('CandidateService', () => {
    let candidateService: CandidateService;

    beforeEach(() => {
        candidateService = new CandidateService(null, null, null);
    });

    it('should get JobExperience by occupationCode', () => {
        // GIVEN
        const occupationCodes = ['avam:22222', 'sbn3:222'];
        const jobExperiences: JobExperience[] = [
            {
                occupation: {
                    avamCode: 22221,
                    bfsCode: 11,
                    sbn3Code: 222,
                    sbn5Code: 11111
                },
                occupationLabel: 'relevant1',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: true,
                wanted: true
            },
            {
                occupation: {
                    avamCode: 11111,
                    bfsCode: 11,
                    sbn3Code: 111,
                    sbn5Code: 11111
                },
                occupationLabel: 'non-relevant',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: true,
                wanted: true
            },
            {
                occupation: {
                    avamCode: 22222,
                    bfsCode: 10,
                    sbn3Code: 222,
                    sbn5Code: 11111
                },
                occupationLabel: 'relevant2',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: true,
                wanted: true
            },
            {
                occupation: {
                    avamCode: 22223,
                    bfsCode: 11,
                    sbn3Code: 222,
                    sbn5Code: 11111
                },
                occupationLabel: 'relevant3',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: true,
                wanted: true
            }
        ];

        // WHEN
        const relevantJobExperience = candidateService.getRelevantJobExperience(occupationCodes, jobExperiences);

        // THEN
        expect(relevantJobExperience.occupationLabel).toEqual('relevant2');
    });

    it('should return null when no jobExperiences', () => {
        // GIVEN
        const jobExperiences = [];

        // WHEN
        const relevantJobExperience = candidateService.getRelevantJobExperience(null, jobExperiences);

        // THEN
        expect(relevantJobExperience).toBeFalsy();
    });

    it('should get last JobExperience', () => {
        // GIVEN
        const jobExperiences: JobExperience[] = [
            {
                occupation: {
                    avamCode: 111111,
                    bfsCode: 22,
                    sbn3Code: 222,
                    sbn5Code: 22222
                },
                occupationLabel: 'relevant1',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            },
            {
                occupation: {
                    avamCode: 22222,
                    bfsCode: 22,
                    sbn3Code: 222,
                    sbn5Code: 22222
                },
                occupationLabel: 'relevant2',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: true,
                wanted: true
            }
        ];

        // WHEN
        const relevantJobExperience = candidateService.getRelevantJobExperience(null, jobExperiences);

        // THEN
        expect(relevantJobExperience.occupationLabel).toEqual('relevant2');
    });

    it('should get most experienced JobExperience', () => {
        // GIVEN
        const jobExperiences: JobExperience[] = [
            {
                occupation: {
                    avamCode: 111111,
                    bfsCode: 22,
                    sbn3Code: 222,
                    sbn5Code: 22222
                },
                occupationLabel: 'relevant1',
                experience: Experience.MORE_THAN_3_YEARS,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            },
            {
                occupation: {
                    avamCode: 22222,
                    bfsCode: 22,
                    sbn3Code: 222,
                    sbn5Code: 22222
                },
                occupationLabel: 'relevant2',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            }
        ];

        // WHEN
        const relevantJobExperience = candidateService.getRelevantJobExperience(null, jobExperiences);

        // THEN
        expect(relevantJobExperience.occupationLabel).toEqual('relevant1');
    });

    it('should get first JobExperience', () => {
        // GIVEN
        const jobExperiences: JobExperience[] = [
            {
                occupation: {
                    avamCode: 111111,
                    bfsCode: 22,
                    sbn3Code: 222,
                    sbn5Code: 22222
                },
                occupationLabel: 'relevant1',
                experience: null,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            },
            {
                occupation: {
                    avamCode: 22222,
                    bfsCode: 22,
                    sbn3Code: 222,
                    sbn5Code: 22222
                },
                occupationLabel: 'relevant2',
                experience: null,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            }
        ];

        // WHEN
        const relevantJobExperience = candidateService.getRelevantJobExperience(null, jobExperiences);

        // THEN
        expect(relevantJobExperience.occupationLabel).toEqual('relevant1');
    });
});
