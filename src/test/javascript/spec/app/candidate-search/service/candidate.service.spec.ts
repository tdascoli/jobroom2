import { CandidateService } from '../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { JobExperience } from '../../../../../../main/webapp/app/candidate-search/services/candidate';
import {
    Experience,
    Graduation, ISCED_1997
} from '../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';

describe('CandidateService', () => {
    let candidateService: CandidateService;

    beforeEach(() => {
        candidateService = new CandidateService(null);
    });

    it('should get JobExperience by occupationCode', () => {
        // GIVEN
        const occupationCode = 22222;
        const jobExperiences: JobExperience[] = [
            {
                occupationCode: 22222,
                occupation: 'relevant',
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
        const relevantJobExperience = candidateService.getRelevantJobExperience(occupationCode, jobExperiences);

        // THEN
        expect(relevantJobExperience.occupation).toEqual('relevant');
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
                occupationCode: 111111,
                occupation: 'relevant1',
                experience: Experience.LESS_THAN_1_YEAR,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            },
            {
                occupationCode: 22222,
                occupation: 'relevant2',
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
        expect(relevantJobExperience.occupation).toEqual('relevant2');
    });

    it('should get most experienced JobExperience', () => {
        // GIVEN
        const jobExperiences: JobExperience[] = [
            {
                occupationCode: 111111,
                occupation: 'relevant1',
                experience: Experience.MORE_THAN_3_YEARS,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            },
            {
                occupationCode: 22222,
                occupation: 'relevant2',
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
        expect(relevantJobExperience.occupation).toEqual('relevant1');
    });

    it('should get first JobExperience', () => {
        // GIVEN
        const jobExperiences: JobExperience[] = [
            {
                occupationCode: 111111,
                occupation: 'relevant1',
                experience: null,
                graduation: Graduation.ACCEPTED,
                degree: null,
                education: ISCED_1997.ISCED1,
                remark: null,
                lastJob: false,
                wanted: true
            },
            {
                occupationCode: 22222,
                occupation: 'relevant2',
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
        expect(relevantJobExperience.occupation).toEqual('relevant1');
    });
});
