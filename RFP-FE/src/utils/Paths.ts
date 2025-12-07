export const PATHS = {
  DASHBOARD: '/',
  VENDORS: '/vendors',
  CREATE_RFP: '/create-rfp',
  PROPOSALS: '/proposals',
  PROPOSAL_DETAIL: '/proposal/:id',
  PROPOSAL_DETAIL_LINK: (id: number) => `/proposal/${id}`,
};
