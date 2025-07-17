
export const LIFERAY_CONFIG = {
  baseUrl: process.env.VITE_LIFERAY_BASE_URL || 'https://keycloak-security.apps.ocp4.namategroup.com',
  objectApiPath: '/o/c/dossiertribunals',
  username: process.env.VITE_LIFERAY_USERNAME || 'webjuris-api-service',
  password: process.env.VITE_LIFERAY_PASSWORD || '1234',
  endpoints: {
    dossiers: '/o/c/dossiertribunals',
    search: '/o/c/dossiertribunals',
    filter: '/o/c/dossiertribunals'
  }
};

export const getAuthHeader = () => {
  const credentials = btoa(`${LIFERAY_CONFIG.username}:${LIFERAY_CONFIG.password}`);
  return `Basic ${credentials}`;
};
