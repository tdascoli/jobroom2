import { CandidateProfile } from '../../../../../../main/webapp/app/candidate-search/services/candidate';
import { Gender } from '../../../../../../main/webapp/app/shared/model/shared-types';
import { Availability } from '../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';

export function createCandidateProfile(name: string): CandidateProfile {
    return {
        id: `id_${name}`,
        gender: Gender.FEMALE,
        availability: Availability.IMMEDIATE,
        residenceCantonCode: 'BE',
        workLoad: 100,
        isPublic: true,
        isProtected: false,
        showProtectedData: false,
        workForm: [],
        preferredWorkRegions: [],
        preferredWorkCantons: [],
        jobExperiences: [],
        languages: [],
        drivingCategories: [],
        highestEducationLevel: '',
        jobCenterCode: `jobCenterCode_${name}`,
        jobAdvisor: {}
    } as CandidateProfile;
}
