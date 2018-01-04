import { JobPublicationMapper } from '../../../../../../../main/webapp/app/home/tools/job-publication-tool/job-publication-mapper';
import { createJobPublication } from '../../../shared/job-publication/utils';
import {
    CEFR_Level,
    DrivingLicenceCategory
} from '../../../../../../../main/webapp/app/shared';
import {
    Degree, Experience, Locale,
    Status
} from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.model';

describe('JobPublicationMapper', () => {
    const formModel = {
        application: {
            additionalInfo: 'aa',
            electronic: true,
            email: 'bb',
            phoneEnabled: true,
            phoneNumber: 'cc',
            url: 'dd',
            written: true
        },
        company: {
            city: 'ee',
            countryCode: 'eeee',
            houseNumber: 'ff',
            name: 'gg',
            postboxCity: 'hh',
            postboxNumber: 'ii',
            postboxZipCode: {
                zip: 'jj',
                city: 'hh'
            },
            street: 'kk',
            zipCode: {
                zip: 'll',
                city: 'ee'
            }
        },
        contact: {
            email: 'mm',
            firstName: 'nn',
            lastName: 'oo',
            phoneNumber: 'pp',
            salutation: 'MS'
        },
        job: {
            description: 'qq',
            drivingLicenseLevel: DrivingLicenceCategory.B,
            endDate: '2017-12-14',
            languageSkills: [
                {
                    code: 'DE',
                    spoken: CEFR_Level.BASIC,
                    written: CEFR_Level.PROFICIENT
                }
            ],
            location: {
                additionalDetails: 'rr',
                city: 'Bern',
                countryCode: 'CH',
                communalCode: '2323',
                zipCode: {
                    zip: '2503',
                    city: 'Bern',
                    communalCode: '2323'
                }
            },
            occupation: {
                avamOccupation: 'sfsfa',
                degree: Degree.PRIMAR_OBLIGATORISCHE_SCHULE,
                experience: Experience.LESS_THAN_1_YEAR,
                occupationSuggestion: {
                    key: '12312412',
                    label: 'sfsfa'
                }
            },
            publicationStartDate: {
                immediate: true,
                date: {
                    year: 2017,
                    month: 12,
                    day: 14
                }
            },
            publicationEndDate: {
                permanent: true,
                date: {
                    year: 2017,
                    month: 12,
                    day: 14
                }
            },
            permanent: true,
            startDate: '2017-12-14',
            startsImmediately: true,
            title: 'Test Stelle',
            workload: [80, 90],
            workingTimePercentageMax: 90,
            workingTimePercentageMin: 80
        },
        publication: {
            eures: true,
            jobroom: true
        },
        status: Status.ACTIVE,
        locale: Locale.DE,
        idAvam: '12312412',
        accessToken: '832EDF45FEB5CF436897EEE1FA4C6EDE',
        creationDate: '2017-12-14'
    };

    it('should map JobPublication To FormModel', () => {
        // GIVEN
        const jobPublication = createJobPublication();

        // WHEN
        const result = JobPublicationMapper.mapJobPublicationToFormModel(jobPublication);

        // THEN
        expect(result).toEqual(formModel);
    });

    it('should map JobPublicationForm To JobPublication', () => {
        // WHEN
        const result = JobPublicationMapper.mapJobPublicationFormToJobPublication(formModel);

        // THEN
        const expected = Object.assign({}, createJobPublication());
        delete expected.idAvam;

        expect(result).toEqual(expected);
    });
});
