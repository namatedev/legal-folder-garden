
// Liferay Configuration
export const liferayConfig = {
  // Update these values for your Liferay instance
  baseUrl: import.meta.env.VITE_REACT_APP_LIFERAY_BASE_URL || 'https://keycloak-security.apps.ocp4.namategroup.com',
  objectApiPath: '/o/c/dossiers', // Updated to match your object name
  username: import.meta.env.VITE_REACT_APP_LIFERAY_USERNAME || 'webjuris-api-service',
  password: import.meta.env.VITE_REACT_APP_LIFERAY_PASSWORD || '1234',
  
  // Alternative: Use OAuth token instead of basic auth
  // oauthToken: import.meta.env.VITE_REACT_APP_LIFERAY_OAUTH_TOKEN,
  
  // API endpoints
  endpoints: {
    dossiers: '/o/c/dossiers',
    search: '/o/c/dossiers?search=',
    filter: '/o/c/dossiers?filter=',
  }
};

// Headers for API requests
export const getAuthHeaders = () => {
  const { username, password } = liferayConfig;
  const basicAuth = btoa(`${username}:${password}`);
  
  return {
    'Authorization': `Basic ${basicAuth}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

// Alternative OAuth headers
export const getOAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${liferayConfig.oauthToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};
