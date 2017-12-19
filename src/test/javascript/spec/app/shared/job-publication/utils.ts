import {
    EducationLevel, Experience,
    JobPublication, Locale, Status
} from '../../../../../../main/webapp/app/shared/job-publication/job-publication.model';
import { CEFR_Level, DrivingLicenceCategory } from '../../../../../../main/webapp/app/shared';

export function createJobPublication(): JobPublication {
    return {
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
            postboxZipCode: 'jj',
            street: 'kk',
            zipCode: 'll'
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
                    spokenLevel: CEFR_Level.BASIC,
                    writtenLevel: CEFR_Level.PROFICIENT
                }
            ],
            location: {
                additionalDetails: 'rr',
                city: 'Bern',
                communalCode: '2323',
                countryCode: 'CH',
                zipCode: '2503'
            },
            occupation: {
                avamOccupation: 'sfsfa',
                educationLevel: EducationLevel.PRIMAR_OBLIGATORISCHE_SCHULE,
                experience: Experience.LESS_THAN_1_YEAR
            },
            permanent: true,
            startDate: '2017-12-14',
            startsImmediately: true,
            title: 'Test Stelle',
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
    }
}
