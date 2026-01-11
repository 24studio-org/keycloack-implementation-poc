export const KEYCLOAK_CONFIG = {
  BASE_URL: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  REALM: process.env.KEYCLOAK_REALM || 'belmonte-demo',
  MASTER_REALM: process.env.KEYCLOAK_MASTER_REALM || 'master',
  ADMIN_USERNAME: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
  ADMIN_CLIENT_ID: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli',
};
