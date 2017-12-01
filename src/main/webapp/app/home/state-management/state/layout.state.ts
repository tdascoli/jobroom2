export enum ToolbarItem {
    JOB_SEEKERS,
    COMPANIES,
    RECRUITMENT_AGENCIES
}

export class CompaniesTab {
    static readonly JOB_PUBLICATION = 'company-job-publication';
    static readonly CANDIDATE_SEARCH = 'company-candidate-search';
}

export class AgenciesTab {
    static readonly JOB_PUBLICATION = 'agency-job-publication';
    static readonly CANDIDATE_SEARCH = 'agency-candidate-search';
}

export interface HomeLayoutState {
    activeToolbarItem: ToolbarItem,
    activeCompanyTabId: string,
    activeAgencyTabId: string,
}

export const initialState: HomeLayoutState = {
    activeToolbarItem: ToolbarItem.JOB_SEEKERS,
    activeCompanyTabId: 'company-job-publication',
    activeAgencyTabId: 'agency-candidate-search',
};
