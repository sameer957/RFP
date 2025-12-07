const API_ENDPOINTS = {
  VENDOR: {
    CREATE: `/api/v1/create-vendor`,
    FETCH: (name: string) => `/api/v1/vendors?search=${name}`,
    DELETE: (id: number) => `/api/v1/vendors/${id}`,
  },

  RFP: {
    CREATE: `/api/v1/create-prompt`,
    SEND_EMAIL: `/api/v1/send-mail`,
    GET_RFPS: `/api/v1/get-rfps`,
    SINGLE_RFP_DETAIL: (id: number) => `/api/v1/get-rfp/${id}`,
  },
  TEMPLATES: {
    GET_TEMPLATES: `/api/v1/get-templates`,
    SAVE_TEMPLATE: `/api/v1/save-template`,
    GET_SAVED_TEMPLATE: `/api/v1/get-saved-template`,
  },
  DASHBOARD: {
    BRIEF_DATA: `/api/v1/brief-data`,
    ACTIVITES: `/api/v1/activities`,
    HISTORY: `/api/v1/get-history`,
    HISTORY_DETAIL: (id: number) => `/api/v1/get-history-detail/${id}`,
  },
};

export default API_ENDPOINTS;
